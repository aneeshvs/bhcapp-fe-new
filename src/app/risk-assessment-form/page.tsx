"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { getFormSession } from "@/src/services/crud";
import { update, show } from "@/src/services/crud";
import Tracker from "@/src/components/Tracker";
import { RiskAssessmentResponse } from "@/src/components/IndividualRiskAssesment/ApiResponse";
import RiskAssessmentFormData from "@/src/components/IndividualRiskAssesment/RiskAssesmentFormData";
import { RiskResponse } from "@/src/components/IndividualRiskAssesment/types";
import { mapApiResponseToFormData } from "@/src/components/IndividualRiskAssesment/MapApiResponseToFormData";
import Image from "next/image";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { sectionsConfig } from "@/src/components/IndividualRiskAssesment/sectionsConfig";
import { PlanManualHandlingsFormData } from "@/src/components/IndividualRiskAssesment/ApiResponse";

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
  "AssessmentViolenceRisks",
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

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formSubmissionError, setFormSubmissionError] = useState<string>("");

  // Memoized values
  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [openSections, setOpenSections] =
    useState<Record<SectionKey, boolean>>(initialOpenSections);

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
        const form = "risk-assessment";
        const formUuid = searchParams.get("form-uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";

        const { token, client_name, uuid } = await getFormSession(
          form,
          formUuid,
          sessionUserId,
          sessionClientType
        );

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify({ type: "client" }));
        }

        setClientName(client_name ?? "");
        if (uuid) setSessionUuid(uuid);
        setFlag(true);
      } catch (e) {
        console.error("Failed to get form session", e);
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
        console.log("No UUID - skipping initial data fetch");
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
  }, [sessionUuid, searchParams]);

  // Fetch data effect
  useEffect(() => {
    const effectiveUuid = sessionUuid || searchParams.get("uuid");
    if (effectiveUuid) {
      fetchFormData();
    }
  }, [sessionUuid, searchParams, fetchFormData]);

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
        try {
          const form = "service-agreement";
          const formUuid = searchParams.get("form-uuid");
          const sessUserId = sessionUserId || searchParams.get("userid") || "";
          const sessClientType = sessionClientType || searchParams.get("client_type") || "";

          const { token } = await getFormSession(form, formUuid, sessUserId, sessClientType);
          if (token) {
            localStorage.setItem("token", token);
          } else {
            // Token is still null/invalid
            alert("Login credentials mismatch");
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to refresh session before submit", e);
          alert("Login credentials mismatch");
          setLoading(false);
          return;
        }
      }


      try {
        const data = new FormData();

        if (formData.submit_final === 1) {
          data.append("submit_final", "1");
        }

        // Ensure all formData values are properly stringified
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            data.append(key, String(value));
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
      { key: "AssessmentViolenceRisks", label: "Assessment Violence Risks" },
    ];
  }, []);

  return (
    <>
      {flag ? (
        <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
          <div className="flex justify-end">
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
    </>
  );
}