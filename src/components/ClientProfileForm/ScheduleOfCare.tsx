'use client';
import React, { useState } from 'react';
import { destroy } from '@/src/services/crud';
import FieldLogsModal from '@/src/components/FieldLogsModal';

export interface CareEntry {
  type_of_service: string;
  primary_task_list: string;
  secondary_task_list: string;
  goal_key: string; // Add goal_key to track submitted entries
}

interface ScheduleOfCareProps {
  careEntries: CareEntry[];
  setCareEntries: React.Dispatch<React.SetStateAction<CareEntry[]>>;
  uuid?: string | null;
}

export default function ScheduleOfCare({
  careEntries,
  setCareEntries,
  uuid
}: ScheduleOfCareProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Track newly added entries that haven't been submitted
  const [unsavedEntryIndexes, setUnsavedEntryIndexes] = useState<Set<number>>(new Set());

  const handleFieldChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedEntries = [...careEntries];
    updatedEntries[index][name as keyof CareEntry] = value;
    setCareEntries(updatedEntries);
  };

  const addCareEntry = () => {
    const newIndex = careEntries.length;
    setCareEntries([
      ...careEntries,
      { 
        type_of_service: '', 
        primary_task_list: '', 
        secondary_task_list: '',
        goal_key: '', // Empty goal_key for new unsaved entries
      },
    ]);
    // Track the newly added entry index
    setUnsavedEntryIndexes(prev => new Set([...prev, newIndex]));
  };

  const removeCareEntry = async (index: number) => {
    const entry = careEntries[index];
    
    // Check if this entry has a goal_key (submitted to backend)
    const hasGoalKey = !!entry.goal_key;
    // const isUnsavedEntry = unsavedEntryIndexes.has(index);

    // Only call API for entries that have goal_key (exist in backend)
    if (hasGoalKey && uuid) {
      try {
        await destroy('form/section/remove', {
          uuid: uuid,
          table: 'schedule_of_care',
          field: 'goal_key', // Use goal_key instead of type_of_service
          value: entry.goal_key,
        });
      } catch (error) {
        console.error('Failed to remove care entry from backend:', error);
        // Even if API call fails, remove from local state
        // You might want to show an error message to the user
      }
    }

    // Remove from local state regardless of API call success
    const updatedEntries = [...careEntries];
    updatedEntries.splice(index, 1);
    setCareEntries(updatedEntries);
    
    // Update the unsavedEntryIndexes to remove the deleted index and adjust other indexes
    const updatedIndexes = new Set<number>();
    unsavedEntryIndexes.forEach(unsavedIndex => {
      if (unsavedIndex > index) {
        updatedIndexes.add(unsavedIndex - 1);
      } else if (unsavedIndex < index) {
        updatedIndexes.add(unsavedIndex);
      }
      // Skip the current index being removed
    });
    setUnsavedEntryIndexes(updatedIndexes);
  };

  const handleViewLogs = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 rounded shadow bg-white">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h2 className="text-lg font-semibold text-heading">SCHEDULE OF CARE</h2>
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
        {careEntries.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No care entries added yet.</p>
        ) : (
          careEntries.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 rounded relative border border-gray-200"
            >
              <div className="mb-3">
                <label className="block mb-1 font-medium">Type of Service</label>
                <input
                  type="text"
                  name="type_of_service"
                  value={entry.type_of_service || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter type of service"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-medium">Primary Task List</label>
                <input
                  type="text"
                  name="primary_task_list"
                  value={entry.primary_task_list || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter primary tasks"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-medium">Secondary Task List</label>
                <input
                  type="text"
                  name="secondary_task_list"
                  value={entry.secondary_task_list || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter secondary tasks"
                />
              </div>

              <button
                type="button"
                onClick={() => removeCareEntry(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                title="Remove this entry"
              >
                ❌ Remove
              </button>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={addCareEntry}
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          ➕ Add Another Entry
        </button>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="schedule_of_care"
        field="all"
        url="logs/view" // Updated to match other components
      />
    </div>
  );
}