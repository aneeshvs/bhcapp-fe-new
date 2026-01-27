"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { verifyFormOtp, show, update, VerifyOtpResponse } from "@/src/services/crud";
import clientProfileFormData from "@/src/components/ClientProfileForm/ClientProfileFormData";
import { ClientApiResponse } from "@/src/components/ClientProfileForm/ApiResponse";
import { mapApiResponseToFormData } from "@/src/components/ClientProfileForm/MapApiResponseToFormData";
import Image from "next/image";

// Components
import IntialEnquiry from '@/src/components/ClientProfileForm/IntialEnquiry';
import Funding from '@/src/components/ClientProfileForm/Funding';
import Emergency from '@/src/components/ClientProfileForm/Emergency';
import ScheduleOfCare from '@/src/components/ClientProfileForm/ScheduleOfCare';
import ReligiousCulturalBackground from '@/src/components/ClientProfileForm/Culture';
import NdisGoals from '@/src/components/ClientProfileForm/NdisGoals';
import HealthProffessional from '@/src/components/ClientProfileForm/HealthProffessional';
import DiagnosisSummary from '@/src/components/ClientProfileForm/DiagnosisSummary';
import HealthInformation from '@/src/components/ClientProfileForm/HealthInformation';
import HealthcareSupport from '@/src/components/ClientProfileForm/HealthCareSupport';
import Behaviour from '@/src/components/ClientProfileForm/BehaviorSupport';
import MedicalAlerts from '@/src/components/ClientProfileForm/MedicalAlerts';
import HealthSummaries from '@/src/components/ClientProfileForm/HealthSummaries';
import SupportInformation from '@/src/components/ClientProfileForm/SupportInformation';
import AccordionItem from "@/src/components/AccordionItem";

type ClientProfileFormDataType = typeof clientProfileFormData;



export default function ShowClientProfilePage() {
    const { uuid } = useParams<{ uuid: string }>();
    const searchParams = useSearchParams();
    const sessionUserId = searchParams.get("userid") || "";
    const sessionClientType = searchParams.get("client_type") || "";
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [clientName, setClientName] = useState("");

    const [formData, setFormData] = useState<ClientProfileFormDataType>(clientProfileFormData);

    // Additional state for array/object fields not in base formData structure but used by components
    const [careEntries, setCareEntries] = useState<any[]>([]);
    const [ndisGoals, setNdisGoals] = useState<any[]>([]);
    const [healthProffessional, setHealthProffessional] = useState<any[]>([]);
    const [healthInformationState, setHealthInformationState] = useState<any>({ health_conditions: [], health_other_description: '' });

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        clientDetails: true,
        funding: false,
        emergency: false,
        schedule: false,
        culture: false,
        goals: false,
        healthPro: false,
        diagnosis: false,
        healthInfo: false,
        healthcareSupport: false,
        behaviour: false,
        medicalAlerts: false,
        healthSummaries: false,
        supportInfo: false
    });

    const fetchFormData = useCallback(async () => {
        try {
            const response = await show<ClientApiResponse>(
                "form-data",
                uuid as string
            );

            if (!response?.data) return;

            setFormData(
                mapApiResponseToFormData(response.data)
            );

            // Populate complex state
            if (response.data.schedule_of_cares) {
                setCareEntries(response.data.schedule_of_cares);
            }
            if (response.data.ndis_goals) {
                setNdisGoals(response.data.ndis_goals.map(g => ({
                    goal_description: g.goal_description ?? '',
                    goal_key: g.goal_key ?? ''
                })));
            }
            if (response.data.health_professional_details) {
                setHealthProffessional(response.data.health_professional_details);
            }
            if (response.data?.health_information) {
                setHealthInformationState({
                    health_conditions: Array.isArray(response.data.health_information.health_conditions)
                        ? response.data.health_information.health_conditions
                        : [response.data.health_information.health_conditions],
                    health_other_description: response.data.health_information.health_other_description || ''
                });
            }


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [uuid]);

    const handleChange = useCallback((e: any) => {
        // Read-only, but needed to prevent crashes types
    }, []);

    const toggleSection = (key: string) => {
        setOpenSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const validatePassword = async (password: string): Promise<VerifyOtpResponse | null> => {
        try {
            const response = await verifyFormOtp(uuid, password);

            if (response.success) {
                if (response.client_name) {
                    setClientName(response.client_name);
                }
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
        } else {
            setLoading(false);
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
            <div className="flex justify-center mb-6">
                <h1 className="text-center text-2xl md:text-3xl font-bold mt-2 text-gray-800">
                    Review: Client Profile (Onboarding)
                </h1>
            </div>

            <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto">

                {/* 1. Client Details */}
                <AccordionItem
                    title="Information About The Client"
                    isOpen={openSections.clientDetails}
                    onToggle={() => toggleSection("clientDetails")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <IntialEnquiry
                            formData={formData}
                            handleChange={handleChange}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 2. Funding */}
                <AccordionItem
                    title="Funding"
                    isOpen={openSections.funding}
                    onToggle={() => toggleSection("funding")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <Funding
                            formData={formData}
                            handleChange={handleChange}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 3. Emergency */}
                <AccordionItem
                    title="Emergency Contacts"
                    isOpen={openSections.emergency}
                    onToggle={() => toggleSection("emergency")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <Emergency
                            formData={formData}
                            handleChange={handleChange}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 4. Schedule */}
                <AccordionItem
                    title="Schedule Of Support"
                    isOpen={openSections.schedule}
                    onToggle={() => toggleSection("schedule")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <ScheduleOfCare
                            careEntries={careEntries}
                            setCareEntries={setCareEntries}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 5. Culture */}
                <AccordionItem
                    title="Religious & Cultural Background"
                    isOpen={openSections.culture}
                    onToggle={() => toggleSection("culture")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <ReligiousCulturalBackground
                            formData={formData}
                            handleChange={handleChange}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 6. Goals */}
                <AccordionItem
                    title="NDIS Goals"
                    isOpen={openSections.goals}
                    onToggle={() => toggleSection("goals")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <NdisGoals
                            ndisGoals={ndisGoals}
                            setNdisGoals={setNdisGoals}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 7. Health Professionals */}
                <AccordionItem
                    title="Health Professionals"
                    isOpen={openSections.healthPro}
                    onToggle={() => toggleSection("healthPro")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <HealthProffessional
                            healthProffessional={healthProffessional}
                            setHealthProffessional={setHealthProffessional}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 8. Diagnosis */}
                <AccordionItem
                    title="Diagnosis Summary"
                    isOpen={openSections.diagnosis}
                    onToggle={() => toggleSection("diagnosis")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <DiagnosisSummary
                            formData={formData}
                            handleChange={handleChange}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 9. Health Information */}
                <AccordionItem
                    title="Health Information"
                    isOpen={openSections.healthInfo}
                    onToggle={() => toggleSection("healthInfo")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <HealthInformation
                            healthInformation={healthInformationState}
                            setHealthInformation={setHealthInformationState}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 10. Healthcare Support */}
                <AccordionItem
                    title="Healthcare Support Details"
                    isOpen={openSections.healthcareSupport}
                    onToggle={() => toggleSection("healthcareSupport")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <HealthcareSupport
                            formData={formData}
                            handleChange={handleChange}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 11. Behaviour */}
                <AccordionItem
                    title="Behaviour Support"
                    isOpen={openSections.behaviour}
                    onToggle={() => toggleSection("behaviour")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <Behaviour
                            formData={formData}
                            handleChange={handleChange}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 12. Medical Alerts */}
                <AccordionItem
                    title="Medical Alerts"
                    isOpen={openSections.medicalAlerts}
                    onToggle={() => toggleSection("medicalAlerts")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <MedicalAlerts
                            formData={formData}
                            handleChange={handleChange}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 13. Health Summaries */}
                <AccordionItem
                    title="Preventive Health Summaries"
                    isOpen={openSections.healthSummaries}
                    onToggle={() => toggleSection("healthSummaries")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <HealthSummaries
                            formData={formData}
                            handleChange={handleChange}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                {/* 14. Support Info */}
                <AccordionItem
                    title="Support Information"
                    isOpen={openSections.supportInfo}
                    onToggle={() => toggleSection("supportInfo")}
                >
                    <fieldset disabled className="pointer-events-none opacity-75">
                        <SupportInformation
                            formData={formData}
                            handleChange={handleChange}
                            uuid={uuid}
                        />
                    </fieldset>
                </AccordionItem>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 italic"></p>
                </div>
            </div>
        </div>
    );
}
