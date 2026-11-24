"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { getFormSession } from "@/src/services/crud";
import { update, show, index } from "@/src/services/crud";
import { me } from "@/src/services/auth";
import { ConfidentialInformation } from "@/src/components/ConfidentialInformation/ApiResponse";
import ConfidentialInformationFormData from "@/src/components/ConfidentialInformation/FormData";
import { mapApiResponseToFormData } from "@/src/components/ConfidentialInformation/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/ConfidentialInformation/SectionsConfig";
import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { ConfidentialResponse } from "@/src/components/ConfidentialInformation/types";
import { ConfidentialInformationFormTracker } from "@/src/components/ConfidentialInformation/FormTracker";
import { ConfidentialAgency } from "@/src/components/ConfidentialInformation/ApiResponse";
import Image from "next/image";
import LoginModal from "@/src/components/ConfidentialInformation/LoginModal";
import api from "@/src/utils/api";
import { IconLoader, IconFileText } from "@tabler/icons-react";
import PdfExtractionModal from "@/src/components/PdfExtractionModal";
import { useIsAdmin } from "@/src/utils/adminCheck";

const SECTION_NAMES = [
  "ConfidentialInformation", "ConfidentialAgency", "ConfidentialConsent", "VerbalConsent", "MediaConsent", "SilSurveillanceConsent", "PreConsentDisclosures"
] as const;

const ConfidentialAgencies: ConfidentialAgency[] = [
  {
    name: "",
    role: "",
    contact: "",
    agency_name: "",
    service_type: "",
    information_shared: "",
    goal_key: "",

  }
]

type SectionKey = (typeof SECTION_NAMES)[number];

type SupportFormaDataType = typeof ConfidentialInformationFormData;

type ValidationErrors = Record<string, string[]>;

// Utility functions
const createInitialOpenSections = (): Record<SectionKey, boolean> => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = false;
    return acc;
  }, {} as Record<SectionKey, boolean>);
};

const createSectionRefs = () => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = React.createRef<HTMLDivElement | null>();
    return acc;
  }, {} as Record<SectionKey, React.RefObject<HTMLDivElement | null>>);
};

export default function SupportCarePlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [sessionClientType, setSessionClientType] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");


  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [formData, setFormData] =
    useState<SupportFormaDataType>(ConfidentialInformationFormData);
  const [agencies, setAgencies] = useState<ConfidentialAgency[]>(ConfidentialAgencies);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formSubmissionError, setFormSubmissionError] = useState<string>("");

  // Memoized values
  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [openSections, setOpenSections] =
    useState<Record<SectionKey, boolean>>(initialOpenSections);
  const [isExpandedAll, setIsExpandedAll] = useState(false);

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
  const isAdmin = useIsAdmin();
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
          participant_name: "string (Full name of participant)",
          address: "string (Street address)",
          post_code: "string (Postcode)",
          date_of_birth: "string (Date of birth YYYY-MM-DD)",
          phone: "string (Phone number)",
          email: "string (Email address)",
          mobile_no: "string (Mobile number)",

          signed_date: "string (Consent signed date YYYY-MM-DD)",
          signed_by: "string ('participant' or 'authorized_rep')",
          name: "string (Name of person providing consent)",
          witnessed_by: "string (Name of witness)",

          verbal_signed_date: "string (Verbal consent date YYYY-MM-DD)",
          verbal_name: "string (Name of staff member recording verbal consent)",
          position: "string (Staff member position/role)",

          media_permission: "boolean (true if participant gives permission to use photos/videos/media, false otherwise)",
          media_option_on_occasion: "boolean (true if participant wants permission requested on each occasion, false otherwise)",
          media_permission_denied: "boolean (true if participant denies permission for media use, false otherwise)",

          explain_collection_storage: "number (1 if collection and storage explained, 0 otherwise)",
          discuss_referral_services: "number (1 if referral services discussed, 0 otherwise)",
          explain_release_agreement: "number (1 if release agreement explained, 0 otherwise)",
          explain_share_without_consent: "number (1 if sharing without consent situations explained, 0 otherwise)",
          provide_privacy_information: "number (1 if privacy information provided, 0 otherwise)"
        },
        agencies: [
          {
            name: "string (Contact person name or doctor/specialist name)",
            role: "string (Role or designation, e.g. Support Coordinator, GP, Psychologist, Plan Manager)",
            contact: "string (Phone number or email)",
            agency_name: "string (Organisation or practice name, e.g. NDIA, Health Clinic, Support Agency)",
            service_type: "string (Type of service provided, e.g. Support Coordination, Allied Health, Medical, Plan Management)",
            information_shared: "string (Types of information to be shared, e.g. Support Plans, Assessments, Progress Reports, Invoices)",
            goal_key: "string"
          }
        ]
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

        if (d.formData) {
          setFormData(prev => {
            const sanitized = { ...prev };
            Object.keys(d.formData).forEach(key => {
              const val = d.formData[key];
              const prevVal = (prev as any)[key];

              if (typeof prevVal === 'boolean') {
                if (val === true || val === "true" || val === 1 || val === "1") {
                  (sanitized as any)[key] = true;
                } else {
                  (sanitized as any)[key] = false;
                }
              } else if (typeof prevVal === 'number') {
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
                } else if (key.includes('date') || key === 'date_of_birth') {
                  (sanitized as any)[key] = parseDateToIso(val);
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

        if (Array.isArray(d.agencies) && d.agencies.length > 0) {
          const cleanedAgencies: ConfidentialAgency[] = d.agencies
            .filter((ag: any) => ag && (ag.agency_name || ag.name || ag.role || ag.service_type))
            .map((ag: any) => ({
              name: isDummy(ag.name || '') ? '' : (ag.name || ''),
              role: isDummy(ag.role || '') ? '' : (ag.role || ''),
              contact: isDummy(ag.contact || '') ? '' : (ag.contact || ''),
              agency_name: isDummy(ag.agency_name || '') ? '' : (ag.agency_name || ''),
              service_type: isDummy(ag.service_type || '') ? '' : (ag.service_type || ''),
              information_shared: isDummy(ag.information_shared || '') ? '' : (ag.information_shared || ''),
              goal_key: ag.goal_key || '',
            }));

          if (cleanedAgencies.length > 0) {
            setAgencies(cleanedAgencies);
          }
        }

        window.alert("Consent to Exchange and Release Confidential Information form auto-filled successfully using AI!");
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

  const getComponentProps = useCallback(
    (key: string) => {
      switch (key) {
        case "ConfidentialAgency":
          return { agencies, setAgencies };
        default:
          return {};
      }
    },
    [agencies]
  );

  // Session bootstrap (token, userid, client_type, optional uuid)
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const formUuid = searchParams.get("form-uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";


        if (sessionUserId) setSessionUserId(sessionUserId);
        if (sessionClientType) setSessionClientType(sessionClientType);
        if (formUuid) setSessionUuid(formUuid);

        // Call getFormSession to get client details but IGNORE token
        try {
          const form = "confidential-information";
          const { client_name, uuid } = await getFormSession(
            form,
            formUuid,
            sessionUserId,
            sessionClientType
          );

          if (client_name) setClientName(client_name);
          if (uuid && !formUuid) setSessionUuid(uuid); // Only set if not already in params? Or update it? likely safe to update.
        } catch (err) {
          console.error("getFormSession failed", err);
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

  // Memoized fetch function
  const fetchFormData = useCallback(async () => {
    try {
      const effectiveUuid = sessionUuid;
      if (!effectiveUuid) {
        console.log("No UUID - trying to fetch basic details for autofill");
        if (!sessionUserId) return; // Add early return to avoid 400 bad request
        try {
          const res = await index<any>("get-client-basic-details", { userid: sessionUserId, client_type: sessionClientType });
          if (res.success && res.data) {
            setFormData(prev => ({
              ...prev,
              participant_name: res.data.participant_name || '',
              address: res.data.address || '',
              date_of_birth: res.data.dob || '',
              phone: res.data.contact || '',
              email: res.data.email || '',
              post_code: res.data.postcode || '',
              mobile_no: res.data.contact || '',
            }));
            
            if (res.data.participant_name) {
               setClientName(res.data.participant_name);
            }
          }
        } catch (err) {
          console.error("Failed to load basic details:", err);
        }
        return;
      }

      const response = await show<ConfidentialInformation>(
        "confidential-form",
        effectiveUuid || ""
      );
      console.log(response);

      if (response.data?.completion_percentage !== undefined) {
        setCompletionPercentage(response.data.completion_percentage);
      }

      if (!response?.data) {
        console.log("No service agreement data found");
        return;
      }

      // Set form data from API response
      setFormData(
        mapApiResponseToFormData(response.data) as SupportFormaDataType
      );
      if (response.data.client_name) {
        setClientName(response.data.client_name);
      }


      if (response.data?.agencies) {
        const ConsetData: ConfidentialAgency[] = response.data?.agencies.map((item) => ({
          name: item.name || "",
          role: item.role || "",
          contact: item.contact || "",
          agency_name: item.agency_name || "",
          service_type: item.service_type || "",
          information_shared: item.information_shared || "",
          goal_key: item.goal_key || "",
        }));
        setAgencies(ConsetData);
      }



    } catch (error) {
      console.error("Error fetching service agreement data:", error);
    }
  }, [sessionUuid, sessionUserId, sessionClientType]);

  // Fetch data effect
  useEffect(() => {
    if (sessionUserId && sessionClientType) {
      fetchFormData();
    }
  }, [sessionUuid, sessionUserId, sessionClientType, fetchFormData]);

  // Memoized change handler
  const handleChange = useCallback(
    (
      event:
        | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
        | { target: { name: string; value: string | number | boolean } }
    ) => {
      const { name, value } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Memoized tracker click handler
  const handleTrackerClick = useCallback(
    (key: SectionKey) => {
      setOpenSections((prev) => {
        if (prev[key]) {
          return { ...prev, [key]: false };
        }

        const newState = SECTION_NAMES.reduce(
          (acc, sectionKey) => ({
            ...acc,
            [sectionKey]: false,
          }),
          {} as Record<SectionKey, boolean>
        );

        return { ...newState, [key]: true };
      });

      // Delay scroll until after DOM updates
      setTimeout(() => {
        sectionRefs[key]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
    [sectionRefs]
  );

  const scrollToSignature = useCallback(() => {
    if (!openSections["ConfidentialConsent"]) {
      handleTrackerClick("ConfidentialConsent");
      setTimeout(() => {
        const sigElement = document.getElementById("participant-signature-pad");
        if (sigElement) {
          sigElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    } else {
      const sigElement = document.getElementById("participant-signature-pad");
      if (sigElement) {
        sigElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [openSections, handleTrackerClick]);

  // Function to format field names for display
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted");
      setLoading(true);
      setValidationErrors({});
      setFormSubmissionError("");

      // Check for token and refresh if missing
      // localStorage.removeItem("token");
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
        data.append("agencies", JSON.stringify(agencies || []));

        // Include UUID if it exists
        const effectiveUuid = sessionUuid;
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update("confidential-form/update", data);
        let response: ConfidentialResponse;
        if (apiResponse.success) {
          response = {
            success: true,
            data: apiResponse.data as {
              confidentialInformationForm: { uuid: string; id: number };
            },
          };
          window.alert("Form submitted successfully.");
          setValidationErrors({});
          setFormSubmissionError("");
        } else {
          response = {
            success: false,
            data: apiResponse.data as Record<string, string>,
            message: apiResponse.message,
          };
        }

        if (
          !sessionUuid &&
          response.success &&
          response.data?.confidentialInformationForm?.uuid
        ) {
          const newUuid = response.data.confidentialInformationForm.uuid;
          setSessionUuid(newUuid);
          // Push the UUID to the URL as a query parameter
          router.push(`?form-uuid=${newUuid}&userid=${sessionUserId}&client_type=${sessionClientType}`, { scroll: false });
          await fetchFormData();
        }
        await fetchFormData();
      } catch (err: unknown) {
        const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
        console.error("Submission error:", error);

        if (error.response && error.response.status === 422 && error.response.data?.errors) {
          const newErrors: ValidationErrors = {};
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            newErrors[field] = messages;
          });
          setValidationErrors(newErrors);
          setFormSubmissionError("Please correct the errors below.");
        } else {
          setFormSubmissionError("An error occurred while submitting the form. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      sessionUserId,
      sessionClientType,
      sessionUuid,
      fetchFormData,
      router,
      agencies,
    ]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    const userId = searchParams.get("userid");
    const clientType = searchParams.get("client_type");

    if (userId) setSessionUserId(userId);
    if (clientType) setSessionClientType(clientType);
  }, [searchParams]);

  // Memoized completion percentage style
  const completionBarStyle = { width: `${completionPercentage}%` };

  const trackerSteps = useMemo(() => {
    return ConfidentialInformationFormTracker.map((step) => step);
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
            {/* Reserve height */}
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
            <h1 className="text-center text-2xl md:text-3xl font-bold mt-2 text-gray-800">
              Form-F3 Consent To Exchange And <br />Release Confidential Information
            </h1>
          </div>

          <form
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          >
            <div className="flex justify-end items-center gap-4 mb-4">
              {isAdmin && (<button
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
              </button>)}
              <div 
                className="flex items-center text-red-600 font-bold bg-yellow-100 px-3 py-1 rounded-lg border border-yellow-400 animate-pulse cursor-pointer hover:bg-yellow-200 transition"
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
              <AccordianPlanSection
                key={key}
                sectionRef={sectionRefs[key as SectionKey]}
                title={title}
                isOpen={openSections[key as SectionKey]}
                onToggle={() => handleTrackerClick(key as SectionKey)}
              >
                <Component
                  formData={formData}
                  handleChange={handleChange}
                  {...getComponentProps(key)}
                  uuid={sessionUuid || undefined}
                />
              </AccordianPlanSection>
            ))}

            {/* Display validation errors */}
            {(Object.keys(validationErrors).length > 0 || formSubmissionError) && (
              <div className="mt-8 p-4 border border-red-300 bg-red-50 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  Please fix the following errors:
                </h3>

                {formSubmissionError && (
                  <p className="text-red-600 mb-3">{formSubmissionError}</p>
                )}

                <ul className="space-y-2">
                  {Object.entries(validationErrors).map(([field, errors]) => (
                    <li key={field} className="text-red-600">
                      <strong className="font-medium">{formatFieldName(field)}:</strong>{" "}
                      {errors.map((error, index) => (
                        <span key={index}>
                          {error}
                          {index < errors.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
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
        // Loader when flag is false
        <div className="flex justify-center items-center min-h-[200px]">
          <span>Loading...</span>
        </div>
      )}
      {isAdmin && <PdfExtractionModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        userId={sessionUserId || searchParams.get("userid") || ""}
        clientType={sessionClientType || searchParams.get("client_type") || ""}
        onExtractionComplete={handleAutofill}
      />}
    </>
  );
}
