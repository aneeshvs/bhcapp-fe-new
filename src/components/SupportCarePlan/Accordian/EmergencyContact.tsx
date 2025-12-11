'use client';
import React, { useState } from 'react';
import { destroy } from '@/src/services/crud';
import FieldLogsModal from '@/src/components/FieldLogsModal';

interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
  location?: string;
  goal_key?: string;
}

interface EmergencyContactsProps {
  emergencyContacts?: EmergencyContact[];
  setEmergencyContacts?: React.Dispatch<React.SetStateAction<EmergencyContact[]>>;
  uuid?: string | null;
}

export default function EmergencyContactsForm({ 
  emergencyContacts = [], 
  setEmergencyContacts, 
  uuid 
}: EmergencyContactsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Track newly added contacts that haven't been submitted
  const [unsavedContactIndexes, setUnsavedContactIndexes] = useState<Set<number>>(new Set());

  const handleFieldChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!setEmergencyContacts) return;
    const { name, value } = e.target;
    const updatedContacts = [...emergencyContacts];
    updatedContacts[index][name as keyof EmergencyContact] = value;
    setEmergencyContacts(updatedContacts);
  };

  const addEmergencyContact = () => {
    if (!setEmergencyContacts) return;
    
    const newIndex = emergencyContacts.length;
    setEmergencyContacts([
      ...emergencyContacts,
      {
        name: '',
        relationship: '',
        phone: '',
        email: '',
        location: '',
        goal_key: '', // Empty goal_key for new unsaved contacts
      },
    ]);
    
    // Track the index of the newly added contact
    setUnsavedContactIndexes(prev => new Set([...prev, newIndex]));
  };

  const removeEmergencyContact = async (index: number) => {
    if (!setEmergencyContacts) return;
    const contact = emergencyContacts[index];

    // Check if this contact has a goal_key (submitted to backend) or is unsaved
    const hasGoalKey = !!contact.goal_key;
    // const isUnsavedContact = unsavedContactIndexes.has(index);

    // Only call API for contacts that have goal_key (exist in backend)
    if (hasGoalKey && uuid) {
      try {
        await destroy('supportcareplan/remove-section', {
          uuid: uuid,
          table: 'support_care_plan_emergency_contacts',
          field: 'goal_key', // Use goal_key instead of name
          value: contact.goal_key,
        });
      } catch (error) {
        console.error('Failed to remove contact from backend:', error);
        // Even if API call fails, remove from local state
        // You might want to show an error message to the user
      }
    }

    // Remove from local state regardless of API call success
    const updatedContacts = [...emergencyContacts];
    updatedContacts.splice(index, 1);
    setEmergencyContacts(updatedContacts);

    // Update the unsavedContactIndexes to adjust indexes
    const updatedIndexes = new Set<number>();
    unsavedContactIndexes.forEach(unsavedIndex => {
      if (unsavedIndex > index) {
        updatedIndexes.add(unsavedIndex - 1);
      } else if (unsavedIndex < index) {
        updatedIndexes.add(unsavedIndex);
      }
    });
    setUnsavedContactIndexes(updatedIndexes);
  };

  const handleViewLogs = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 rounded shadow bg-white">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h2 className="text-lg font-semibold text-heading">EMERGENCY CONTACTS</h2>
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
        {emergencyContacts.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No emergency contacts added yet.</p>
        ) : (
          emergencyContacts.map((contact, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 rounded relative border border-gray-200"
            >
              {/* Name */}
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={contact.name || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter full name"
                />
              </div>

              {/* Relationship */}
              <div>
                <label className="block mb-1 font-medium">Relationship</label>
                <input
                  type="text"
                  name="relationship"
                  value={contact.relationship || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., Parent, Sibling, Friend"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-1 font-medium">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={contact.phone || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={contact.email || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter email address"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={contact.location || ''}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter address or location"
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeEmergencyContact(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                title="Remove this contact"
              >
                ❌ Remove
              </button>
            </div>
          ))
        )}

        {/* Add Button */}
        <button
          type="button"
          onClick={addEmergencyContact}
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          ➕ Add Another Emergency Contact
        </button>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="support_care_plan_emergency_contacts"
        field="all"
        url="support-care-plan/logs"
      />
    </div>
  );
}