"use client";
import React, { useState, useEffect } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface AssessmentFinancialRisksFormData {
    // Finance Management
    finance_management?: string;
    finance_hazards?: string;
    finance_management_plan?: string;
    finance_bsp_plan?: number;
    finance_management_notes?: string;
}

interface AssessmentFinancialRisksProps {
    formData: AssessmentFinancialRisksFormData;
    handleChange: (
        event:
            | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
            | { target: { name: string; value: string | number | boolean } }
    ) => void;
    uuid?: string;
}

export default function AssessmentFinancialRisksForm({
    formData,
    handleChange,
    uuid,
}: AssessmentFinancialRisksProps) {
    const effectiveUuid = uuid || undefined;
    const [hoveredField, setHoveredField] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedField, setSelectedField] = useState<string | null>(null);

    const clearRiskFields = (riskField: string, fieldsToClear: string[]) => {
        // Logic for clearing if N/A or No is selected can vary, but based on original code
        // it seemed to clear if value was 0 (for number) or generally if "disabled".
        // For string enum 'Yes'/'No'/'N/A', we probably want to clear if NOT 'Yes'
        // BUT the original code only showed the `useEffect` clearing for `finance_management`.

        // Original logic:
        // useEffect(() => {
        //   clearRiskFields('finance_management', [
        //     'finance_hazards',
        //     'finance_management_plan',
        //     'finance_bsp_plan'
        //   ]);
        // }, ...);

        // And clearRiskFields definition:
        // const clearRiskFields = (riskField: string, fieldsToClear: string[]) => {
        //   if (formData[riskField] === 0) { ... }
        // }

        // Wait, `finance_management` is a string (Yes/No/N/A) in the interface, but the `clearRiskFields` function 
        // in `AssessmentViolenceRisks.tsx` checked `=== 0`. This implies it might not have been working correctly 
        // for string fields if it strictly checked for number 0. 
        // However, let's look at `renderEnumRiskSection`: it sets values 'Yes', 'No', 'N/A'.
        // `clearRiskFields` in the original file:
        // if (formData[riskField as keyof ...] === 0)
        // This looks like a bug in the original file for string fields? Or maybe I misread.
        // Let's implement robust clearing logic here.

        // If the main toggle is NOT 'Yes', we should probably clear the 'Yes'-dependent fields.
        if (formData[riskField as keyof AssessmentFinancialRisksFormData] !== 'Yes') {
            fieldsToClear.forEach(fieldName => {
                if (formData[fieldName as keyof AssessmentFinancialRisksFormData]) {
                    handleChange({
                        target: {
                            name: fieldName,
                            value: '' // or 0 if it's a number? `finance_bsp_plan` is number.
                        }
                    });
                }
            });
        }
    };

    // Finance Management Clearing Effect
    useEffect(() => {
        // We need to handle the mixed types (string for text, number for bsp_plan)
        // If finance_management is not 'Yes', clear hazards, plan, bsp.
        const riskField = 'finance_management';
        const currentValue = formData[riskField];

        if (currentValue !== 'Yes' && currentValue !== undefined) {
            // Clear fields
            const fields = ['finance_hazards', 'finance_management_plan', 'finance_bsp_plan'];
            fields.forEach(f => {
                // Check if it has a value before clearing to avoid infinite loops if handleChange triggers this
                if (formData[f as keyof AssessmentFinancialRisksFormData]) {
                    // Determine empty value based on type
                    const emptyVal = f.includes('bsp_plan') ? 0 : '';
                    // Note: The original code sent '' for everything in clearRiskFields, 
                    // even for bsp_plan which is number? 
                    // "value: ''"
                    // And `handleRadioNumberChange` casts to Number. 
                    // If we send '', Number('') is 0. So that works.

                    handleChange({
                        target: {
                            name: f,
                            value: ''
                        }
                    });
                }
            });
        }
    }, [formData.finance_management, formData.finance_hazards, formData.finance_management_plan, formData.finance_bsp_plan, handleChange]);

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

    const handleRadioStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleChange({
            target: {
                name,
                value,
            },
        });
    };

    const yesNoOptions = [
        { label: "Yes", value: 1 },
        { label: "No", value: 0 },
    ];

    const renderEnumRiskSection = (
        riskField: string,
        label: string,
        hazardsField: string,
        managementPlanField: string,
        bspPlanField: string,
        notesField: string
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
                        {['Yes', 'No', 'N/A'].map((option) => (
                            <label key={option} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={riskField}
                                    value={option}
                                    checked={formData[riskField as keyof AssessmentFinancialRisksFormData] === option}
                                    onChange={handleRadioStringChange}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                {/* BSP Plan - Only show if Yes */}
                {formData[riskField as keyof AssessmentFinancialRisksFormData] === 'Yes' && (
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
                                        checked={formData[bspPlanField as keyof AssessmentFinancialRisksFormData] === value}
                                        onChange={handleRadioNumberChange}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Show hazards and management plan only if risk is Yes */}
            {formData[riskField as keyof AssessmentFinancialRisksFormData] === 'Yes' && (
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
                            value={formData[hazardsField as keyof AssessmentFinancialRisksFormData] || ""}
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
                            value={formData[managementPlanField as keyof AssessmentFinancialRisksFormData] || ""}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                </div>
            )}

            {/* Show Notes if N/A */}
            {formData[riskField as keyof AssessmentFinancialRisksFormData] === 'N/A' && (
                <div className="mt-4">
                    <div
                        className="relative"
                        onMouseEnter={() => setHoveredField(notesField)}
                        onMouseLeave={() => setHoveredField(null)}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <label className="block font-medium">Notes</label>
                            {hoveredField === notesField && (
                                <button
                                    type="button"
                                    onClick={() => handleViewLogs(notesField)}
                                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                                >
                                    View Logs
                                </button>
                            )}
                        </div>
                        <textarea
                            name={notesField}
                            placeholder="Notes..."
                            value={formData[notesField as keyof AssessmentFinancialRisksFormData] || ""}
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
                    ASSESSMENT FINANCIAL RISKS
                </h4>
            </div>

            <div className="p-4 bg-white">
                <div className="grid grid-cols-1 gap-6">
                    {/* Finance Management */}
                    {renderEnumRiskSection(
                        "finance_management",
                        "Does the participant need help to manage their finances?",
                        "finance_hazards",
                        "finance_management_plan",
                        "finance_bsp_plan",
                        "finance_management_notes"
                    )}
                </div>
            </div>

            <FieldLogsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                uuid={effectiveUuid ?? ""}
                table="individual_risk_assessment_violence_risk" // Keeping same table name as requested "no database changes"
                field={selectedField}
                url="risk-assessment/logs"
            />
        </div>
    );
}
