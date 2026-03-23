"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { verifyFormOtp, show, update, VerifyOtpResponse, getFormSession } from "@/src/services/crud";
import phpApi from "@/src/utils/PhpApi";
import api from "@/src/utils/api";
import Tracker from "@/src/components/Tracker";
import { RiskAssessmentResponse } from "@/src/components/IndividualRiskAssesment/ApiResponse";
import RiskAssessmentFormData from "@/src/components/IndividualRiskAssesment/RiskAssesmentFormData";
import { mapApiResponseToFormData } from "@/src/components/IndividualRiskAssesment/MapApiResponseToFormData";
import Image from "next/image";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { sectionsConfig } from "@/src/components/IndividualRiskAssesment/sectionsConfig";
import { PlanManualHandlingsFormData } from "@/src/components/IndividualRiskAssesment/ApiResponse";

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
  return SECTION_NAMES.reduce((acc, sectionKey) => {
    acc[sectionKey] = true;
    return acc;
  }, {} as Record<SectionKey, boolean>);
};

const createSectionRefs = () => {
  return SECTION_NAMES.reduce((acc, sectionKey) => {
    acc[sectionKey] = React.createRef<HTMLDivElement | null>();
    return acc;
  }, {} as Record<SectionKey, React.RefObject<HTMLDivElement | null>>);
};

export default function ShowRiskAssessmentPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const searchParams = useSearchParams();
    const sessionUserId = searchParams.get("userid") || "";
    const sessionClientType = searchParams.get("client_type") || "";
    
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [clientName, setClientName] = useState("");

    const [manualHandlings, setManualHandlings] = useState<PlanManualHandlingsFormData[]>(ManualHandlings);
    const [completionPercentage, setCompletionPercentage] = useState<number>(0);
    const [formData, setFormData] = useState<SupportPlanFormDataType>(RiskAssessmentFormData);
    const [isSignatureOnly, setIsSignatureOnly] = useState(false);

    const isAdmin = useMemo(() => {
        if (typeof window === "undefined") return false;
        const urlAdmin = searchParams.get("admin") === "1";
        const localToken = !!localStorage.getItem("token");
        return urlAdmin || localToken;
    }, [searchParams]);

    const isReadOnly = isSignatureOnly;

    const sectionRefs = useMemo(() => createSectionRefs(), []);
    const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
    const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(initialOpenSections);

    useEffect(() => {
        (async () => {
            try {
                if (sessionUserId) {
                    const { client_name } = await getFormSession("risk-assessment", uuid as string, sessionUserId, sessionClientType);
                    if (client_name) setClientName(client_name);
                }
            } catch (e) {
                console.error("getFormSession failed", e);
            }
        })();
    }, [uuid, sessionUserId, sessionClientType]);

    const fetchFormData = useCallback(async () => {
        try {
            const response = await show<RiskAssessmentResponse>("risk-assessment", uuid as string);
            
            if (response.data?.completion_percentage !== undefined) {
                setCompletionPercentage(response.data.completion_percentage);
            }

            if (!response?.data) return;

            setFormData(mapApiResponseToFormData(response.data) as SupportPlanFormDataType);

            if (response.data?.manual_handlings) {
                const typedServices: PlanManualHandlingsFormData[] = response.data.manual_handlings.map((manualHandlings) => ({
                    goal_key: manualHandlings.goal_key || "",
                    training_provided: manualHandlings.training_provided ? 1 : 0,
                    training_hazards: manualHandlings.training_hazards || "",
                    training_management_plan: manualHandlings.training_management_plan || "",
                    tasks_safe: manualHandlings.tasks_safe ? 1 : 0,
                    tasks_hazards: manualHandlings.tasks_hazards || "",
                    tasks_management_plan: manualHandlings.tasks_management_plan || "",
                }));
                setManualHandlings(typedServices);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [uuid]);

    const fetchSignatureMode = useCallback(async () => {
        try {
            const modeResponse = await phpApi.get('/php/check-signature-mode.php', {
                params: {
                    uuid,
                    form_name: 'individual_risk_assessment'
                }
            });
            if (modeResponse.data.success) {
                const isSigOnly = modeResponse.data.signature_only === 1;
                console.log("PHP backend signature_only:", isSigOnly);
                setIsSignatureOnly(isSigOnly);
            }
        } catch (err) {
            console.error("Error checking signature mode:", err);
        }
    }, [uuid]);

    useEffect(() => {
        fetchSignatureMode();
        if (authenticated) {
            fetchFormData();
        }
    }, [fetchSignatureMode, authenticated, fetchFormData]);

    const getComponentProps = useCallback((key: string) => {
        switch (key) {
            case "PlanManualHandlings":
                return { manualHandlings, setManualHandlings };
            default:
                return {};
        }
    }, [manualHandlings]);

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
            if (data.client_name) {
                setClientName(data.client_name);
            }
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
            data.append("manual_handlings", JSON.stringify(manualHandlings || []));

            if (uuid) {
                data.append("uuid", uuid as string);
            }

            if (isSignatureOnly) {
                data.append("signature_only", "1");
            }

            data.append("submit_final", "1");

            // Use the new public client update endpoint
            const apiResponse = await api.post("/client/risk-assessment/update", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            if (apiResponse.data.success) {
                window.alert("Form submitted successfully.");
                await fetchFormData();
            } else {
                window.alert(`Submission failed: ${apiResponse.data.message}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            window.alert("An error occurred while submitting.");
        } finally {
            setLoading(false);
        }
    };

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
                    Review: Form - F5a Individual Risk Assessment
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto">
                <Tracker steps={trackerSteps} onStepClick={(key) => handleTrackerClick(key as SectionKey)} />

                <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
                    <div className="text-gray-700 space-y-3 w-full">
                        <h1 className="text-center text-2xl font-semibold text-gray-700 mb-4">HOW TO USE THIS FORM</h1>
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
                    {(!isReadOnly || isSignatureOnly) && (
                        <button type="submit" disabled={loading} className="btn-primary text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50">
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
