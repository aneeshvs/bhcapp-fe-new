"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { getFormSession } from "@/src/services/crud";
import { update, show, index } from "@/src/services/crud";
import { me } from "@/src/services/auth";
import { OnboardingResponse } from "@/src/components/OnboardingPacking/ApiResponse";
import OnboardingFormData from "@/src/components/OnboardingPacking/FormData";
import { mapApiResponseToFormData } from "@/src/components/OnboardingPacking/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/OnboardingPacking/sectionsConfig";
import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { OnboardingSignoffResponse } from "@/src/components/OnboardingPacking/types";
import { OnboardingPackingTracker } from "@/src/components/OnboardingPacking/ScheduleTracker";
import Image from "next/image";
import LoginModal from "@/src/components/ConfidentialInformation/LoginModal";
import api from "@/src/utils/api";
import { IconLoader, IconFileText } from "@tabler/icons-react";
import PdfExtractionModal from "@/src/components/PdfExtractionModal";
import { useIsAdmin } from "@/src/utils/adminCheck";

const SECTION_NAMES = [
  "OnboardingPackingSignoffs", "DisabilityActDiscussion", "ParticipantDeclaration",
] as const;



type SectionKey = (typeof SECTION_NAMES)[number];

type SupportFormaDataType = typeof OnboardingFormData;

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
    useState<SupportFormaDataType>(OnboardingFormData);
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
          service_agreement_provided: "number (1 if provided to participant, 0 otherwise)",
          service_agreement_date: "string (Date provided/signed YYYY-MM-DD)",
          participant_handbook_provided: "number (1 if provided to participant, 0 otherwise)",
          participant_handbook_date: "string (Date provided YYYY-MM-DD)",
          support_care_plan_offered: "number (1 if offered to participant, 0 otherwise)",
          support_care_plan_date: "string (Date offered/created YYYY-MM-DD)",
          consent_form_signed: "number (1 if consent form signed, 0 otherwise)",
          consent_form_date: "string (Date signed YYYY-MM-DD)",
          feedback_form_provided: "number (1 if feedback/complaints form provided, 0 otherwise)",
          feedback_form_date: "string (Date provided YYYY-MM-DD)",
          home_safety_check_conducted: "number (1 if home safety check conducted, 0 otherwise)",
          home_safety_check_date: "string (Date conducted YYYY-MM-DD)",
          medication_consent_form: "number (1 if medication consent form obtained/applicable, 0 otherwise)",
          medication_consent_date: "string (Date completed YYYY-MM-DD)",
          onboarding_form_completed: "number (1 if onboarding form completed, 0 otherwise)",
          onboarding_form_date: "string (Date completed YYYY-MM-DD)",
          risk_assessment_completed: "number (1 if risk assessment completed, 0 otherwise)",
          risk_assessment_date: "string (Date completed YYYY-MM-DD)",
          behaviour_support_plan_obtained: "number (1 if BSP obtained/applicable, 0 otherwise)",
          behaviour_support_plan_date: "string (Date obtained YYYY-MM-DD)",
          high_intensity_support_plan_obtained: "number (1 if high intensity plan obtained/applicable, 0 otherwise)",
          high_intensity_support_plan_date: "string (Date obtained YYYY-MM-DD)",
          mealtime_plan_obtained: "number (1 if mealtime plan obtained/applicable, 0 otherwise)",
          mealtime_plan_date: "string (Date obtained YYYY-MM-DD)",
          sil_occupancy_agreement_provided: "number (1 if SIL agreement provided/applicable, 0 otherwise)",
          sil_occupancy_agreement_date: "string (Date provided YYYY-MM-DD)",
          external_provider_agreement_completed: "number (1 if external provider agreement completed/applicable, 0 otherwise)",
          external_provider_agreement_date: "string (Date completed YYYY-MM-DD)",
          sda_residency_agreement_provided: "number (1 if SDA agreement provided/applicable, 0 otherwise)",
          sda_residency_agreement_date: "string (Date provided YYYY-MM-DD)",
          sda_welcome_pack_provided: "number (1 if SDA welcome pack provided/applicable, 0 otherwise)",
          sda_welcome_pack_date: "string (Date provided YYYY-MM-DD)",
          sda_residency_statement_provided: "number (1 if SDA residency statement provided/applicable, 0 otherwise)",
          sda_residency_statement_date: "string (Date provided YYYY-MM-DD)",

          clarify_services_provided: "number (1 if services provided clarified, 0 otherwise)",
          verbal_information_intake_process: "number (1 if intake process discussed, 0 otherwise)",
          cost_of_services: "number (1 if cost of services explained, 0 otherwise)",
          participant_rights_handbook: "number (1 if participant rights explained, 0 otherwise)",

          participant_name: "string (Full name of participant)",
          relationship_to_participant: "string (Relationship, e.g. Self, Parent, Nominee, Guardian)",
          signed_date: "string (Declaration signed date YYYY-MM-DD)",

          verbal_consent_staff_name: "string (Staff member name recording verbal consent)",
          verbal_consent_staff_position: "string (Staff member position/role)",
          verbal_consent_date: "string (Date of verbal consent discussion YYYY-MM-DD)",
          verbal_consent_notes: "string (Detailed notes regarding onboarding pack review and verbal discussion)"
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

        window.alert("Onboarding & Packing Sign-off form auto-filled successfully using AI!");
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



  // Session bootstrap (token, userid, client_type, optional uuid)
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const form = "onboarding-packing-signoff";
        const formUuid = searchParams.get("form-uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";


        if (sessionUserId) setSessionUserId(sessionUserId);
        if (sessionClientType) setSessionClientType(sessionClientType);
        if (formUuid) setSessionUuid(formUuid);

        // Fetch session data but ignore token
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

  // Memoized fetch function for EXISTING forms (has UUID)
  const fetchFormData = useCallback(async () => {
    if (!sessionUuid) return;
    
    try {
      const response = await show<OnboardingResponse>(
        "onboarding-packing-signoff",
        sessionUuid
      ) as any;

      if (response.data?.completion_percentage !== undefined) {
        setCompletionPercentage(response.data.completion_percentage);
      }

      if (response?.data) {
        const mappedData = mapApiResponseToFormData(response.data) as SupportFormaDataType;
        
        // Merge with autofill if present in the response
        if (response.autofill_dates) {
          applyAutofill(mappedData, response.autofill_dates);
        }
        setFormData(mappedData);
      }
    } catch (e) {
      console.error("fetchFormData failed", e);
    }
  }, [sessionUuid]);

  // Dedicated Autofill Effect for NEW forms (no UUID yet)
  useEffect(() => {
    // Only run if we DON'T have a UUID and we DO have a User ID
    if (sessionUuid) return; 
    if (!sessionUserId) return;

    const fetchAutofillOnly = async () => {
      try {
        const response = await index<any>("onboarding-packing-signoff/autofill-dates", {
          userid: sessionUserId
        }) as any;
        
        const basicDetailsResponse = await index<any>("get-client-basic-details", {
          userid: sessionUserId, client_type: sessionClientType
        }) as any;

        const newData = { ...OnboardingFormData };

        if (response.success && response.autofill_dates) {
          applyAutofill(newData, response.autofill_dates);
        }
        
        if (basicDetailsResponse.success && basicDetailsResponse.data?.participant_name) {
          if (!newData.participant_name) {
             newData.participant_name = basicDetailsResponse.data.participant_name;
             setClientName(basicDetailsResponse.data.participant_name);
          }
        }
        
        setFormData(newData);
      } catch (e) {
        console.error("fetchAutofillOnly failed", e);
      }
    };

    fetchAutofillOnly();
  }, [sessionUuid, sessionUserId, sessionClientType]);

  // Helper to apply autofill values to a target data object
  const applyAutofill = (targetData: SupportFormaDataType, autofill: any) => {
    Object.entries(autofill).forEach(([key, value]) => {
      const currentValue = targetData[key as keyof SupportFormaDataType];
      
      // Only autofill if the current field is empty or 0 (for provided/offered flags)
      if (value !== null && value !== undefined) {
        if (!currentValue || currentValue === "" || currentValue === 0) {
          (targetData as any)[key] = value;
        }
      }
    });
  };

  // Trigger fetch for existing forms
  useEffect(() => {
    if (sessionUuid) {
      fetchFormData();
    }
  }, [sessionUuid, fetchFormData]);

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
    if (!openSections["ParticipantDeclaration"]) {
      handleTrackerClick("ParticipantDeclaration");
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

        // Include UUID if it exists
        const effectiveUuid = sessionUuid;
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update("onboarding-packing-signoff/update", data);
        let response: OnboardingSignoffResponse;
        if (apiResponse.success) {
          response = {
            success: true,
            data: apiResponse.data as {
              onboardingPackingSignoff: { uuid: string; id: number };
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
          response.data?.onboardingPackingSignoff?.uuid
        ) {
          const newUuid = response.data.onboardingPackingSignoff.uuid;
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
    ]
  );

  useEffect(() => {
    const userId = searchParams.get("userid");
    const clientType = searchParams.get("client_type");

    if (userId) setSessionUserId(userId);
    if (clientType) setSessionClientType(clientType);
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Memoized completion percentage style
  const completionBarStyle = { width: `${completionPercentage}%` };


  const trackerSteps = useMemo(() => {
    const isSigned =
      Boolean(formData.participant_signature) &&
      formData.participant_signature.startsWith("data:image");
    return OnboardingPackingTracker.map((step) =>
      step.key === "ParticipantDeclaration"
        ? {
          ...step,
          badge: isSigned
            ? { text: "Signed", className: "bg-green-100 text-green-700" }
            : {
              text: "Not signed",
              className: "bg-amber-100 text-amber-700",
            },
        }
        : step
    );
  }, [formData.participant_signature]);

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
            <h1 className="text-center xt-2xl md:text-3xl font-bold mt-2 text-gray-800">
              Form - F19 Onboarding Pack Contents <br /> List Sign Off
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

            {sectionsConfig.map(({ key, title, Component }, index) => (
              <React.Fragment key={key}>
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
                    uuid={sessionUuid || undefined}
                  />
                </AccordianPlanSection>

                {index === 1 && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mt-6 mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      <b>Prior to scheduling a visit to the participant, please remember:</b>
                    </p>

                    <ol className="list-decimal ml-6 mt-3 text-gray-700 leading-relaxed space-y-1">
                      <li>Request that it is a non-smoking environment</li>
                      <li>Request that any pets are kept separate to staff, both inside and outside residence</li>
                      <li>Any directions/instructions to get to residence including parking options</li>
                      <li>Ask if there have been any past health / safety issues, or current concerns for how we can ensure safety in the participant’s environment</li>
                      <li>Clarify which is the preferred door to be used for entry</li>
                    </ol>
                  </div>
                )}
              </React.Fragment>
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
