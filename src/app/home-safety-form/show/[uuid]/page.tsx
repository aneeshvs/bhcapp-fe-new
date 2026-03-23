"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { verifyFormOtp, show, update, VerifyOtpResponse, getFormSession } from "@/src/services/crud";
import phpApi from "@/src/utils/PhpApi";
import api from "@/src/utils/api";
import { HomeSafetyChecklistFormData } from "@/src/components/HomeSafety/ApiResponse";
import HomeSafety from "@/src/components/HomeSafety/FormData";
import { mapApiResponseToFormData } from "@/src/components/HomeSafety/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/HomeSafety/SectionsConfig";
import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { HomeSafetyResponse } from "@/src/components/HomeSafety/types";
import { HomeSafetyFormTracker } from "@/src/components/HomeSafety/FormTracker";
import Image from "next/image";

const SECTION_NAMES = [
  "HomeSafetyDetails", "HomeSafetyOutside", "InsideResidences", "HallwaysChecks", "KitchenAssessments", "OutsideAssessments", "HomeMiscellaneous", "HomeResidenceTypes",
] as const;

type SectionKey = (typeof SECTION_NAMES)[number];
type SupportFormaDataType = typeof HomeSafety;

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

export default function ShowHomeSafetyPage() {
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
    const [formData, setFormData] = useState<SupportFormaDataType>(HomeSafety);
    const [isSignatureOnly, setIsSignatureOnly] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const sectionRefs = useMemo(() => createSectionRefs(), []);
    const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
    const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(initialOpenSections);

    const fetchSignatureMode = useCallback(async () => {
        try {
            const response = await phpApi.get('/php/check-signature-mode.php', {
                params: {
                    uuid,
                    form_name: 'home_safety_checklist_assessment'
                }
            });
            if (response.data.success) {
                setIsSignatureOnly(response.data.signature_only === 1);
                setIsReadOnly(response.data.signature_only === 1);
            }
        } catch (error) {
            console.error("Error fetching signature mode:", error);
        }
    }, [uuid]);

    useEffect(() => {
        fetchSignatureMode();
    }, [fetchSignatureMode]);

    useEffect(() => {
        (async () => {
            try {
                if (sessionUserId) {
                    const { client_name } = await getFormSession("home-safety", uuid as string, sessionUserId, sessionClientType);
                    if (client_name) setClientName(client_name);
                }
            } catch (e) {
                console.error("getFormSession failed", e);
            }
        })();
    }, [uuid, sessionUserId, sessionClientType]);

    const fetchFormData = useCallback(async () => {
        try {
            const response = await show<HomeSafetyChecklistFormData>("home-safety-assessment", uuid as string);
            
            if (response.data?.completion_percentage !== undefined) {
                setCompletionPercentage(response.data.completion_percentage);
            }

            if (!response?.data) return;

            setFormData(mapApiResponseToFormData(response.data) as SupportFormaDataType);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [uuid]);

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
            fetchSignatureMode();
            fetchFormData();
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
            data.append("signature_only", isSignatureOnly ? "1" : "0");
            data.append("submit_final", "1");

            if (uuid) {
                data.append("uuid", uuid as string);
            }

            const apiResponse = await api.post(
                "client/home-safety-assessment/update", 
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
        return HomeSafetyFormTracker.map((step) => step);
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
                    Review: Form - F5 Home Safety <br />Checklist Assessment
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto">
                <Tracker steps={trackerSteps} onStepClick={(key) => handleTrackerClick(key as SectionKey)} />

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mt-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">HOW TO USE THIS FORM</h2>
                    <p className="text-gray-700 leading-relaxed">
                        You are to ensure onsite completion of the Home Safety Check prior to the commencement
                        of service delivery. Only complete those areas related to the services to be provided
                        and ensure you address potential risks with the Participant and put in place risk controls.
                        This safety checklist is to be completed each time changes to the supports or their
                        delivery are required, and/or any changes made to the Participant’s Service Agreement
                        and/or Support Care Plan.
                    </p>
                </div>

                {sectionsConfig.map(({ key, title, Component }) => (
                    <AccordianPlanSection
                        key={key}
                        sectionRef={sectionRefs[key as SectionKey]}
                        title={title}
                        isOpen={openSections[key as SectionKey]}
                        onToggle={() => handleTrackerClick(key as SectionKey)}
                    >
                        <fieldset className={isReadOnly ? "opacity-75 pointer-events-none" : ""}>
                            <Component
                                formData={formData}
                                handleChange={handleChange}
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
