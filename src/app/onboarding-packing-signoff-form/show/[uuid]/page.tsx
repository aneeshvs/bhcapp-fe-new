"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { verifyFormOtp, show, update, VerifyOtpResponse } from "@/src/services/crud";
import { OnboardingResponse } from "@/src/components/OnboardingPacking/ApiResponse";
import OnboardingFormData from "@/src/components/OnboardingPacking/FormData";
import { mapApiResponseToFormData } from "@/src/components/OnboardingPacking/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/OnboardingPacking/sectionsConfig";
import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
// import { OnboardingSignoffResponse } from "@/src/components/OnboardingPacking/types";
import { OnboardingPackingTracker } from "@/src/components/OnboardingPacking/ScheduleTracker";
import Image from "next/image";

const SECTION_NAMES = [
    "OnboardingPackingSignoffs",
    "DisabilityActDiscussion",
    "ParticipantDeclaration",
] as const;

type SectionKey = (typeof SECTION_NAMES)[number];
type SupportFormaDataType = typeof OnboardingFormData;

const createInitialOpenSections = (): Record<SectionKey, boolean> => {
    return SECTION_NAMES.reduce((acc, section) => {
        acc[section] = true; // Open all by default for "Show" view, or strictly follow logic
        return acc;
    }, {} as Record<SectionKey, boolean>);
};

const createSectionRefs = () => {
    return SECTION_NAMES.reduce((acc, section) => {
        acc[section] = React.createRef<HTMLDivElement | null>();
        return acc;
    }, {} as Record<SectionKey, React.RefObject<HTMLDivElement | null>>);
};

export default function ShowOnboardingPage() {
    // const router = useRouter();
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
        useState<SupportFormaDataType>(OnboardingFormData);
    // Refs and Sections
    const sectionRefs = useMemo(() => createSectionRefs(), []);
    const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
    const [openSections, setOpenSections] =
        useState<Record<SectionKey, boolean>>(initialOpenSections);

    // 2. Data Fetching
    const fetchFormData = useCallback(async () => {
        try {
            const response = await show<OnboardingResponse>(
                "onboarding-packing-signoff",
                uuid as string
            );

            if (!response?.data) return;

            setFormData(
                mapApiResponseToFormData(response.data) as SupportFormaDataType
            );
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    // 3. Handle Change (Generic)
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

    // 4. Tracker / Accordion Toggle
    const handleTrackerClick = useCallback(
        (key: SectionKey) => {
            setOpenSections((prev) => {
                // Toggle behavior
                return { ...prev, [key]: !prev[key] };
            });

            // Optional scroll
            setTimeout(() => {
                sectionRefs[key]?.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 100);
        },
        [sectionRefs]
    );

    // 5. Submit Handler - SIGNATURE ONLY
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {

            const missingFields = [];

            if (!formData.participant_signature) missingFields.push("Participant Signature");


            if (missingFields.length > 0) {
                window.alert(`Please fill in the following required fields:\n- ${missingFields.join("\n- ")}`);
                setLoading(false);
                return;
            }


            const data = new FormData();

            // ONLY append signature related fields
            // Based on ParticipantDeclaration interface
            if (formData.participant_name)
                data.append("participant_name", formData.participant_name);
            if (formData.relationship_to_participant)
                data.append(
                    "relationship_to_participant",
                    formData.relationship_to_participant
                );
            if (formData.participant_signature)
                data.append("participant_signature", formData.participant_signature);
            if (formData.signed_date)
                data.append("signed_date", formData.signed_date);

            // Append Identifiers
            data.append("user_id", sessionUserId);
            data.append("client_type", sessionClientType);
            if (uuid) {
                data.append("uuid", uuid);
            }

            // Also potentially submit_final if needed (assumed yes as it's a signoff)
            data.append("submit_final", "1");

            console.log("Submitting signature data...");
            const apiResponse = await update(
                "client/onboarding-packing-signoff/update",
                data
            );

            if (apiResponse.success) {
                window.alert("Signature submitted successfully.");
                await fetchFormData(); // Refresh data
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

    const trackerSteps = useMemo(() => OnboardingPackingTracker, []);

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
            // if (data.token) {
            //     localStorage.setItem("token", data.token);
            // }

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
                {/* Header Section */}
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
                        Review: Form - F19 Onboarding Pack Contents <br /> List Sign Off
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
                >
                    {/* Tracker is optional for a Show page, but good for navigation */}
                    <Tracker
                        steps={trackerSteps}
                        onStepClick={(key) => handleTrackerClick(key as SectionKey)}
                    />

                    {sectionsConfig.map(({ key, title, Component }, index) => {
                        const isSignatureSection = key === "ParticipantDeclaration";

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
                                            hideSaveButton={true}
                                        />
                                    </fieldset>
                                </AccordianPlanSection>

                                {/* Replicating the helper text logic from original page */}
                                {index === 1 && (
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mt-6 mb-6">
                                        <p className="text-gray-700 leading-relaxed">
                                            <b>
                                                Prior to scheduling a visit to the participant, please
                                                remember:
                                            </b>
                                        </p>
                                        <ol className="list-decimal ml-6 mt-3 text-gray-700 leading-relaxed space-y-1">
                                            <li>Request that it is a non-smoking environment</li>
                                            <li>
                                                Request that any pets are kept separate to staff, both
                                                inside and outside residence
                                            </li>
                                            <li>
                                                Any directions/instructions to get to residence
                                                including parking options
                                            </li>
                                            <li>
                                                Ask if there have been any past health / safety issues,
                                                or current concerns for how we can ensure safety in the
                                                participant’s environment
                                            </li>
                                            <li>
                                                Clarify which is the preferred door to be used for entry
                                            </li>
                                        </ol>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Submit Actions */}


                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
