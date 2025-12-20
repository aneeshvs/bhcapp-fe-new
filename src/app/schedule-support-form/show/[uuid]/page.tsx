"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { verifyFormOtp, show, update, VerifyOtpResponse } from "@/src/services/crud";
import { ScheduleOfSupportsFormData, FundedSupportsFormData, UnfundedSupportsFormData } from "@/src/components/SupportSchedule/ApiResponse";
import SupportScheduleFormData from "@/src/components/SupportSchedule/FormData";
import { mapApiResponseToFormData } from "@/src/components/SupportSchedule/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/SupportSchedule/sectionsConfig";
import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
import Image from "next/image";
import { SupportScheduleTracker } from "@/src/components/SupportSchedule/SupportScheduleTracker";

const SECTION_NAMES = [
    "ScheduleOfSupports", "FundedSupports", "UnfundedSupports", "AgreementSignatures"
] as const;

type SectionKey = (typeof SECTION_NAMES)[number];
type SupportFormaDataType = typeof SupportScheduleFormData;

const FundedSupport: FundedSupportsFormData[] =
    [{
        support_name: "",
        description: "",
        price: null,
        unit: null,
        payment_information: "",
        delivery_details: "",
        invoicing_details: "",
        grand_total: null,
        goal_key: "",
    }];

const UnfundedSupport: UnfundedSupportsFormData[] = [];

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

export default function ShowScheduleSupportPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const searchParams = useSearchParams();
    const sessionUserId = searchParams.get("userid") || "";
    const sessionClientType = searchParams.get("client_type") || "";
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [formData, setFormData] =
        useState<SupportFormaDataType>(SupportScheduleFormData);
    const [fundedSupportData, setFundedSupportData] =
        useState<FundedSupportsFormData[]>(FundedSupport);
    const [unfundedSupportData, setUnfundedSupportData] =
        useState<UnfundedSupportsFormData[]>(UnfundedSupport);

    const sectionRefs = useMemo(() => createSectionRefs(), []);
    const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
    const [openSections, setOpenSections] =
        useState<Record<SectionKey, boolean>>(initialOpenSections);

    const getComponentProps = useCallback(
        (key: string) => {
            switch (key) {
                case "FundedSupports":
                    return { fundedSupports: fundedSupportData, setFundedSupports: setFundedSupportData };
                case "UnfundedSupports":
                    return { unfundedSupports: unfundedSupportData, setUnfundedSupports: setUnfundedSupportData };
                default:
                    return {};
            }
        },
        [fundedSupportData, unfundedSupportData]
    );

    const fetchFormData = useCallback(async () => {
        try {
            const response = await show<ScheduleOfSupportsFormData>(
                "schedule-of-supports",
                uuid as string
            );

            if (!response?.data) return;

            setFormData(
                mapApiResponseToFormData(response.data) as SupportFormaDataType
            );

            // Map transport array to fundedSupportData
            if (response.data?.transport && Array.isArray(response.data.transport)) {
                setFundedSupportData(response.data.transport);
            }

            // Map unfunded_support array to unfundedSupportData
            if (response.data?.unfunded_support && Array.isArray(response.data.unfunded_support) && response.data.unfunded_support.length > 0) {
                setUnfundedSupportData(response.data.unfunded_support);
            }

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
            const data = new FormData();

            // Append signature related fields
            if (formData.participant_signature) data.append("participant_signature", formData.participant_signature);
            if (formData.participant_date) data.append("participant_date", formData.participant_date);
            if (formData.agreement_participant_name) data.append("agreement_participant_name", formData.agreement_participant_name);

            if (formData.representative_signature) data.append("representative_signature", formData.representative_signature);
            if (formData.representative_date) data.append("representative_date", formData.representative_date);
            if (formData.representative_name) data.append("representative_name", formData.representative_name);

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
                "client/schedule-of-support/update",
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

    const trackerSteps = useMemo(() => SupportScheduleTracker, []);

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
                        Review: Schedule of Supports
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

                    {sectionsConfig.map(({ key, title, Component }, index) => (
                        <React.Fragment key={key}>
                            <AccordianPlanSection
                                key={key}
                                sectionRef={sectionRefs[key as SectionKey]}
                                title={title}
                                isOpen={openSections[key as SectionKey]}
                                onToggle={() => handleTrackerClick(key as SectionKey)}
                            >
                                <fieldset disabled={key !== "AgreementSignatures"} className={key !== "AgreementSignatures" ? "opacity-75 pointer-events-none" : ""}>
                                    <Component
                                        formData={formData}
                                        handleChange={handleChange}
                                        {...getComponentProps(key)}
                                        uuid={uuid || undefined}
                                    />
                                </fieldset>
                            </AccordianPlanSection>
                            {index === 0 && (
                                <div className="section">
                                    <div className="font-semibold text-lg mb-4">Transport</div>

                                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                                        <tbody>

                                            <tr className="border-b border-gray-300">
                                                <td className="p-3 w-10 text-center align-top">[ ]</td>
                                                <td className="p-3 font-medium align-top">Fully funded for transport</td>
                                                <td className="p-3 align-top">Funding meets participant transport needs</td>
                                                <td className="p-3 align-top">
                                                    Participant only uses KM funded for $. This figure should be based on _____ cents per kilometre and does not include GST.
                                                </td>
                                            </tr>

                                            <tr className="border-b border-gray-300">
                                                <td className="p-3 w-10 text-center align-top">[ ]</td>
                                                <td className="p-3 font-medium align-top">Partially funded for transport – converts support hours</td>
                                                <td className="p-3 align-top">
                                                    Indicate core support $ to be converted. Funding does not meet transport needs. Participant converts support hours to pay for KM.
                                                </td>
                                                <td className="p-3 align-top">
                                                    Conversion of core support funding into transport must not negatively impact goals and outcomes.
                                                    Conversion of supports can only occur where participant has transport within their plan,
                                                    and Core Daily Activity & Transport are managed by Best of Homecare.
                                                </td>
                                            </tr>

                                            <tr className="border-b border-gray-300">
                                                <td className="p-3 w-10 text-center align-top">[ ]</td>
                                                <td className="p-3 font-medium align-top">Partially funded for transport – converts support hours</td>
                                                <td className="p-3 align-top">Indicate core support $ to be converted</td>
                                                <td className="p-3 align-top">
                                                    *Funding does not meet transport needs. Participant converts support hours to pay for KM.<br />
                                                    *Conversion must not negatively impact goals and outcomes.<br />
                                                    *Supports can only be converted where the participant has transport within their plan and both Core Daily Activity & Transport are managed by Best of Homecare.
                                                </td>
                                            </tr>

                                            <tr className="border-b border-gray-300">
                                                <td className="p-3 w-10 text-center align-top">[ ]</td>
                                                <td className="p-3 font-medium align-top">Not funded for transport within NDIS plan</td>
                                                <td className="p-3 align-top">Participant is not funded for transport</td>
                                                <td className="p-3 align-top">
                                                    Participant uses public transport or will be invoiced for KM at the rate of _____ cents per KM + GST
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="p-3 w-10 text-center align-top">[ ]</td>
                                                <td className="p-3 font-medium align-top">No transport costs</td>
                                                <td className="p-3 align-top">
                                                    Participant has not authorised Best of Homecare to charge for transport
                                                </td>
                                                <td className="p-3 align-top">
                                                    Participant uses public transport or does not require transport. If transport is required,
                                                    costs will be negotiated in advance.
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>

                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mt-6 mb-6">
                                        <strong>Note:</strong><br />
                                        Amounts will be listed in the funded and unfunded schedules.<br />
                                        Additional transport costs will be invoiced at _____ cents per KM directly to the participant or family monthly. GST will be added where transport costs exceed the amount approved in the funding plan or where there is no transport funding in the plan.<br />
                                        Transport may include the use of a staff member vehicle, Best of Homecare vehicle or via public transport.<br />
                                        Participant or family to cover any out-of-pocket public transport costs, if required.<br />
                                        Where a staff member travels from one participant appointment to another (providing personal care and community access), up to 20 minutes of time can be claimed against the next appointment at the hourly rate for the relevant support item. This will be discussed with you, if it is relevant to the services that you receive from Best of Homecare.
                                    </div>
                                </div>
                            )}
                            {key === "UnfundedSupports" && (
                                <>
                                    <div className="section mt-8">
                                        <div className="flex items-center mb-4">
                                            <input
                                                type="checkbox"
                                                id="sil_section_flag"
                                                name="sil_section_flag"
                                                checked={!!formData.sil_section_flag}
                                                disabled={true}
                                                className="mr-2 h-4 w-4"
                                            />
                                            <label htmlFor="sil_section_flag" className="font-medium text-gray-700">
                                                Include Supported Independent Living Accommodation (SIL/SDA)
                                            </label>
                                        </div>
                                    </div>
                                    {!!formData.sil_section_flag && (
                                        <div className="section mt-8">
                                            <div className="font-semibold text-lg mb-4">Supported Independent Living Accommodation - Fortnightly Participants Contribution (SIL/SDA Only)</div>
                                            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                                                <thead className="bg-gray-50 border-b border-gray-300">
                                                    <tr>
                                                        <th className="p-3 text-left font-semibold" style={{ width: '70%' }}>Description</th>
                                                        <th className="p-3 text-left font-semibold" style={{ width: '30%' }}>Amount (Per Fortnight)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-b border-gray-300">
                                                        <td className="p-3">Rent Charges (Rental cost and Commonwealth rent assistance)</td>
                                                        <td className="p-3">$390.20</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-300">
                                                        <td className="p-3">
                                                            33% of the total cost of utilities such as electricity, gas, water, and internet
                                                            <br />
                                                            <small className="text-gray-500">(Above rates are based on the total cost of utilities for a Year)</small>
                                                        </td>
                                                        <td className="p-3">$204.80</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-300">
                                                        <td className="p-3">
                                                            Food/Groceries
                                                            <br />
                                                            <small className="text-gray-500">(Based on the total cost of the food purchase currently in our SIL accommodation per person)</small>
                                                        </td>
                                                        <td className="p-3">$200.00</td>
                                                    </tr>
                                                    <tr className="bg-gray-50">
                                                        <td className="p-3"><strong>Total Cost</strong></td>
                                                        <td className="p-3"><strong>$795.00 / Fortnight</strong></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            )}
                        </React.Fragment>
                    ))}

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
