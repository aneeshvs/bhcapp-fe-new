"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { getFormSession } from "@/src/services/crud";
import { update, show, index } from "@/src/services/crud";
import { me } from "@/src/services/auth";
import Tracker from "@/src/components/Tracker";
import { RiskAssessmentResponse } from "@/src/components/IndividualRiskAssesment/ApiResponse";
import RiskAssessmentFormData from "@/src/components/IndividualRiskAssesment/RiskAssesmentFormData";
import { RiskResponse } from "@/src/components/IndividualRiskAssesment/types";
import { mapApiResponseToFormData } from "@/src/components/IndividualRiskAssesment/MapApiResponseToFormData";
import Image from "next/image";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { sectionsConfig } from "@/src/components/IndividualRiskAssesment/sectionsConfig";
import { PlanManualHandlingsFormData } from "@/src/components/IndividualRiskAssesment/ApiResponse";
import LoginModal from "@/src/components/ConfidentialInformation/LoginModal";
import PdfExtractionModal from "@/src/components/PdfExtractionModal";
import api from "@/src/utils/api";
import { IconFileText, IconLoader } from "@tabler/icons-react";

// Add type for validation errors
type ValidationErrors = Record<string, string[]>;

const SECTION_NAMES = [
  "RiskAssessmentDetails",
  "AssessmentDetails",
  "AssessmentCommunications",
  "AssessmentCognitions",
  "AssesmentMobility",
  "AssessmentPersonalCare",
  "PlanManualHandlings",
  "AssessmentFinancialRisks",
  
  "AssessmentViolenceRisks",
  "AssessmentOtherRisks",
] as const;

const ManualHandlings: PlanManualHandlingsFormData[] = [
  {
    goal_key: "",
    training_provided: 0,
    training_hazards: "",
    training_management_plan: "",

    tasks_safe: 0,
    tasks_hazards: "",
    tasks_management_plan: "",
  },
];

type SectionKey = (typeof SECTION_NAMES)[number];

type SupportPlanFormDataType = typeof RiskAssessmentFormData;

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

export default function SupportPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [sessionClientType, setSessionClientType] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");

  const [manualHandlings, setManualHandlings] =
    useState<PlanManualHandlingsFormData[]>(ManualHandlings);

  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [formData, setFormData] = useState<SupportPlanFormDataType>(
    RiskAssessmentFormData
  );
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

  const [autofilling, setAutofilling] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

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
        formData: Object.keys(formData).reduce((acc, key) => {
          if (key !== 'submit_final' && key !== 'form_status') {
            if (key.includes('date')) {
              acc[key] = 'string (YYYY-MM-DD format, e.g. 2026-09-24)';
            } else if (key === 'finance_management' || key === 'verbal_aggression') {
              acc[key] = 'string ("Yes", "No", or "N/A" - default to "No" if no risk is identified)';
            } else {
              acc[key] = typeof (formData as any)[key] === 'number'
                ? 'number (0 for No/False/Safe, 1 for Yes/True/Risk Present)'
                : 'string (Detailed hazard description or risk management plan)';
            }
          }
          return acc;
        }, {} as Record<string, string>),
        manualHandlings: [{
          training_provided: "number (0 or 1)",
          training_hazards: "string (Hazards associated with manual handling training)",
          training_management_plan: "string (Management plan for training hazards)",
          tasks_safe: "number (0 or 1)",
          tasks_hazards: "string (Hazards associated with manual handling tasks)",
          tasks_management_plan: "string (Management plan for manual handling tasks)"
        }]
      };

      const response = await api.post("/ai/autofill-form", {
        user_id: targetUserId,
        client_type: targetClientType,
        schema: schema
      });

      if (response.data.success) {
        const d = response.data.data;
        if (d.formData) {
          setFormData(prev => {
            const sanitized = { ...prev };
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
                if (p1 > 12) return `${year}-${String(p2).padStart(2, "0")}-${String(p1).padStart(2, "0")}`;
                if (p2 > 12) return `${year}-${String(p1).padStart(2, "0")}-${String(p2).padStart(2, "0")}`;
                return `${year}-${String(p2).padStart(2, "0")}-${String(p1).padStart(2, "0")}`;
              }
              const ymdMatch = str.match(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
              if (ymdMatch) {
                return `${ymdMatch[1]}-${String(ymdMatch[2]).padStart(2, "0")}-${String(ymdMatch[3]).padStart(2, "0")}`;
              }
              return str;
            };

            Object.keys(d.formData).forEach(key => {
              const val = d.formData[key];
              const prevVal = (prev as any)[key];

              if (key === 'finance_management' || key === 'verbal_aggression') {
                if (typeof val === 'string') {
                  const clean = val.trim();
                  const lower = clean.toLowerCase();
                  if (lower === 'yes' || lower === '1' || lower === 'true') {
                    (sanitized as any)[key] = 'Yes';
                  } else if (lower === 'n/a' || lower === 'na' || lower === 'not applicable') {
                    (sanitized as any)[key] = 'N/A';
                  } else if (lower === 'no' || lower === '0' || lower === 'false') {
                    (sanitized as any)[key] = 'No';
                  } else if (!isDummy(clean)) {
                    // Put descriptive notes into corresponding notes field if empty
                    const notesKey = key === 'finance_management' ? 'finance_management_notes' : 'verbal_aggression_notes';
                    if (!(sanitized as any)[notesKey] || (sanitized as any)[notesKey] === '') {
                      (sanitized as any)[notesKey] = clean;
                    }
                    (sanitized as any)[key] = 'No';
                  } else {
                    (sanitized as any)[key] = 'No';
                  }
                } else if (val === 1 || val === true) {
                  (sanitized as any)[key] = 'Yes';
                } else {
                  (sanitized as any)[key] = 'No';
                }
              } else if (typeof prevVal === 'number') {
                if (val === 1 || val === "1" || val === true || val === "true" || (typeof val === 'string' && val.trim().toLowerCase() === "yes")) {
                  (sanitized as any)[key] = 1;
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

        if (d.manualHandlings?.length) {
          setManualHandlings(d.manualHandlings.map((m: any) => ({
            goal_key: m.goal_key || '',
            training_provided: (m.training_provided === 1 || m.training_provided === "1" || m.training_provided === true || (typeof m.training_provided === 'string' && m.training_provided.toLowerCase() === 'yes')) ? 1 : 0,
            training_hazards: m.training_hazards || '',
            training_management_plan: m.training_management_plan || '',
            tasks_safe: (m.tasks_safe === 1 || m.tasks_safe === "1" || m.tasks_safe === true || (typeof m.tasks_safe === 'string' && m.tasks_safe.toLowerCase() === 'yes')) ? 1 : 0,
            tasks_hazards: m.tasks_hazards || '',
            tasks_management_plan: m.tasks_management_plan || ''
          })));
        }

        window.alert("Individual Risk Assessment auto-filled successfully using AI!");
        setIsExpandedAll(true);
      } else {
        alert(response.data.message || "Failed to auto-fill form data.");
      }
    } catch (err: any) {
      console.error("Autofill error:", err);
      alert(err.response?.data?.message || err.message || "An error occurred during AI autofill.");
    } finally {
      setAutofilling(false);
    }
  };

  const getComponentProps = useCallback(
    (key: string) => {
      switch (key) {
        case "PlanManualHandlings":
          return { manualHandlings, setManualHandlings };
        default:
          return {};
      }
    },
    [manualHandlings]
  );

  // Session bootstrap (token, userid, client_type, optional uuid)
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const form = "risk-assessment";
        const formUuid = searchParams.get("form-uuid");
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

  // Memoized fetch function
  const fetchFormData = useCallback(async () => {
    try {
      const effectiveUuid =
        sessionUuid ||
        searchParams.get("form-uuid") ||
        searchParams.get("uuid");
      if (!effectiveUuid) {
        console.log("No UUID - trying to fetch basic details for autofill");
        if (!sessionUserId) return; // Add early return to avoid 400 bad request
        try {
          const res = await index<any>("get-client-basic-details", { userid: sessionUserId, client_type: sessionClientType });
          if (res.success && res.data) {
            setFormData(prev => ({
              ...prev,
              client_name: res.data.participant_name || '',
              site_address: res.data.address || '',
            }));
          }
        } catch (err) {
          console.error("Failed to load basic details:", err);
        }
        return;
      }

      const response = await show<RiskAssessmentResponse>(
        "risk-assessment",
        effectiveUuid || ""
      );
      console.log(response);

      if (response.data.completion_percentage !== undefined) {
        setCompletionPercentage(response.data.completion_percentage);
      }

      if (!response?.data) {
        console.log("No support plan data found");
        return;
      }

      // Set form data from API response
      setFormData(
        mapApiResponseToFormData(response.data) as SupportPlanFormDataType
      );

      if (response.data?.manual_handlings) {
        const typedServices: PlanManualHandlingsFormData[] =
          response.data.manual_handlings.map((manualHandlings) => ({
            goal_key: manualHandlings.goal_key || "",
            training_provided: manualHandlings.training_provided ? 1 : 0,
            training_hazards: manualHandlings.training_hazards || "",
            training_management_plan:
              manualHandlings.training_management_plan || "",
            tasks_safe: manualHandlings.tasks_safe ? 1 : 0,
            tasks_hazards: manualHandlings.tasks_hazards || "",
            tasks_management_plan: manualHandlings.tasks_management_plan || "",
          }));
        setManualHandlings(typedServices);
      }
    } catch (error) {
      console.error("Error fetching support plan data:", error);
    }
  }, [sessionUuid, searchParams, sessionUserId, sessionClientType]);

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

      // Clear validation error for this field when user starts typing
      if (validationErrors[name]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [validationErrors]
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
      setValidationErrors({}); // Clear previous errors
      setFormSubmissionError(""); // Clear previous submission error

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
          data.append("submit_final", "1");
        }

        // Ensure all formData values are properly stringified
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if ((key === 'finance_management' || key === 'verbal_aggression') && (!value || !['Yes', 'No', 'N/A'].includes(String(value)))) {
              data.append(key, 'No');
            } else {
              data.append(key, String(value));
            }
          }
        });

        data.append("user_id", sessionUserId || "");
        data.append("client_type", sessionClientType || "");
        data.append("manual_handlings", JSON.stringify(manualHandlings || []));

        // Include UUID if it exists
        const effectiveUuid =
          sessionUuid ||
          searchParams.get("form-uuid") ||
          searchParams.get("uuid");
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update("risk-assessment/update", data);
        let response: RiskResponse;

        if (apiResponse.success) {
          response = {
            success: true,
            data: apiResponse.data as {
              individualRiskAssessment: { uuid: string; id: number };
            },
          };
          window.alert("Form submitted successfully.");
          // Clear errors on successful submission
          setValidationErrors({});
          setFormSubmissionError("");
        } else {
          response = {
            success: false,
            data: apiResponse.data as Record<string, string>,
            message: apiResponse.message,
          };

          // Handle validation errors
          if (apiResponse.data && typeof apiResponse.data === 'object') {
            const errorData = apiResponse.data as Record<string, string | string[]>;
            const newErrors: ValidationErrors = {};

            // Extract validation errors from response
            Object.entries(errorData).forEach(([field, errors]) => {
              if (Array.isArray(errors)) {
                newErrors[field] = errors;
              } else if (typeof errors === 'string') {
                newErrors[field] = [errors];
              }
            });

            setValidationErrors(newErrors);

            // Set general error message if no specific field errors
            if (Object.keys(newErrors).length === 0 && apiResponse.message) {
              setFormSubmissionError(apiResponse.message);
            }
          } else if (apiResponse.message) {
            setFormSubmissionError(apiResponse.message);
          }
        }

        if (
          !sessionUuid &&
          !searchParams.get("form-uuid") &&
          !searchParams.get("uuid") &&
          response.success &&
          response.data?.individualRiskAssessment?.uuid
        ) {
          const newUuid = response.data.individualRiskAssessment.uuid;
          setSessionUuid(newUuid);
          router.push(`?form-uuid=${newUuid}&userid=${sessionUserId}&client_type=${sessionClientType}`, { scroll: false });
          await fetchFormData();
        } else if (
          sessionUuid ||
          searchParams.get("form-uuid") ||
          searchParams.get("uuid")
        ) {
          await fetchFormData();
        }
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
      searchParams,
      fetchFormData,
      manualHandlings,
      router,
      validationErrors,
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
  const completionBarStyle = useMemo(
    () => ({
      width: `${completionPercentage}%`,
    }),
    [completionPercentage]
  );

  // Memoized steps with signature badge for Approval
  const trackerSteps = useMemo(() => {
    return [
      { key: "RiskAssessmentDetails", label: "Risk Assessment Details" },
      { key: "AssessmentDetails", label: "Assessment Details" },
      { key: "AssessmentCommunications", label: "Assessment Communications" },
      { key: "AssessmentCognitions", label: "Assessment Cognitions" },
      { key: "AssesmentMobility", label: "Assessment Mobility" },
      { key: "AssessmentPersonalCare", label: "Assessment Personal Care" },
      { key: "PlanManualHandlings", label: "Plan Manual Handlings" },
      { key: "AssessmentFinancialRisks", label: "Financial Risks" },
      
      { key: "AssessmentViolenceRisks", label: "Assessment Violence Risks" },
      { key: "AssessmentOtherRisks", label: "Other Risks" },
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

          {(sessionUuid || searchParams.get("uuid")) && (
            <div className="text-center mb-4">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="btn-primary h-4 rounded-full"
                  style={completionBarStyle}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Form completion: {completionPercentage}%
              </p>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800">
              Form - F5a Individual Risk Assessment
            </h1>
          </div>

          <form
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          >
            <div className="flex justify-end gap-2 mb-4">
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
            <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
              <div className="text-gray-700 space-y-3 w-full">

                <h1 className="text-center text-2xl font-semibold text-gray-700 mb-4">
                  HOW TO USE THIS FORM
                </h1>

                <p>
                  You are to ensure onsite completion of this Individual Risk
                  Assessment prior to the commencement of service delivery. Only
                  complete those areas related to the services to be provided
                  and ensure you address potential risks with the Participant
                  and put in place risk controls. This safety checklist is to be
                  completed each time changes to the supports or their delivery
                  are required, and/or any changes made to the Participants
                  Service Agreement and/or Support care plan.
                </p>

              </div>
            </div>

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
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "submit_final",
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