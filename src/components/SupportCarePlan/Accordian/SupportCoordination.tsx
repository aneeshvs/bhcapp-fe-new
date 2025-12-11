'use client';
import React, { useState } from 'react';
import { destroy } from '@/src/services/crud';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import {SilGoal} from "@/src/components/SupportCarePlan/types";

interface PreviousSilGoalsProps {
  supportGoals?: SilGoal[];
  setSupportGoals?: React.Dispatch<React.SetStateAction<SilGoal[]>>;
  uuid?: string | null;
}

export default function SupportCoordinationGoals({ supportGoals = [], setSupportGoals, uuid }: PreviousSilGoalsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Track newly added goals that haven't been submitted
  const [unsavedGoalIndexes, setUnsavedGoalIndexes] = useState<Set<number>>(new Set());

  const handleFieldChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!setSupportGoals) return;
    const { name, value } = e.target;
    const updatedSil = [...supportGoals];
    updatedSil[index][name as keyof SilGoal] = value;
    setSupportGoals(updatedSil);
  };

  const addSilGoals = () => {
    if (!setSupportGoals) return;
    
    const newIndex = supportGoals.length;
    setSupportGoals([
      ...supportGoals,
      {
        category: 'support_coordination',
        goal_key: '', // Empty goal_key for new unsaved goals
        goal_title: '',
        goals_of_support: '',
        steps: '',
        organisation_steps: '',
        risk: '',
        risk_management_strategies: '',
      },
    ]);
    
    // Track the index of the newly added goal
    setUnsavedGoalIndexes(prev => new Set([...prev, newIndex]));
  };

  const removeSilGoals = async (index: number) => {
    if (!setSupportGoals) return;
    const goal = supportGoals[index];

    // Check if this goal has a goal_key (submitted to backend) or is unsaved
    const hasGoalKey = !!goal.goal_key;
    // const isUnsavedGoal = unsavedGoalIndexes.has(index);

    // Only call API for goals that have goal_key (exist in backend)
    if (hasGoalKey && uuid) {
      try {
        await destroy('supportcareplan/remove-section', {
          uuid: uuid,
          table: 'sil_goals',
          field: 'goal_key', // Use goal_key instead of goal_title
          value: goal.goal_key,
        });
      } catch (error) {
        console.error('Failed to remove goal from backend:', error);
        // Even if API call fails, remove from local state
        // You might want to show an error message to the user
      }
    }

    // Remove from local state regardless of API call success
    const updatedSil = [...supportGoals];
    updatedSil.splice(index, 1);
    setSupportGoals(updatedSil);

    // Update the unsavedGoalIndexes to adjust indexes
    const updatedIndexes = new Set<number>();
    unsavedGoalIndexes.forEach(unsavedIndex => {
      if (unsavedIndex > index) {
        updatedIndexes.add(unsavedIndex - 1);
      } else if (unsavedIndex < index) {
        updatedIndexes.add(unsavedIndex);
      }
    });
    setUnsavedGoalIndexes(updatedIndexes);
  };

  const handleViewLogs = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 rounded shadow bg-white">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h2 className="text-lg font-semibold text-heading">SUPPORT COORDINATION GOALS</h2>
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
        {supportGoals.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No support coordination goals added yet.</p>
        ) : (
          supportGoals.map((goal, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 mb-6 p-4 rounded relative border border-gray-200"
            >
              {/* Goal Title */}
              <div>
                <label className="block mb-1 font-medium">Goal Title</label>
                <input
                  type="text"
                  name="goal_title"
                  value={goal.goal_title || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter goal title"
                />
              </div>

              {/* Goals of Support */}
              <div>
                <label className="block mb-1 font-medium">Goals of support What is the specific goal to be achieved through BHC supports?</label>
                <textarea
                  name="goals_of_support"
                  value={goal.goals_of_support || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                  placeholder="Enter goals of support"
                />
              </div>

              {/* Steps */}
              <div>
                <label className="block mb-1 font-medium">Steps What will the participant do to actively participate in meeting this goal?</label>
                <textarea
                  name="steps"
                  value={goal.steps || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                  placeholder="Enter steps"
                />
              </div>

              {/* Organisation Steps */}
              <div>
                <label className="block mb-1 font-medium">Organisation’s steps What support will we provide to meet this goal?</label>
                <textarea
                  name="organisation_steps"
                  value={goal.organisation_steps || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                  placeholder="Enter organisation steps"
                />
              </div>

              {/* Risk */}
              <div>
                <label className="block mb-1 font-medium">Risk</label>
                <textarea
                  name="risk"
                  value={goal.risk || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                  placeholder="Enter risks"
                />
              </div>

              {/* Risk Management Strategies */}
              <div>
                <label className="block mb-1 font-medium">Risk Management Strategies</label>
                <textarea
                  name="risk_management_strategies"
                  value={goal.risk_management_strategies || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                  placeholder="Enter risk management strategies"
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeSilGoals(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                title="Remove this goal"
              >
                ❌ Remove
              </button>
            </div>
          ))
        )}

        {/* Add Button */}
        <button
          type="button"
          onClick={addSilGoals}
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          ➕ Add Another Support Coordination Goal
        </button>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="sil_goals"
        field="all"
        url="support-care-plan/logs"
      />
    </div>
  );
}