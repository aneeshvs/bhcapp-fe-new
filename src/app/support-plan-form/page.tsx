"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFormSession } from "@/src/services/crud";
import { update, show } from "@/src/services/crud";
import Tracker from "@/src/components/Tracker";
import { supportPlanSteps } from "@/src/components/SupportPlan/SupportPlanTrackerLIst";
import { SupportApiResponse } from "@/src/components/SupportPlan/ApiResponse";
import SupportPlanFormData from "@/src/components/SupportPlan/SupportPlanFormData";
import { SupportPlanResponse } from "@/src/components/SupportPlan/types";
import { mapApiResponseToFormData } from "@/src/components/SupportPlan/MapApiResponseToFormData";
import Image from "next/image";
import SupportPlanSection from "@/src/components/SupportPlan/SupportPlanSection";
import { sectionsConfig } from "@/src/components/SupportPlan/sectionsConfig";
import { SupportPlanService } from "@/src/components/SupportPlan/ApiResponse";
import { SupportPlanMyGoal } from "@/src/components/SupportPlan/ApiResponse";

// Add type for validation errors
type ValidationErrors = Record<string, string[]>;

// Constants
const INITIAL_SERVICES: SupportPlanService[] = [
  {
    name: "",
    service_provided: "",
    funded_by: "",
    duration_frequency: "",
    support_to_implement_by_us: 0,
    goal_key: "",
  },
];

const INITIAL_GOALS: SupportPlanMyGoal[] = [
  {
    goal: "",
    measure_progress: "",
    success_look_like: "",
    who_will_support: "",
    participant_support: "",
    target_date: "",
    goal_key: "",
  },
];

const SECTION_NAMES = [
  "SupportPlan",
  "Approval",
  "Representatives",
  "CarePartner",
  "KeepInTouch",
  "NonResponsive",
  "ParticipantDetail",
  "ContactDetail",
  "SecondaryContactDetail",
  "Funding",
  "SupportPlanServices",
  "EmployeeMatchingNeeds",
  "SupportPlanMyGoals",
  "LivingArrangements",
  "CulturalDiversities",
  "GeneralHealth",
  "MedicationManagement",
  "MobilityTransfers",
  "FallsRisks",
  "Cognitions",
  "BehaviourSupports",
  "PersonalCare",
  "Continences",
  "Visions",
  "Hearings",
  "SkinConditions",
  "Dietaries",
  "PainManagement",
  "SocialConnections",
  "HomeMaintenances",
  "FinancialSupport",
  "InformalSupports",
  "EmergencyReadiness",
  "FireHeatReadiness",
  "StormFlooding",
  "TelecommunicationOutages",
  "PowerOutages",
  "EndOfLifeAdvancedCare",
] as const;

type SectionKey = (typeof SECTION_NAMES)[number];

type SupportPlanFormDataType = typeof SupportPlanFormData;

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

  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [formData, setFormData] =
    useState<SupportPlanFormDataType>(SupportPlanFormData);
  const [services, setServices] =
    useState<SupportPlanService[]>(INITIAL_SERVICES);
  const [myGoals, setMyGoals] = useState<SupportPlanMyGoal[]>(INITIAL_GOALS);
  
  // Add state for validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formSubmissionError, setFormSubmissionError] = useState<string>("");

  // Memoized values
  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [openSections, setOpenSections] =
    useState<Record<SectionKey, boolean>>(initialOpenSections);

  // Memoized component props getter
  const getComponentProps = useCallback(
    (key: string) => {
      switch (key) {
        case "SupportPlanServices":
          return { services, setServices };
        case "SupportPlanMyGoals":
          return { myGoals, setMyGoals };
        default:
          return {};
      }
    },
    [services, myGoals]
  );

  // Session bootstrap (token, userid, client_type, optional uuid)
  useEffect(() => {
    (async () => {
      try {
        const form = "support-plan";
        const formUuid = searchParams.get("form-uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";

        // 👇 pass form and form-uuid to API
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

      const response = await show<SupportApiResponse>(
        "support-plan-show",
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

      if (response.data?.services) {
        const typedServices: SupportPlanService[] = response.data.services.map(
          (service) => ({
            name: service.name || "",
            service_provided: service.service_provided || "",
            funded_by: service.funded_by || "",
            duration_frequency: service.duration_frequency || "",
            support_to_implement_by_us: service.support_to_implement_by_us
              ? 1
              : 0,
            goal_key: service.goal_key || "",
          })
        );
        setServices(typedServices);
      }

      if (response.data?.my_goals) {
        const typedMyGoals: SupportPlanMyGoal[] = response.data.my_goals.map(
          (goal) => ({
            goal: goal.goal || "",
            measure_progress: goal.measure_progress || "",
            success_look_like: goal.success_look_like || "",
            who_will_support: goal.who_will_support || "",
            participant_support: goal.participant_support || "",
            target_date: goal.target_date || "",
            goal_key: goal.goal_key || "",
          })
        );
        setMyGoals(typedMyGoals);
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
            alert("Please login again.");
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to refresh session before submit", e);
          
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
        data.append("support_plan_services", JSON.stringify(services));
        data.append("support_plan_my_goals", JSON.stringify(myGoals));

        // Include UUID if it exists
        const effectiveUuid =
          sessionUuid ||
          searchParams.get("form-uuid") ||
          searchParams.get("uuid");
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update("support-plan", data);
        let response: SupportPlanResponse;

        if (apiResponse.success) {
          response = {
            success: true,
            data: apiResponse.data as {
              supportPlan: { uuid: string; id: number };
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
          response.data?.supportPlan?.uuid
        ) {
          const newUuid = response.data.supportPlan.uuid;
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
      } catch (error) {
        console.error("Submission error:", error);
        setFormSubmissionError("An error occurred while submitting the form. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      services,
      myGoals,
      sessionUserId,
      sessionClientType,
      sessionUuid,
      searchParams,
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

  // Memoized completion percentage style
  const completionBarStyle = useMemo(
    () => ({
      width: `${completionPercentage}%`,
    }),
    [completionPercentage]
  );

  // Memoized steps with signature badge for Approval
  const trackerSteps = useMemo(() => {
    const isSigned =
      Boolean(formData.signature) &&
      formData.signature.startsWith("data:image");
    return supportPlanSteps.map((step) =>
      step.key === "Approval"
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
  }, [formData.signature]);

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
              Support Plan
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

            <div className="mb-6 text-gray-700 space-y-4">
              <h2 className="text-center font-bold text-xl">
                About this Support Plan
              </h2>
              <p>
                This Support Plan outlines how we will work with you to achieve
                your goals. It also confirms your approval for us to provide the
                support and services you have agreed to. If your needs or
                circumstances change, the plan will be updated and re-approved
                by you. You will always receive a copy of your current, approved
                plan for your records. We are here to support you every step of
                the way.
              </p>

              <h2 className="text-center font-bold text-xl mt-6">
                Wellness and Reablement
              </h2>
              <p>
                We are committed to supporting you in embedding wellness and
                reablement into as many areas of your supports and services as
                possible. Wellness and reablement means doing with rather than
                doing for—helping you maintain and build your independence
                wherever we can.
              </p>

              <h2 className="text-center font-bold text-xl mt-6">
                Public Holidays
              </h2>
              <p>
                We do not provide care on public holidays unless this has been
                agreed to in your Support Plan and budget. If your needs change
                and you require direct care visits on a Public Holiday, it may
                require some adjustments to your care plan to keep costs within
                budget.
              </p>
            </div>

            {sectionsConfig.map(({ key, title, Component }) => (
              <SupportPlanSection
                key={key}
                sectionRef={sectionRefs[key]}
                title={title}
                isOpen={openSections[key]}
                onToggle={() => handleTrackerClick(key)}
              >
                <Component
                  formData={formData}
                  handleChange={handleChange}
                  {...getComponentProps(key)}
                  uuid={sessionUuid || undefined}
                />
              </SupportPlanSection>
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