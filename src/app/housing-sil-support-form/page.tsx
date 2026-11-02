"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { getFormSession } from "@/src/services/crud";
import { update, show, index } from "@/src/services/crud";
import { me } from "@/src/services/auth";
import Tracker from "@/src/components/Tracker";
import { mapApiResponseToFormData } from "@/src/components/HousingSilSupport/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/HousingSilSupport/sectionsConfig";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { HousingSilSupportResponse } from "@/src/components/HousingSilSupport/ApiResponse";
import AgreementFormaData from "@/src/components/HousingSilSupport/AgreementFormData";

import Image from "next/image";
import LoginModal from "@/src/components/ConfidentialInformation/LoginModal";
import api from "@/src/utils/api";
import { IconLoader, IconFileText } from "@tabler/icons-react";
import PdfExtractionModal from "@/src/components/PdfExtractionModal";

const SECTION_NAMES = [
  "HousingSilSupport",
  "ReviewSignatures"
] as const;

type SectionKey = (typeof SECTION_NAMES)[number];

type ValidationErrors = Record<string, string[]>;

const createInitialOpenSections = (): Record<SectionKey, boolean> => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = true;
    return acc;
  }, {} as Record<SectionKey, boolean>);
};

const createSectionRefs = () => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = React.createRef<HTMLDivElement | null>();
    return acc;
  }, {} as Record<SectionKey, React.RefObject<HTMLDivElement | null>>);
};

export default function HousingSilSupportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [sessionClientType, setSessionClientType] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [formData, setFormData] = useState(AgreementFormaData);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formSubmissionError, setFormSubmissionError] = useState<string>("");

  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(initialOpenSections);
  const [isExpandedAll, setIsExpandedAll] = useState(true);

  const toggleExpandAll = () => {
    const nextState = !isExpandedAll;
    setIsExpandedAll(nextState);
    setOpenSections(
      SECTION_NAMES.reduce((acc, sectionKey) => {
        acc[sectionKey] = nextState;
        return acc;
      }, {} as Record<SectionKey, boolean>)
    );
  };

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [autofilling, setAutofilling] = useState(false);

  const handleAutofill = async () => {
    setAutofilling(true);
    setFormSubmissionError("");
    try {
      const targetUserId = sessionUserId || searchParams.get("userid") || "";
      const targetClientType = sessionClientType || searchParams.get("client_type") || "";

      if (!targetUserId || !targetClientType) {
        alert("Client session identifiers missing. Please ensure userid and client_type are present in the URL.");
        setAutofilling(false);
        return;
      }

      const schema = {
        formData: {
          housing_separate: "string ('Yes' or 'No' - housing arrangement is separate from SIL support provider)",
          change_sil_without_losing_home: "string ('Yes' or 'No' - choice of SIL provider is independent of housing arrangement)",
          tenancy_separate: "string ('Yes' or 'No' - tenancy agreement is separate from the supports received)",
          explained_to_me: "string ('Yes' or 'No' - arrangements clearly explained and rights understood)",

          participant_name: "string (Full name of participant)",
          date: "string (Date YYYY-MM-DD)",
          support_person: "string (Name of support person or advocate if present)",

          signer_type: "string ('participant' or 'representative')",
          participant_date: "string (Date participant signed YYYY-MM-DD)",

          representative_name: "string (Full name of authorized representative)",
          representative_relation: "string (Relationship to participant, e.g. Parent, Guardian, Advocate)",
          representative_date: "string (Date representative signed YYYY-MM-DD)",

          guardian_nominee_name: "string (Full name of guardian/nominee)",
          guardian_nominee_date: "string (Date guardian signed YYYY-MM-DD)",

          key_team_member_name: "string (Full name of staff key team member / assessor)",
          key_team_member_date: "string (Date staff signed YYYY-MM-DD)"
        }
      };

      const response = await api.post("/ai/autofill-form", {
        user_id: targetUserId,
        client_type: targetClientType,
        schema: schema
      });

      if (response.data.success) {
        const d = response.data.data;
        const isDummy = (str: string) => {
          const lower = str.trim().toLowerCase();
          return (
            lower === "" ||
            lower === "n/a" ||
            lower === "none" ||
            lower === "unknown" ||
            lower === "undefined" ||
            lower === "not available" ||
            lower === "no information" ||
            lower.includes("not mentioned") ||
            lower.includes("not applicable") ||
            lower.includes("not found") ||
            lower.includes("not specified") ||
            lower.includes("none specified") ||
            lower.includes("not explicitly")
          );
        };

        const parseDateToIso = (rawStr: string) => {
          if (!rawStr) return "";
          const str = rawStr.trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

          const dmyMatch = str.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
          if (dmyMatch) {
            const p1 = parseInt(dmyMatch[1], 10);
            const p2 = parseInt(dmyMatch[2], 10);
            const year = dmyMatch[3];
            if (p1 > 12) {
              return `${year}-${String(p2).padStart(2, "0")}-${String(p1).padStart(2, "0")}`;
            }
            if (p2 > 12) {
              return `${year}-${String(p1).padStart(2, "0")}-${String(p2).padStart(2, "0")}`;
            }
            return `${year}-${String(p2).padStart(2, "0")}-${String(p1).padStart(2, "0")}`;
          }

          const dt = new Date(str);
          if (!isNaN(dt.getTime())) {
            return dt.toISOString().split("T")[0];
          }
          return str;
        };

        const normalizeYesNo = (val: string) => {
          const lower = val.trim().toLowerCase();
          if (lower === "yes" || lower === "1" || lower === "true") return "Yes";
          if (lower === "no" || lower === "0" || lower === "false") return "No";
          return val;
        };

        if (d.formData) {
          setFormData(prev => {
            const sanitized = { ...prev };
            Object.keys(d.formData).forEach(key => {
              const val = d.formData[key];
              const prevVal = (prev as any)[key];

              if (typeof prevVal === 'number') {
                if (val === 1 || val === "1" || val === true || val === "true" || (typeof val === 'string' && val.trim().toLowerCase() === "yes")) {
                  (sanitized as any)[key] = 1;
                } else if (typeof val === 'number') {
                  (sanitized as any)[key] = val;
                } else {
                  (sanitized as any)[key] = 0;
                }
              } else if (typeof val === 'string') {
                if (isDummy(val)) {
                  (sanitized as any)[key] = "";
                } else if (key.includes('date')) {
                  (sanitized as any)[key] = parseDateToIso(val);
                } else if (['housing_separate', 'change_sil_without_losing_home', 'tenancy_separate', 'explained_to_me'].includes(key)) {
                  (sanitized as any)[key] = normalizeYesNo(val);
                } else {
                  (sanitized as any)[key] = val;
                }
              } else if (val !== undefined && val !== null) {
                (sanitized as any)[key] = val;
              }
            });

            return sanitized;
          });
        }

        window.alert("Housing and SIL Supports form auto-filled successfully using AI!");
        setIsExpandedAll(true);
        setOpenSections(
          SECTION_NAMES.reduce((acc, sectionKey) => {
            acc[sectionKey] = true;
            return acc;
          }, {} as Record<SectionKey, boolean>)
        );
      } else {
        alert(response.data.message || "Failed to auto-fill form.");
      }
    } catch (e: any) {
      console.error("Autofill Error:", e);
      alert(e.response?.data?.message || e.message || "An error occurred during AI Autofill.");
    } finally {
      setAutofilling(false);
    }
  };

  const scrollToSignature = () => {
    setOpenSections((prev) => ({ ...prev, ReviewSignatures: true }));
    setTimeout(() => {
      const el =
        document.getElementById("participant-signature-pad") ||
        document.getElementById("representative-signature-pad") ||
        document.getElementById("review-signatures-section") ||
        document.getElementById("participant-signature-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  };

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const form = "housing-sil-support";
        const formUuid = searchParams.get("form-uuid") || searchParams.get("uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";

        if (sessionUserId) setSessionUserId(sessionUserId);
        if (sessionClientType) setSessionClientType(sessionClientType);
        if (formUuid) setSessionUuid(formUuid);

        try {
          const { client_name, uuid } = await getFormSession(form, formUuid, sessionUserId, sessionClientType);
          if (client_name) setClientName(client_name);
          if (uuid) setSessionUuid(uuid);
        } catch (e) {
          console.error("getFormSession failed", e);
        }

        if (token) {
          try {
            await me();
            setFlag(true);
          } catch (e) {
            console.error("Token verification failed", e);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setShowLoginModal(true);
          }
        } else {
          setShowLoginModal(true);
        }
      } catch (e) {
        console.error("Failed to check session", e);
      }
    })();
  }, [searchParams]);

  const fetchFormData = useCallback(async () => {
    try {
      const effectiveUuid = sessionUuid || searchParams.get("form-uuid") || searchParams.get("uuid");
      if (!effectiveUuid) {
        if (!sessionUserId) return;
        try {
          const res = await index<any>("get-client-basic-details", { userid: sessionUserId, client_type: sessionClientType });
          if (res.success && res.data) {
            setFormData(prev => ({
              ...prev,
              participant_name: res.data.participant_name || '',
            }));
          }
        } catch (err) {
          console.error("Failed to load basic details:", err);
        }
        return;
      }

      const response = await show<HousingSilSupportResponse>("housing-sil-support", effectiveUuid);

      if (response.data?.completion_percentage !== undefined) {
        setCompletionPercentage(response.data.completion_percentage);
      }

      if (!response?.data) {
        return;
      }

      setFormData(mapApiResponseToFormData(response.data));
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  }, [sessionUuid, searchParams, sessionUserId, sessionClientType]);

  useEffect(() => {
    if (sessionUserId && sessionClientType) {
      fetchFormData();
    }
  }, [sessionUuid, sessionUserId, sessionClientType, fetchFormData]);

  const handleChange = useCallback(
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
        | { target: { name: string; value: string | number | boolean | string[] } }
    ) => {
      const { name, value } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleTrackerClick = useCallback(
    (key: SectionKey) => {
      setOpenSections((prev) => {
        if (prev[key]) {
          return { ...prev, [key]: true };
        }

        const newState = SECTION_NAMES.reduce(
          (acc, sectionKey) => ({ ...acc, [sectionKey]: true }),
          {} as Record<SectionKey, boolean>
        );

        return { ...newState, [key]: true };
      });

      setTimeout(() => {
        sectionRefs[key]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
    [sectionRefs]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setValidationErrors({});
      setFormSubmissionError("");

      if (!localStorage.getItem("token") || localStorage.getItem("token") === "null") {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      try {
        const data = new FormData();
        if (formData.submit_final === 1) {
          data.append('submit_final', '1');
        }

        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            data.append(key, String(value));
          }
        });

        data.append("user_id", sessionUserId || "");
        data.append("client_type", sessionClientType || "");

        const effectiveUuid = sessionUuid || searchParams.get("form-uuid") || searchParams.get("uuid");
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update<HousingSilSupportResponse>("housing-sil-support/update", data);

        if (apiResponse.success) {
          window.alert("Form submitted successfully.");
          setValidationErrors({});
          setFormSubmissionError("");
          
          if (!effectiveUuid && apiResponse.data?.housingSilSupport?.uuid) {
            const newUuid = apiResponse.data.housingSilSupport.uuid;
            setSessionUuid(newUuid);
            router.push(`?form-uuid=${newUuid}&userid=${sessionUserId}&client_type=${sessionClientType}`, { scroll: false });
          }
          
          await fetchFormData();
        } else {
          setFormSubmissionError(apiResponse.message || "An error occurred");
        }

      } catch (err: unknown) {
        const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
        console.error("Submission error:", error);

        if (error.response && error.response.status === 422 && error.response.data?.errors) {
          setValidationErrors(error.response.data.errors);
          setFormSubmissionError("Please correct the errors below.");
        } else {
          setFormSubmissionError("An error occurred while submitting the form. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [formData, sessionUserId, sessionClientType, sessionUuid, fetchFormData, searchParams, router]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const completionBarStyle = { width: `${completionPercentage}%` };

  const trackerSteps = useMemo(() => {
    return [
      { key: "HousingSilSupport", label: "Housing & SIL Supports" },
      { key: "ReviewSignatures", label: "Review & Signatures" },
    ];
  }, []);

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          setFlag(true);
          fetchFormData();
        }}
      />
      {flag ? (
        <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
          <div className="flex justify-end gap-4 items-start">
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition h-fit mt-2"
            >
              Logout
            </button>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center w-48">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
                {clientName || "N/A"}
              </h1>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <Image
              src="/assets/images/BHC LOGO_SMALL.png"
              alt="Company Logo"
              width={180}
              height={80}
              className="h-auto"
            />
          </div>

          <div className="text-center mb-4 min-h-[56px]">
            {sessionUuid ? (
              <>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="btn-primary h-4 rounded-full transition-width duration-300"
                    style={completionBarStyle}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Form completion: {completionPercentage}%
                </p>
              </>
            ) : (
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2"></div>
            )}
          </div>

          <div className="flex justify-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800 text-center">
              Your Housing and Your SIL Supports
            </h1>
          </div>

          <form
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          >
            <div className="flex flex-wrap justify-end items-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                disabled={autofilling}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition shadow-sm text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {autofilling ? (
                  <>
                    <IconLoader size={18} className="animate-spin" />
                    Auto-filling...
                  </>
                ) : (
                  <>
                    <IconFileText size={18} />
                    PDF Extraction & AI Autofill
                  </>
                )}
              </button>
              <div 
                className="flex items-center text-red-600 font-bold bg-yellow-100 px-3 py-1.5 rounded-lg border border-yellow-400 animate-pulse cursor-pointer hover:bg-yellow-200 transition text-sm"
                onClick={scrollToSignature}
              >
                <span className="text-xl mr-2">👉</span>
                <span>Click here to participant signature</span>
              </div>
              <button
                type="button"
                onClick={toggleExpandAll}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition border border-gray-300 shadow-sm text-sm"
              >
                {isExpandedAll ? "Collapse All" : "Expand All"}
              </button>
            </div>
            <Tracker
              steps={trackerSteps}
              onStepClick={(key) => handleTrackerClick(key as SectionKey)}
            />

            {sectionsConfig.map(({ key, title, Component }) => (
              <React.Fragment key={key}>
                <AccordianPlanSection
                  sectionRef={sectionRefs[key as SectionKey]}
                  title={title}
                  isOpen={openSections[key as SectionKey]}
                  onToggle={() => handleTrackerClick(key as SectionKey)}
                >
                  <Component
                    formData={formData}
                    handleChange={handleChange}
                    uuid={sessionUuid || undefined}
                  />
                </AccordianPlanSection>
              </React.Fragment>
            ))}

            {formSubmissionError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
                {formSubmissionError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-primary:hover text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="submit_final"
                name="submit_final"
                checked={formData.submit_final === 1}
                onChange={e =>
                  handleChange({
                    target: {
                      name: 'submit_final',
                      value: e.target.checked ? 1 : 0,
                    },
                  })
                }
                className="mr-2"
              />
              <label className="font-medium text-gray-700">
                Final Submit (Tick to confirm all information is correct)
              </label>
            </div>
          </form>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Checking session...</p>
        </div>
      )}
      <PdfExtractionModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        userId={sessionUserId || searchParams.get("userid") || ""}
        clientType={sessionClientType || searchParams.get("client_type") || ""}
        onExtractionComplete={handleAutofill}
      />
    </>
  );
}
