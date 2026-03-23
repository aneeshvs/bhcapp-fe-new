"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { verifyFormOtp, show, update, VerifyOtpResponse, getFormSession } from "@/src/services/crud";

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
import phpApi from "@/src/utils/PhpApi";
import api from "@/src/utils/api";

const SECTION_NAMES = [
  "SupportCarePlan",
  "AlternativeDecisionMaker",
  "SilGoals",
  "HomeCares",
  "SupportCoordinations",
  "DayProgramGoals",
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

// Utility functions
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

export default function ShowSupportCarePlanPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const searchParams = useSearchParams();
    const sessionUserId = searchParams.get("userid") || "";
    const sessionClientType = searchParams.get("client_type") || "";
    
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [clientName, setClientName] = useState("");

    const [completionPercentage, setCompletionPercentage] = useState<number>(0);
    const [formData, setFormData] = useState<SupportFormaDataType>(SupportFormaData);
    const [isSignatureOnly, setIsSignatureOnly] = useState(true);

    const [myGoals, setMyGoals] = useState<SilGoals[]>(makeInitialGoals("sil"));
    const [homeGoals, setHomeGoals] = useState<HomeCares[]>(makeInitialGoals("homecare"));
    const [supportGoals, setSupportGoals] = useState<SupportCoordination[]>(makeInitialGoals("support_coordination"));
    const [dayProgramGoals, setDayProgramGoals] = useState<SilGoals[]>(makeInitialGoals("day_program"));
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(emergencyContact);
    
    const [communicationPlan, setCommunicationPlan] = useState({
        helps_me_talk: [] as string[],
        helps_me_understand: [] as string[],
        please_communicate_by: [] as string[],
        emergency_communication: "",
    });

    const sectionRefs = useMemo(() => createSectionRefs(), []);
    const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
    const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(initialOpenSections);

    const isAdmin = useMemo(() => {
        if (typeof window === "undefined") return false;
        const urlAdmin = searchParams.get("admin") === "1";
        const localToken = !!localStorage.getItem("token");
        return urlAdmin || localToken;
    }, [searchParams]);

    const isReadOnly = isSignatureOnly;


    const fetchSignatureMode = useCallback(async () => {
        try {
            const response = await phpApi.get('/php/check-signature-mode.php', {
                params: {
                    uuid,
                    form_name: 'support_care_plan'
                }
            });
            if (response.data.success) {
                setIsSignatureOnly(response.data.signature_only === 1);
            }
        } catch (error) {
            console.error("Error fetching signature mode:", error);
        }
    }, [uuid]);

    const fetchFormData = useCallback(async () => {
        try {
            const response = await show<CarePlanResponse>("support-care-plan", uuid as string);
            
            if (response.data?.completion_percentage !== undefined) {
                setCompletionPercentage(response.data.completion_percentage);
            }

            if (!response?.data) return;

            setFormData(mapApiResponseToFormData(response.data) as SupportFormaDataType);

            if (response.data?.sil_goals) {
                setMyGoals(response.data.sil_goals.map((goal) => ({
                    category: goal.category || "sil",
                    goal_key: goal.goal_key || "",
                    goal_title: goal.goal_title || "",
                    goals_of_support: goal.goals_of_support || "",
                    steps: goal.steps || "",
                    organisation_steps: goal.organisation_steps || "",
                    risk: goal.risk || "",
                    risk_management_strategies: goal.risk_management_strategies || "",
                })));
            }
            if (response.data?.homecare_goals) {
                setHomeGoals(response.data.homecare_goals.map((goal) => ({
                    category: goal.category || "homecare",
                    goal_key: goal.goal_key || "",
                    goal_title: goal.goal_title || "",
                    goals_of_support: goal.goals_of_support || "",
                    steps: goal.steps || "",
                    organisation_steps: goal.organisation_steps || "",
                    risk: goal.risk || "",
                    risk_management_strategies: goal.risk_management_strategies || "",
                })));
            }
            if (response.data?.support_coordination_goals) {
                setSupportGoals(response.data.support_coordination_goals.map((goal) => ({
                    category: goal.category || "support_coordination",
                    goal_key: goal.goal_key || "",
                    goal_title: goal.goal_title || "",
                    goals_of_support: goal.goals_of_support || "",
                    steps: goal.steps || "",
                    organisation_steps: goal.organisation_steps || "",
                    risk: goal.risk || "",
                    risk_management_strategies: goal.risk_management_strategies || "",
                })));
            }
            if ((response.data as any)?.day_program_goals) {
                setDayProgramGoals((response.data as any).day_program_goals.map((goal: any) => ({
                    category: goal.category || "day_program",
                    goal_key: goal.goal_key || "",
                    goal_title: goal.goal_title || "",
                    goals_of_support: goal.goals_of_support || "",
                    steps: goal.steps || "",
                    organisation_steps: goal.organisation_steps || "",
                    risk: goal.risk || "",
                    risk_management_strategies: goal.risk_management_strategies || "",
                })));
            }
            if (response.data?.communication_plans && response.data.communication_plans.length > 0) {
                const commPlan = response.data.communication_plans[0];
                setCommunicationPlan({
                    helps_me_talk: Array.isArray(commPlan.helps_me_talk) ? commPlan.helps_me_talk : typeof commPlan.helps_me_talk === "string" ? [commPlan.helps_me_talk] : [],
                    helps_me_understand: Array.isArray(commPlan.helps_me_understand) ? commPlan.helps_me_understand : typeof commPlan.helps_me_understand === "string" ? [commPlan.helps_me_understand] : [],
                    please_communicate_by: Array.isArray(commPlan.please_communicate_by) ? commPlan.please_communicate_by : typeof commPlan.please_communicate_by === "string" ? [commPlan.please_communicate_by] : [],
                    emergency_communication: commPlan.emergency_communication || "",
                });
            }
            if (response.data?.emergency_contacts) {
                setEmergencyContacts(response.data.emergency_contacts.map((contact) => ({
                    name: contact.name || "",
                    relationship: contact.relationship || "",
                    phone: contact.phone || "",
                    email: contact.email || "",
                    location: contact.location || "",
                    goal_key: contact.goal_key || "",
                })));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [uuid]);

    useEffect(() => {
        (async () => {
            try {
                if (sessionUserId) {
                    const { client_name } = await getFormSession("support-care-plan", uuid as string, sessionUserId, sessionClientType);
                    if (client_name) setClientName(client_name);
                }
                // Also fetch signature mode and data on mount
                fetchSignatureMode();
                if (authenticated) {
                    fetchFormData();
                }
            } catch (e) {
                console.error("getFormSession failed", e);
            }
        })();
    }, [uuid, sessionUserId, sessionClientType, authenticated, fetchSignatureMode, fetchFormData]);

    const getComponentProps = useCallback((key: string) => {
        switch (key) {
            case "SilGoals": return { myGoals, setMyGoals };
            case "HomeCares": return { homeGoals, setHomeGoals };
            case "SupportCoordinations": return { supportGoals, setSupportGoals };
            case "DayProgramGoals": return { myGoals: dayProgramGoals, setMyGoals: setDayProgramGoals };
            case "CommunicationPlan": return { communicationPlan, setCommunicationPlan };
            case "EmergencyContact": return { emergencyContacts, setEmergencyContacts };
            default: return {};
        }
    }, [myGoals, homeGoals, supportGoals, dayProgramGoals, communicationPlan, emergencyContacts]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string | number | boolean } }) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleTrackerClick = useCallback((key: SectionKey) => {
        setOpenSections((prev) => {
            if (prev[key]) return { ...prev, [key]: false };
            const newState = SECTION_NAMES.reduce((acc, sectionKey) => ({ ...acc, [sectionKey]: false }), {} as Record<SectionKey, boolean>);
            return { ...newState, [key]: true };
        });
        setTimeout(() => { sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
    }, [sectionRefs]);

    const validatePassword = async (password: string): Promise<VerifyOtpResponse | null> => {
        try {
            const response = await verifyFormOtp(uuid as string, password);
            if (response.success) {
                if (response.client_name) setClientName(response.client_name);
                return response;
            } else {
                setPasswordError("Incorrect password");
                return null;
            }
        } catch (error) {
            console.error("Error validating password:", error);
            setPasswordError("Error validating password. Please try again.");
            return null;
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setLoading(true);

        if (!enteredPassword) {
            setPasswordError("Please enter a password");
            setLoading(false);
            return;
        }

        const data = await validatePassword(enteredPassword);

        if (data) {
            setAuthenticated(true);
            setLoading(false);
            fetchFormData();
            fetchSignatureMode();
        } else {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    data.append(key, String(value));
                }
            });

            data.append("user_id", sessionUserId || "");
            data.append("client_type", sessionClientType || "");
            const allGoals = [...myGoals, ...homeGoals, ...supportGoals, ...dayProgramGoals];
            data.append("sil_goals", JSON.stringify(allGoals));
            data.append("helps_me_talk", JSON.stringify(communicationPlan.helps_me_talk));
            data.append("helps_me_understand", JSON.stringify(communicationPlan.helps_me_understand));
            data.append("please_communicate_by", JSON.stringify(communicationPlan.please_communicate_by));
            data.append("emergency_communication", communicationPlan.emergency_communication);
            data.append("emergency_contacts", JSON.stringify(emergencyContacts));

            if (uuid) {
                data.append("uuid", uuid as string);
            }

            if (isSignatureOnly) {
                data.append("signature_only", "1");
            }

            data.append("submit_final", "1");

            const apiResponse = await api.post(
                "client/support-care-plan/update", 
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            const resData = apiResponse.data;

            if (resData.success) {
                window.alert("Form submitted successfully.");
                await fetchFormData();
            } else {
                window.alert(`Submission failed: ${resData.message}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            window.alert("An error occurred while submitting.");
        } finally {
            setLoading(false);
        }
    };

    const trackerSteps = useMemo(() => {
        return SupportCarePlanTracker.map((step) => step);
    }, []);

    if (!authenticated) {
        return (
            <div className="p-10 max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">Enter Password to Continue</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <input
                        type="password"
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        placeholder="Enter password"
                        className="border px-4 py-2 rounded mb-2 w-full"
                    />
                    {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
            <div className="flex justify-end">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center w-48">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-800">{clientName || "N/A"}</h1>
                </div>
            </div>
            
            <div className="flex justify-center mb-6">
                <Image src="/assets/images/BHC LOGO_SMALL.png" alt="Company Logo" width={180} height={80} className="h-auto" />
            </div>

            <div className="flex justify-center mb-6">
                <h1 className="text-center text-2xl md:text-3xl font-bold mt-2 text-gray-800">
                    Review: SCP-01 Support Care Plan
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto">
                <Tracker steps={trackerSteps} onStepClick={(key) => handleTrackerClick(key as SectionKey)} />

                {sectionsConfig.map(({ key, title, Component }) => (
                    <AccordianPlanSection
                        key={key}
                        sectionRef={sectionRefs[key as SectionKey]}
                        title={title}
                        isOpen={openSections[key as SectionKey]}
                        onToggle={() => handleTrackerClick(key as SectionKey)}
                    >
                        <fieldset
                            disabled={isReadOnly}
                            className={isReadOnly ? "opacity-75 pointer-events-none" : ""}
                        >
                            <Component
                                formData={formData}
                                handleChange={handleChange}
                                {...getComponentProps(key)}
                                uuid={uuid as string}
                                // @ts-ignore
                                hideSaveButton={true}
                            />
                        </fieldset>
                    </AccordianPlanSection>
                ))}

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <button type="submit" disabled={loading} className="btn-primary text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50">
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
}
