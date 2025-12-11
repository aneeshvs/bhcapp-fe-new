"use client";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { destroy } from '@/src/services/crud';
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface ManualHandlingItem {
  goal_key: string;
  training_provided?: number;
  training_hazards?: string;
  training_management_plan?: string;
  tasks_safe?: number;
  tasks_hazards?: string;
  tasks_management_plan?: string;
}

interface PlanManualHandlingsProps {
  manualHandlings?: ManualHandlingItem[];
  setManualHandlings?: React.Dispatch<React.SetStateAction<ManualHandlingItem[]>>;
  uuid?: string;
}

export default function PlanManualHandlingsForm({ 
  manualHandlings = [], 
  setManualHandlings, 
  uuid 
}: PlanManualHandlingsProps) {
  const searchParams = useSearchParams();
  const urlUuid = searchParams.get('uuid');
  const effectiveUuid = uuid || urlUuid || undefined;
  const [hoveredField, setHoveredField] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedField, setSelectedField] = React.useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const yesNoOptions = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  const addManualHandling = () => {
    if (!setManualHandlings) return;

    setManualHandlings([
      ...manualHandlings,
      {
        goal_key: '', // Empty goal_key for new unsaved items
        training_provided: 0,
        training_hazards: '',
        training_management_plan: '',
        tasks_safe: 0,
        tasks_hazards: '',
        tasks_management_plan: ''
      }
    ]);
  };

  const removeManualHandling = async (index: number) => {
    if (!setManualHandlings) return;

    const item = manualHandlings[index];

    // Check if this item has a goal_key (submitted to backend)
    const hasGoalKey = !!item.goal_key;

    // Only call API for items that have goal_key (exist in backend)
    if (hasGoalKey && effectiveUuid) {
      try {
        await destroy('risk-assessment/remove-section', {
          uuid: effectiveUuid,
          table: 'plan_manual_handlings',
          field: 'goal_key',
          value: item.goal_key,
        });
      } catch (error) {
        console.error('Failed to remove manual handling from backend:', error);
        // Even if API call fails, remove from local state
      }
    }

    // Remove from local state regardless of API call success
    const updated = [...manualHandlings];
    updated.splice(index, 1);
    setManualHandlings(updated);
  };

  const updateManualHandling = (index: number, field: keyof ManualHandlingItem, value: string | number) => {
    if (!setManualHandlings) return;
    const updated = [...manualHandlings];
    updated[index] = { ...updated[index], [field]: value };
    setManualHandlings(updated);
  };

  const handleRadioNumberChange = (index: number, field: keyof ManualHandlingItem, value: number) => {
    updateManualHandling(index, field, value);
  };

  const renderYesNoField = (
    index: number,
    fieldName: keyof ManualHandlingItem, 
    label: string, 
    hazardsField?: keyof ManualHandlingItem, 
    managementPlanField?: keyof ManualHandlingItem
  ) => (
    <>
      <div
        className="relative"
        onMouseEnter={() => setHoveredField(`${fieldName}_${index}`)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <div className="flex justify-between items-center mb-1">
          <label className="block font-medium">{label}</label>
          {hoveredField === `${fieldName}_${index}` && (
            <button
              type="button"
              onClick={() => handleViewLogs(fieldName as string)}
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
                name={`${fieldName}_${index}`}
                value={value}
                checked={manualHandlings[index][fieldName] === value}
                onChange={() => handleRadioNumberChange(index, fieldName, value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Show hazards and management plan only if Yes is selected */}
      {manualHandlings[index][fieldName] === 1 && hazardsField && managementPlanField && (
        <>
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField(`${hazardsField}_${index}`)}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Hazards identified</label>
              {hoveredField === `${hazardsField}_${index}` && (
                <button
                  type="button"
                  onClick={() => handleViewLogs(hazardsField as string)}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              value={manualHandlings[index][hazardsField] || ""}
              onChange={(e) => updateManualHandling(index, hazardsField, e.target.value)}
              placeholder={"Describe hazards"}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField(`${managementPlanField}_${index}`)}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Management Plan</label>
              {hoveredField === `${managementPlanField}_${index}` && (
                <button
                  type="button"
                  onClick={() => handleViewLogs(managementPlanField as string)}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              value={manualHandlings[index][managementPlanField] || ""}
              onChange={(e) => updateManualHandling(index, managementPlanField, e.target.value)}
              placeholder={"Describe management plan"}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          PLAN MANUAL HANDLINGS
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="space-y-6">
          {manualHandlings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No manual handling items added yet.</p>
          ) : (
            manualHandlings.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4 relative">
                <div className="flex justify-between items-center border-b pb-2">
                  <h5 className="font-semibold text-lg text-gray-700">Manual Handling #{index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeManualHandling(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Training Section */}
                  <div className="md:col-span-2">
                    {renderYesNoField(
                      index,
                      "training_provided", 
                      "Has training been provided to support staff for specific client handling techniques?", 
                      "training_hazards", 
                      "training_management_plan"
                    )}
                  </div>

                  {/* Tasks Section */}
                  <div className="md:col-span-2">
                    {renderYesNoField(
                      index,
                      "tasks_safe", 
                      "Can all manual handling tasks be undertaken safely with current staff and equipment?", 
                      "tasks_hazards", 
                      "tasks_management_plan"
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={addManualHandling}
            className="btn-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
          >
            Add Manual Handling Item
          </button>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="plan_manual_handlings"
        field={selectedField}
        url="risk-assessment/logs"
      />
    </div>
  );
}