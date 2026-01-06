"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { verifyFormOtp, show, update, VerifyOtpResponse } from "@/src/services/crud";
import { ConfidentialInformation } from "@/src/components/ConfidentialInformation/ApiResponse";
import ConfidentialInformationFormData from "@/src/components/ConfidentialInformation/FormData";
import { mapApiResponseToFormData } from "@/src/components/ConfidentialInformation/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/ConfidentialInformation/SectionsConfig";
import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
import Image from "next/image";
import { ConfidentialInformationFormTracker } from "@/src/components/ConfidentialInformation/FormTracker";

const SECTION_NAMES = [
    "ConfidentialInformation",
    "ConfidentialAgency",
    "ConfidentialConsent",
    "VerbalConsent",
    "PreConsentDisclosures",
] as const;

type SectionKey = (typeof SECTION_NAMES)[number];
type SupportFormaDataType = typeof ConfidentialInformationFormData;

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

export default function ShowConfidentialInformationPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const searchParams = useSearchParams();
    const sessionUserId = searchParams.get("userid") || "";
    const sessionClientType = searchParams.get("client_type") || "";
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [clientName, setClientName] = useState("");

    const [formData, setFormData] =
        useState<SupportFormaDataType>(ConfidentialInformationFormData);

    const sectionRefs = useMemo(() => createSectionRefs(), []);
    const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
    const [openSections, setOpenSections] =
        useState<Record<SectionKey, boolean>>(initialOpenSections);

    const fetchFormData = useCallback(async () => {
        try {
            const response = await show<ConfidentialInformation>(
                "confidential-form",
                uuid as string
            );

            if (!response?.data) return;

            setFormData(
                mapApiResponseToFormData(response.data) as SupportFormaDataType
            );
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [uuid]);

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

    const handleTrackerClick = useCallback(
        (key: SectionKey) => {
            setOpenSections((prev) => {
                return { ...prev, [key]: !prev[key] };
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {

             const missingFields = [];

            // Accepted By (Provider) requirements
            if (!formData.signature) missingFields.push("Signature");

            // Participant requirements
            if (!formData.verbal_signature) missingFields.push("Verbal Consent Signature");


            if (missingFields.length > 0) {
                window.alert(`Please fill in the following required fields:\n- ${missingFields.join("\n- ")}`);
                setLoading(false);
                return;
            }

            const data = new FormData();

            // ONLY append signature related fields
            // Map 'signature' to 'signature_consent' as per backend validation error
            if (formData.signature) data.append("signature_consent", formData.signature);
            if (formData.signed_date) data.append("signed_date", formData.signed_date);
            if (formData.signed_by) data.append("signed_by", formData.signed_by);
            if (formData.name) data.append("name", formData.name);
            if (formData.witnessed_by) data.append("witnessed_by", formData.witnessed_by);

            // Append Verbal Consent fields
            if (formData.verbal_signature) data.append("verbal_signature", formData.verbal_signature);
            if (formData.verbal_signed_date) data.append("verbal_signed_date", formData.verbal_signed_date);
            if (formData.verbal_name) data.append("verbal_name", formData.verbal_name);
            if (formData.position) data.append("position", formData.position);

            // Append Identifiers
            data.append("user_id", sessionUserId);
            data.append("client_type", sessionClientType);
            if (uuid) {
                data.append("uuid", uuid);
            }

            if (formData.submit_final === 1) {
                data.append("submit_final", "1");
            }

            console.log("Submitting signature data...");
            const apiResponse = await update(
                "client/confidential-form/update",
                data
            );

            if (apiResponse.success) {
                window.alert("Signature submitted successfully.");
                await fetchFormData();
            } else {
                console.error("Submission failed", apiResponse);
                window.alert(`Submission failed: ${apiResponse.message}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            window.alert("An error occurred while submitting.");
        } finally {
            setLoading(false);
        }
    };

    const trackerSteps = useMemo(() => ConfidentialInformationFormTracker, []);

    const validatePassword = async (password: string): Promise<VerifyOtpResponse | null> => {
        try {
            const response = await verifyFormOtp(uuid, password);

            if (response.success) {
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
            return;
        }

        const data = await validatePassword(enteredPassword);

        if (data) {
            setAuthenticated(true);
            setLoading(false);
            if (data.client_name) {
                setClientName(data.client_name);
            }
            fetchFormData();
        }
    };

    if (!authenticated) {
        return (
            <div className="p-10 max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">
                    Enter Password to Continue
                </h2>
                <form onSubmit={handlePasswordSubmit}>
                    <input
                        type="password"
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        placeholder="Enter password"
                        className="border px-4 py-2 rounded mb-2 w-full"
                    />
                    {passwordError && (
                        <p className="text-red-500 text-sm mb-2">{passwordError}</p>
                    )}
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
        <>
            <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
                <div className="flex justify-end">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center w-48">
                        <h1 className="text-xl md:text-2xl font-bold text-blue-800">
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

                <div className="flex justify-center mb-6">
                    <h1 className="text-center text-2xl md:text-3xl font-bold mt-2 text-gray-800">
                        Review: Confidential Information Form
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
                >
                    <Tracker
                        steps={trackerSteps}
                        onStepClick={(key) => handleTrackerClick(key as SectionKey)}
                    />

                    {sectionsConfig.map(({ key, title, Component }) => {
                        const isSignatureSection = key === "ConfidentialConsent" || key === "VerbalConsent";

                        return (
                            <React.Fragment key={key}>
                                <AccordianPlanSection
                                    sectionRef={sectionRefs[key as SectionKey]}
                                    title={title}
                                    isOpen={openSections[key as SectionKey]}
                                    onToggle={() => handleTrackerClick(key as SectionKey)}
                                >
                                    <fieldset
                                        disabled={!isSignatureSection}
                                        className={
                                            !isSignatureSection
                                                ? "opacity-75 pointer-events-none"
                                                : ""
                                        }
                                    >
                                        <Component
                                            formData={formData}
                                            handleChange={handleChange}
                                            uuid={uuid || undefined}
                                        />
                                    </fieldset>
                                </AccordianPlanSection>
                            </React.Fragment>
                        );
                    })}

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

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? "Submitting Signature..." : "Submit Signature"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
