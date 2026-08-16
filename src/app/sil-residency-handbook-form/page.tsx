"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";
import { getFormSession } from "@/src/services/crud";
import { update, show, index } from "@/src/services/crud";
import { me } from "@/src/services/auth";
import Tracker from "@/src/components/Tracker";
import { mapApiResponseToFormData } from "@/src/components/SilResidencyHandbook/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/SilResidencyHandbook/sectionsConfig";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { SilResidencyHandbookResponse } from "@/src/components/SilResidencyHandbook/ApiResponse";
import AgreementFormData from "@/src/components/SilResidencyHandbook/AgreementFormData";
import SilResidencyHandbookSection from "@/src/components/SilResidencyHandbook/SilResidencyHandbookSection";
import LoginModal from "@/src/components/ConfidentialInformation/LoginModal";

const SECTION_NAMES = [
  "SilResidencyHandbook",
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

export default function SilResidencyHandbookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [sessionClientType, setSessionClientType] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [formData, setFormData] = useState(AgreementFormData);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
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
        const form = "sil-residency-handbook";
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

      const response = await show<any>("sil-residency-handbook", effectiveUuid);

      if (!response?.data) {
        return;
      }

      const handbookData = (response.data as any)?.silResidencyHandbook || response.data;

      if (handbookData?.completion_percentage !== undefined) {
        setCompletionPercentage(handbookData.completion_percentage);
      }

      if (handbookData?.uuid) {
        setSessionUuid(handbookData.uuid);
      }

      setFormData(mapApiResponseToFormData(handbookData));
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

        const apiResponse = await update<any>("sil-residency-handbook/update", data);

        if (apiResponse.success) {
          window.alert("Form submitted successfully.");
          setValidationErrors({});
          setFormSubmissionError("");

          const resData = apiResponse.data || {};
          const record = resData.silResidencyHandbook || resData;
          const returnedCompletion = (apiResponse as any).completion_percentage ?? resData.completion_percentage ?? record?.completion_percentage;
          const newUuid = record?.uuid || resData.uuid;

          if (returnedCompletion !== undefined) {
            setCompletionPercentage(returnedCompletion);
          }

          if (newUuid && (!effectiveUuid || sessionUuid !== newUuid)) {
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

  const completionBarStyle = { width: `${completionPercentage}%` };

  const trackerSteps = useMemo(() => {
    return [
      { key: "SilResidencyHandbook", label: "Residency Handbook" },
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
          {/* Header bar: Logout & Client info */}
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

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/assets/images/BHC LOGO_SMALL.png"
              alt="Company Logo"
              width={180}
              height={80}
              className="h-auto"
            />
          </div>

          {/* Progress bar */}
          <div className="text-center mb-4 min-h-[56px]">
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="btn-primary h-4 rounded-full transition-width duration-300"
                style={completionBarStyle}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Form completion: {completionPercentage}%
            </p>
          </div>

          {/* Title */}
          <div className="flex justify-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800 text-center">
              Best of Homecare SIL Residency Handbook
            </h1>
          </div>

          <form
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          >
            {/* Top Action controls inside box */}
            <div className="flex flex-wrap justify-end items-center gap-4 mb-4">
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

            {/* Tracker */}
            <Tracker
              steps={trackerSteps}
              onStepClick={(key) => handleTrackerClick(key as SectionKey)}
            />

            {formSubmissionError && (
              <div className="p-4 mb-4 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                {formSubmissionError}
              </div>
            )}

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

            {/* Submit button */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-white font-medium py-2.5 px-8 rounded-lg transition disabled:opacity-50 shadow"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* Final Submit checkbox */}
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
                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="submit_final" className="font-medium text-gray-700 text-sm cursor-pointer">
                Final Submit (Tick to confirm all information is correct)
              </label>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <span>Loading...</span>
        </div>
      )}
    </>
  );
}
