"use client";
import React, { useState, useEffect } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface AssessmentOtherRisksFormData {
    // Other Known Risks
    other_known_risks?: number;
    other_risks_hazards?: string;
    other_risks_management_plan?: string;
    other_risks_bsp_plan?: number;
}

interface AssessmentOtherRisksProps {
    formData: AssessmentOtherRisksFormData;
    handleChange: (
        event:
            | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
            | { target: { name: string; value: string | number | boolean } }
    ) => void;
    uuid?: string;
}

export default function AssessmentOtherRisksForm({
    formData,
    handleChange,
    uuid,
}: AssessmentOtherRisksProps) {
    const effectiveUuid = uuid || undefined;
    const [hoveredField, setHoveredField] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedField, setSelectedField] = useState<string | null>(null);

    const clearRiskFields = (riskField: string, fieldsToClear: string[]) => {
        if (formData[riskField as keyof AssessmentOtherRisksFormData] === 0) {
            fieldsToClear.forEach(fieldName => {
                if (formData[fieldName as keyof AssessmentOtherRisksFormData]) {
                    handleChange({
                        target: {
                            name: fieldName,
                            value: ''
                        }
                    });
                }
            });
        }
    };

    // Other Known Risks Clearing Effect
    useEffect(() => {
        clearRiskFields('other_known_risks', [
            'other_risks_hazards',
            'other_risks_management_plan',
            'other_risks_bsp_plan'
        ]);
    }, [formData.other_known_risks, formData.other_risks_hazards, formData.other_risks_management_plan, formData.other_risks_bsp_plan, handleChange]);

    const handleViewLogs = (fieldName: string) => {
        setSelectedField(fieldName);
        setIsModalOpen(true);
    };

    const handleRadioNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleChange({
            target: {
                name,
                value: Number(value),
            },
        });
    };

    const yesNoOptions = [
        { label: "Yes", value: 1 },
        { label: "No", value: 0 },
    ];

    const renderRiskSection = (
        riskField: string,
        label: string,
        hazardsField: string,
        managementPlanField: string,
        bspPlanField: string
    ) => (
        <div className="border-b border-gray-200 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Risk Type */}
                <div
                    className="relative"
                    onMouseEnter={() => setHoveredField(riskField)}
                    onMouseLeave={() => setHoveredField(null)}
                >
                    <div className="flex justify-between items-center mb-1">
                        <label className="block font-medium">{label}</label>
                        {hoveredField === riskField && (
                            <button
                                type="button"
                                onClick={() => handleViewLogs(riskField)}
                                className="text-xs btn-primary text-white px-2 py-1 rounded"
                            >
                                View Logs
                            </button>
                        )}
                    </div>
                    <div className="flex gap-4">
                        {yesNoOptions.map(({ label, value }) => (
                            <label key={label} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={riskField}
                                    value={value}
                                    checked={formData[riskField as keyof AssessmentOtherRisksFormData] === value}
                                    onChange={handleRadioNumberChange}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* BSP Plan - Only show if Yes (1) */}
                {formData[riskField as keyof AssessmentOtherRisksFormData] === 1 && (
                    <div
                        className="relative"
                        onMouseEnter={() => setHoveredField(bspPlanField)}
                        onMouseLeave={() => setHoveredField(null)}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <label className="block font-medium">BSP Plan Required</label>
                            {hoveredField === bspPlanField && (
                                <button
                                    type="button"
                                    onClick={() => handleViewLogs(bspPlanField)}
                                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                                >
                                    View Logs
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4">
                            {yesNoOptions.map(({ label, value }) => (
                                <label key={label} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={bspPlanField}
                                        value={value}
                                        checked={formData[bspPlanField as keyof AssessmentOtherRisksFormData] === value}
                                        onChange={handleRadioNumberChange}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Show hazards and management plan only if risk is Yes (1) */}
            {formData[riskField as keyof AssessmentOtherRisksFormData] === 1 && (
                <div className="grid grid-cols-1 gap-4 mt-4 pl-4 border-l-2 border-red-200">
                    {/* Hazards */}
                    <div
                        className="relative"
                        onMouseEnter={() => setHoveredField(hazardsField)}
                        onMouseLeave={() => setHoveredField(null)}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <label className="block font-medium">Hazards identified</label>
                            {hoveredField === hazardsField && (
                                <button
                                    type="button"
                                    onClick={() => handleViewLogs(hazardsField)}
                                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                                >
                                    View Logs
                                </button>
                            )}
                        </div>
                        <textarea
                            name={hazardsField}
                            placeholder={"Describe hazards"}
                            value={formData[hazardsField as keyof AssessmentOtherRisksFormData] || ""}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    {/* Management Plan */}
                    <div
                        className="relative"
                        onMouseEnter={() => setHoveredField(managementPlanField)}
                        onMouseLeave={() => setHoveredField(null)}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <label className="block font-medium">Management Plan</label>
                            {hoveredField === managementPlanField && (
                                <button
                                    type="button"
                                    onClick={() => handleViewLogs(managementPlanField)}
                                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                                >
                                    View Logs
                                </button>
                            )}
                        </div>
                        <textarea
                            name={managementPlanField}
                            placeholder={"Describe management plan"}
                            value={formData[managementPlanField as keyof AssessmentOtherRisksFormData] || ""}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="mb-4 border border-gray-300 rounded shadow">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
                <h4 className="text-lg font-semibold mb-4 text-heading">
                    ASSESSMENT OTHER RISKS
                </h4>
            </div>

            <div className="p-4 bg-white">
                <div className="grid grid-cols-1 gap-6">
                    {/* Other Known Risks */}
                    {renderRiskSection(
                        "other_known_risks",
                        "Other Known Risks",
                        "other_risks_hazards",
                        "other_risks_management_plan",
                        "other_risks_bsp_plan"
                    )}
                </div>
            </div>

            <FieldLogsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                uuid={effectiveUuid ?? ""}
                table="individual_risk_assessment_violence_risk" // Reuse existing table
                field={selectedField}
                url="risk-assessment/logs"
            />
        </div>
    );
}
