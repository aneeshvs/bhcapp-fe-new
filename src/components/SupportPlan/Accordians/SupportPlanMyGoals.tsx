'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { destroy } from '@/src/services/crud';

interface SupportPlanMyGoal {
  goal: string;
  measure_progress: string;
  success_look_like: string;
  who_will_support: string;
  participant_support: string;
  target_date: string;
  goal_key?: string; // Add goal_key to track submitted goals
}

interface SupportPlanMyGoalsProps {
  myGoals?: SupportPlanMyGoal[];
  setMyGoals?: React.Dispatch<React.SetStateAction<SupportPlanMyGoal[]>>;
  uuid?: string;
}

export default function SupportPlanMyGoals({ myGoals = [], setMyGoals, uuid }: SupportPlanMyGoalsProps) {
  const searchParams = useSearchParams();
  const urlUuid = searchParams.get('uuid');
  const effectiveUuid = uuid || urlUuid || undefined;
  
  // Track newly added goals that haven't been submitted
  const [unsavedGoalIndexes, setUnsavedGoalIndexes] = useState<Set<number>>(new Set());

  const addGoal = () => {
    if (!setMyGoals) return;

    const newIndex = myGoals.length;
    setMyGoals([
      ...myGoals,
      {
        goal: '',
        measure_progress: '',
        success_look_like: '',
        who_will_support: '',
        participant_support: '',
        target_date: '',
        goal_key: '' // Empty goal_key for new unsaved goals
      }
    ]);
    
    // Track the index of the newly added goal
    setUnsavedGoalIndexes(prev => new Set([...prev, newIndex]));
  };

  const removeGoal = async (index: number) => {
    if (!setMyGoals) return;

    const goal = myGoals[index];

    // Check if this goal has a goal_key (submitted to backend)
    const hasGoalKey = !!goal.goal_key;
    // const isUnsavedGoal = unsavedGoalIndexes.has(index);

    // Only call API for goals that have goal_key (exist in backend)
    if (hasGoalKey && effectiveUuid) {
      try {
        await destroy('formsupport/section/remove', {
          uuid: effectiveUuid,
          table: 'support_plan_my_goal',
          field: 'goal_key', // Use goal_key instead of goal
          value: goal.goal_key,
        });
      } catch (error) {
        console.error('Failed to remove goal from backend:', error);
        // Even if API call fails, remove from local state
        // You might want to show an error message to the user
      }
    }

    // Remove from local state regardless of API call success
    const updated = [...myGoals];
    updated.splice(index, 1);
    setMyGoals(updated);
    
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

  const updateGoal = (index: number, field: keyof SupportPlanMyGoal, value: string) => {
    if (!setMyGoals) return;
    const updated = [...myGoals];
    updated[index] = { ...updated[index], [field]: value };
    setMyGoals(updated);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">My Goals</h3>

      {myGoals.length === 0 ? (
        <p className="text-gray-500">No goals added yet.</p>
      ) : (
        myGoals.map((goal, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-3 relative">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Goal #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeGoal(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                <textarea
                  value={goal.goal}
                  onChange={(e) => updateGoal(index, 'goal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Describe your goal"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How will we measure this goal’s progress
                </label>
                <textarea
                  value={goal.measure_progress}
                  onChange={(e) => updateGoal(index, 'measure_progress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="How will progress be measured?"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What will success look like for you?
                </label>
                <textarea
                  value={goal.success_look_like}
                  onChange={(e) => updateGoal(index, 'success_look_like', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Describe what success looks like"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Who will support you
                </label>
                <textarea
                  value={goal.who_will_support}
                  onChange={(e) => updateGoal(index, 'who_will_support', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="List people or services that will support this goal"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How participant will support the goal
                </label>
                <textarea
                  value={goal.participant_support}
                  onChange={(e) => updateGoal(index, 'participant_support', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Describe how the participant will be supported"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">When we aim to meet this goal</label>
                <textarea
                  value={goal.target_date}
                  onChange={(e) => updateGoal(index, 'target_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="When we aim to achieve this goal"
                />
              </div>
            </div>
          </div>
        ))
      )}

      <button
        type="button"
        onClick={addGoal}
        className="btn-primary btn-primary:hover text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Goal
      </button>
    </div>
  );
}