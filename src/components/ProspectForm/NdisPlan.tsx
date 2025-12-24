'use client';

import React from "react";
import { destroy } from '@/src/services/crud'

export interface NdisGoals {
  goal: string;
  barriers: string;
  uuid?: string;
  goal_key: string;
}

export interface NdisPlanProps {
  ndisPlans: NdisGoals[];
  setNdisPlans: React.Dispatch<React.SetStateAction<NdisGoals[]>>;
}

export default function NdisPlan({ ndisPlans, setNdisPlans }: NdisPlanProps) {
  const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedPlans = [...ndisPlans];
    updatedPlans[index][name as keyof NdisGoals] = value;
    setNdisPlans(updatedPlans);
  };

  const addGoal = () => {
    setNdisPlans([...ndisPlans, { goal: '', barriers: '', goal_key: '' }]);
  };

  const uuidUrl = new URL(window.location.href);
  const uuid = uuidUrl.pathname.split('/').pop();

  const removeGoal = async (index: number) => {
    const goalToRemove = ndisPlans[index];
    const hasGoalKey = !!goalToRemove.goal_key;
    // Only call API if the goal has a UUID (meaning it's saved in backend)
    // AND we have a form UUID
    if (hasGoalKey && uuid) {
      try {
        await destroy('full-form/remove-item', {
          uuid: uuid,
          table: 'ndis_goals',
          field: 'uuid', // Use UUID as the identifier
          value: goalToRemove.uuid,
        });
      } catch (error) {
        console.error('Failed to remove goal from server:', error);
        // You might want to show an error message to the user here
      }
    }

    // Always remove from local state
    const updatedPlans = [...ndisPlans];
    updatedPlans.splice(index, 1);
    setNdisPlans(updatedPlans);
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-4 text-heading">NDIS Plan – Current Goals</h2>

      {ndisPlans.map((plan, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 rounded relative">
          <div className="mb-3">
            <label className="font-semibold block">Goal {index + 1}</label>
            <input
              type="text"
              name="goal"
              value={plan.goal}
              onChange={(e) => handleFieldChange(index, e)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter goal"
            />
          </div>

          <div className="mb-3 md:col-span-2">
            <label className="font-semibold block">Barriers & Solutions</label>
            <textarea
              name="barriers"
              value={plan.barriers}
              onChange={(e) => handleFieldChange(index, e)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
              placeholder="Enter barriers and solutions"
            />
          </div>

          {/* Remove button */}
          {ndisPlans.length > 0 && (
            <button
              type="button"
              onClick={() => removeGoal(index)}
              className="absolute top-2 right-2 text-red-500 text-sm"
            >
              ❌ Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addGoal}
        className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition"
      >
        ➕ Add Another Goal
      </button>
    </div>
  );
}