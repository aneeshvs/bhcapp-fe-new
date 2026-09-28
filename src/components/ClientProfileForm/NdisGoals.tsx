'use client';
import React, { useState } from 'react';
import { destroy } from '@/src/services/crud';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import AiFieldPromptButton from '@/src/components/AiFieldPromptButton';

export interface NdisGoals {
  goal_description: string;
  goal_key: string;
}

interface PreviousNdisGoalsProps {
  ndisGoals: NdisGoals[];
  setNdisGoals: React.Dispatch<React.SetStateAction<NdisGoals[]>>;
  uuid?: string | null;
}

export default function NdisGoals({ ndisGoals, setNdisGoals, uuid }: PreviousNdisGoalsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Track newly added goals that haven't been submitted
  const [unsavedGoalIndexes, setUnsavedGoalIndexes] = useState<Set<number>>(new Set());

  const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updateNdis = [...ndisGoals];
    updateNdis[index][name as keyof NdisGoals] = value;
    setNdisGoals(updateNdis);
  };

  const handleAiUpdate = (index: number, field: keyof NdisGoals, val: string) => {
    const updateNdis = [...ndisGoals];
    updateNdis[index][field] = val;
    setNdisGoals(updateNdis);
  };

  const addNdisGoals = () => {
    const newIndex = ndisGoals.length;
    setNdisGoals([
      ...ndisGoals,
      { 
        goal_description: '',
        goal_key: '' // Empty goal_key for new unsaved goals
      }
    ]);
    // Track the newly added goal index
    setUnsavedGoalIndexes(prev => new Set([...prev, newIndex]));
  };

  const removeNdisGoals = async (index: number) => {
    const goal = ndisGoals[index];
    
    // Check if this goal has a goal_key (submitted to backend)
    const hasGoalKey = !!goal.goal_key;
    // const isUnsavedGoal = unsavedGoalIndexes.has(index);

    // Only call API for goals that have goal_key (exist in backend)
    if (hasGoalKey && uuid) {
      try {
        await destroy('form/section/remove', {
          uuid: uuid,
          table: 'ndis_goals',
          field: 'goal_key', // Use goal_key instead of goal_description
          value: goal.goal_key,
        });
      } catch (error) {
        console.error('Failed to remove goal from backend:', error);
        // Even if API call fails, remove from local state
        // You might want to show an error message to the user
      }
    }

    // Remove from local state regardless of API call success
    const updateNdis = [...ndisGoals];
    updateNdis.splice(index, 1);
    setNdisGoals(updateNdis);
    
    // Update the unsavedGoalIndexes to remove the deleted index and adjust other indexes
    const updatedIndexes = new Set<number>();
    unsavedGoalIndexes.forEach(unsavedIndex => {
      if (unsavedIndex > index) {
        updatedIndexes.add(unsavedIndex - 1);
      } else if (unsavedIndex < index) {
        updatedIndexes.add(unsavedIndex);
      }
      // Skip the current index being removed
    });
    setUnsavedGoalIndexes(updatedIndexes);
  };

  const handleViewLogs = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 rounded shadow bg-white">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h2 className="text-lg font-semibold text-heading">NDIS GOALS</h2>
        {uuid && (
          <button
            type="button"
            onClick={handleViewLogs}
            className="btn-primary text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            View Logs
          </button>
        )}
      </div>

      <div className="p-4">
        {ndisGoals.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No NDIS goals added yet.</p>
        ) : (
          ndisGoals.map((goal, index) => (
            <div key={index} className="grid grid-cols-1 gap-4 mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-700">Goal #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeNdisGoals(index)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 transition px-2 py-1 rounded hover:bg-red-50"
                  title="Remove this goal"
                >
                  ❌ Remove
                </button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-medium text-sm text-gray-800">
                    What are the NDIS Goals that you would like assistance from BHC with?
                  </label>
                  <AiFieldPromptButton
                    fieldLabel={`NDIS Goal #${index + 1}`}
                    currentValue={goal.goal_description || ''}
                    onUpdate={(val) => handleAiUpdate(index, 'goal_description', val)}
                  />
                </div>
                <textarea
                  name="goal_description"
                  value={goal.goal_description || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  placeholder="Enter goal description"
                  rows={3}
                />
              </div>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={addNdisGoals}
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          ➕ Add Another Goal
        </button>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="ndis_goals"
        field="all"
        url="logs/view" // Updated to match other components
      />
    </div>
  );
}