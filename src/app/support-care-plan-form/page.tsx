"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { getFormSession } from "@/src/services/crud";
import { update, show } from "@/src/services/crud";
import { CarePlanResponse } from "@/src/components/SupportCarePlan/ApiResponse";
import SupportFormaData from "@/src/components/SupportCarePlan/SupportFormData";
import { mapApiResponseToFormData } from "@/src/components/SupportCarePlan/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/SupportCarePlan/sectionsConfig";
import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { SupportResponse } from "@/src/components/SupportCarePlan/types";
import { SupportCarePlanTracker } from "@/src/components/SupportCarePlan/SupportCarePlanTracker";
import { SilGoals } from "@/src/components/SupportCarePlan/ApiResponse";
import { HomeCares } from "@/src/components/SupportCarePlan/ApiResponse";
import { SupportCoordination } from "@/src/components/SupportCarePlan/ApiResponse";
import { EmergencyContact } from "@/src/components/SupportCarePlan/ApiResponse";
import Image from "next/image";

const SECTION_NAMES = [
  "SupportCarePlan",
  "AlternativeDecisionMaker",
  "SilGoals",
  "HomeCares",
  "SupportCoordinations",
  "CommunicationPlan",
  "Emergency",
  "EmergencyContact",
  "ImportantContact",
  "LocalServiceContact",
  "EmergencyScenario",
] as const;

const makeInitialGoals = (category: string): SilGoals[] => [
  {
    category,
    goal_key: "",
    goal_title: "",
    goals_of_support: "",
    steps: "",
    organisation_steps: "",
    risk: "",
    risk_management_strategies: "",
  },
];

const emergencyContact: EmergencyContact[] = [
  {
    name: "",
    relationship: "",
    phone: "",
    email: "",
    location: "",
    goal_key: "",
  },
];


type SectionKey = (typeof SECTION_NAMES)[number];
type SupportFormaDataType = typeof SupportFormaData;

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
  const [isInvalidSession, setIsInvalidSession] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [formData, setFormData] =
    useState<SupportFormaDataType>(SupportFormaData);
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formSubmissionError, setFormSubmissionError] = useState<string>("");

  const [myGoals, setMyGoals] = useState<SilGoals[]>(() =>
    makeInitialGoals("sil")
  );
  const [homeGoals, setHomeGoals] = useState<HomeCares[]>(() =>
    makeInitialGoals("homecare")
  );
  const [supportGoals, setSupportGoals] = useState<SupportCoordination[]>(() =>
    makeInitialGoals("support_coordination")
  );
  const [emergencyContacts, setEmergencyContacts] =
    useState<EmergencyContact[]>(emergencyContact);
  // Memoized values
  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [communicationPlan, setCommunicationPlan] = useState({
    helps_me_talk: [] as string[],
    helps_me_understand: [] as string[],
    please_communicate_by: [] as string[],
    emergency_communication: "",
  });
  const [openSections, setOpenSections] =
    useState<Record<SectionKey, boolean>>(initialOpenSections);

  const getComponentProps = useCallback(
    (key: string) => {
      switch (key) {
        case "SilGoals":
          return { myGoals, setMyGoals };
        case "HomeCares":
          return { homeGoals, setHomeGoals };
        case "SupportCoordinations":
          return { supportGoals, setSupportGoals };
        case "CommunicationPlan":
          return { communicationPlan, setCommunicationPlan };
        case "EmergencyContact":
          return { emergencyContacts, setEmergencyContacts };
        default:
          return {};
      }
    },
    [myGoals, homeGoals, supportGoals, communicationPlan, emergencyContacts]
  );

  // Function to format field names for display
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Session bootstrap (token, userid, client_type, optional uuid)
  useEffect(() => {
    (async () => {
      try {
        const form = "support-care-plan";
        const formUuid = searchParams.get("form-uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";

        // pass form, form_token, form_client_type, and form-uuid to API
        const { token, client_name, uuid } = await getFormSession(
          form,
          formUuid,
          sessionUserId,
          sessionClientType,
        );


        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify({ type: "client" }));
          setFlag(true);
        } else {
          setIsInvalidSession(true);
        }

        // setSessionUserId(userid ?? "");
        // setSessionClientType(client_type ?? "");
        setClientName(client_name ?? "");
        if (uuid) setSessionUuid(uuid);
      } catch (e) {
        console.error("Failed to get form session", e);
      }
    })();
  }, [searchParams]);

  // Memoized fetch function
  const fetchFormData = useCallback(async () => {
    try {
      const effectiveUuid = sessionUuid;
      if (!effectiveUuid) {
        console.log("No UUID - skipping initial data fetch");
        return;
      }

      const response = await show<CarePlanResponse>(
        "support-care-plan",
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

      if (response.data?.sil_goals) {
        const typedMyGoals: SilGoals[] = response.data.sil_goals.map(
          (goal) => ({
            category: goal.category || "sil",
            goal_key: goal.goal_key || "",
            goal_title: goal.goal_title || "",
            goals_of_support: goal.goals_of_support || "",
            steps: goal.steps || "",
            organisation_steps: goal.organisation_steps || "",
            risk: goal.risk || "",
            risk_management_strategies: goal.risk_management_strategies || "",
          })
        );
        setMyGoals(typedMyGoals);
      }
      if (response.data?.homecare_goals) {
        const typedHomeGoals: HomeCares[] = response.data.homecare_goals.map(
          (goal) => ({
            category: goal.category || "homecare",
            goal_key: goal.goal_key || "",
            goal_title: goal.goal_title || "",
            goals_of_support: goal.goals_of_support || "",
            steps: goal.steps || "",
            organisation_steps: goal.organisation_steps || "",
            risk: goal.risk || "",
            risk_management_strategies: goal.risk_management_strategies || "",
          })
        );
        setHomeGoals(typedHomeGoals);
      }
      if (response.data?.support_coordination_goals) {
        const typedSupportGoals: SupportCoordination[] =
          response.data.support_coordination_goals.map((goal) => ({
            category: goal.category || "support_coordination",
            goal_key: goal.goal_key || "",
            goal_title: goal.goal_title || "",
            goals_of_support: goal.goals_of_support || "",
            steps: goal.steps || "",
            organisation_steps: goal.organisation_steps || "",
            risk: goal.risk || "",
            risk_management_strategies: goal.risk_management_strategies || "",
          }));
        setSupportGoals(typedSupportGoals);
      }

      // Load communication plan data
      if (
        response.data?.communication_plans &&
        response.data.communication_plans.length > 0
      ) {
        const commPlan = response.data.communication_plans[0]; // Get the first communication plan
        setCommunicationPlan({
          helps_me_talk: Array.isArray(commPlan.helps_me_talk)
            ? commPlan.helps_me_talk
            : typeof commPlan.helps_me_talk === "string"
              ? [commPlan.helps_me_talk]
              : [],
          helps_me_understand: Array.isArray(commPlan.helps_me_understand)
            ? commPlan.helps_me_understand
            : typeof commPlan.helps_me_understand === "string"
              ? [commPlan.helps_me_understand]
              : [],
          please_communicate_by: Array.isArray(commPlan.please_communicate_by)
            ? commPlan.please_communicate_by
            : typeof commPlan.please_communicate_by === "string"
              ? [commPlan.please_communicate_by]
              : [],
          emergency_communication: commPlan.emergency_communication || "",
        });
      }

      if (response.data?.emergency_contacts) {
        const typedEmergencyContacts: EmergencyContact[] =
          response.data.emergency_contacts.map((contact) => ({
            name: contact.name || "",
            relationship: contact.relationship || "",
            phone: contact.phone || "",
            email: contact.email || "",
            location: contact.location || "",
            goal_key: contact.goal_key || "",
          }));
        setEmergencyContacts(typedEmergencyContacts);
      }
    } catch (error) {
      console.error("Error fetching service agreement data:", error);
    }
  }, [sessionUuid]);

  // Fetch data effect
  useEffect(() => {
    const effectiveUuid = sessionUuid;
    if (effectiveUuid) {
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

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted");
      setLoading(true);
      setValidationErrors({});
      setFormSubmissionError("");

      try {
        const data = new FormData();

        if (formData.submit_final === 1) {
          data.append("submit_final", "1");
        }

        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            data.append(key, String(value));
          }
        });

        data.append("user_id", sessionUserId || "");
        data.append("client_type", sessionClientType || "");
        const allGoals = [...myGoals, ...homeGoals, ...supportGoals];
        data.append("sil_goals", JSON.stringify(allGoals));
        data.append(
          "helps_me_talk",
          JSON.stringify(communicationPlan.helps_me_talk)
        );
        data.append(
          "helps_me_understand",
          JSON.stringify(communicationPlan.helps_me_understand)
        );
        data.append(
          "please_communicate_by",
          JSON.stringify(communicationPlan.please_communicate_by)
        );
        data.append(
          "emergency_communication",
          communicationPlan.emergency_communication
        );
        data.append("emergency_contacts", JSON.stringify(emergencyContacts));

        // Include UUID if it exists
        const effectiveUuid = sessionUuid;
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update("support-care-plan/update", data);
        let response: SupportResponse;
        if (apiResponse.success) {
          response = {
            success: true,
            data: apiResponse.data as {
              supportCarePlan: { uuid: string; id: number };
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
          response.data?.supportCarePlan?.uuid
        ) {
          const newUuid = response.data.supportCarePlan.uuid;
          setSessionUuid(newUuid);
          // Push the UUID to the URL as a query parameter
          router.push(`?form-uuid=${newUuid}&userid=${sessionUserId}&client_type=${sessionClientType}`, { scroll: false });
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
      myGoals,
      homeGoals,
      supportGoals,
      communicationPlan,
      emergencyContacts,
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
  }, [searchParams, handleSubmit]);

  // Memoized completion percentage style
  const completionBarStyle = { width: `${completionPercentage}%` };

  const trackerSteps = useMemo(() => {
    return SupportCarePlanTracker.map((step) => step);
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
            <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800">
              SCP-01 Support Care Plan
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
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-md mt-8 text-gray-700">
              <p className="font-medium">
                Best of Homecare is committed to ensuring that all participants
                are informed about the organisations Emergency and Disaster
                Management Plan. The following information outlines how Best of
                Homecare intends to respond in the event of an emergency.
              </p>
            </div>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-md mt-6 text-gray-700 space-y-6">
              {/* PANDEMIC OUTBREAK */}
              <div>
                <h2 className="font-semibold text-lg mb-1">
                  PANDEMIC OUTBREAK
                </h2>
                <ul className="list-disc ml-6 space-y-1">
                  <li>
                    Where a confirmed case occurs, Best of Homecare will explain
                    to you the need to isolate and explore options with you.
                  </li>
                  <li>
                    Continue to provide services that you are dependent on for
                    daily living with appropriate infection control management.
                  </li>
                  <li>Offer online support where appropriate.</li>
                </ul>
              </div>

              {/* FIRE */}
              <div>
                <h2 className="font-semibold text-lg mb-1">FIRE</h2>
                <p>
                  Staff will not travel into fire zones, floodwaters, or travel
                  during extreme thunderstorms or severe weather. Emergency
                  Services and Emergency Contact lists will be activated by Best
                  of Homecare, who will monitor your safety through ongoing
                  communication with you and your supports.
                </p>
              </div>

              {/* FLOOD */}
              <div>
                <h2 className="font-semibold text-lg mb-1">FLOOD</h2>
                <p>
                  Best of Homecare will contact you to assess the situation,
                  contact your local Emergency Services, and secondary contacts
                  as required. Ongoing communication will be maintained to
                  monitor your safety.
                </p>
              </div>

              {/* EXTREME HEATWAVES */}
              <div>
                <h2 className="font-semibold text-lg mb-1">
                  EXTREME HEATWAVES
                </h2>
                <p>
                  Contact will be made prior to the heatwave to ensure adequate
                  cooling, water, and other requirements are available. If
                  required, Best of Homecare will either provide support or
                  contact your Support Network for onsite availability.
                </p>
              </div>

              {/* THUNDERSTORMS AND SEVERE WEATHER */}
              <div>
                <h2 className="font-semibold text-lg mb-1">
                  THUNDERSTORMS AND SEVERE WEATHER
                </h2>
                <p>
                  Contact will be made prior to the event to ensure food, water,
                  and essential requirements are available. If required, Best of
                  Homecare will either provide onsite support or contact your
                  Support Network for availability.
                </p>
              </div>
            </div>

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
      ) : isInvalidSession ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="text-red-500 font-bold">Unauthorized Please login again</span>
        </div>
      ) : (
        // Loader when flag is false
        <div className="flex justify-center items-center min-h-[200px]">
          <span>Loading...</span>
        </div>
      )
      }
    </>
  );
}
