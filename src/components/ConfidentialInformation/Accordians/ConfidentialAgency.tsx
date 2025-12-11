"use client";
import React, { useState } from "react";
import { destroy } from "@/src/services/crud";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface ConfidentialAgency {
  name?: string;
  role?: string;
  contact?: string;
  agency_name?: string;
  service_type?: string;
  information_shared?: string;
  goal_key?: string;
}

interface ConfidentialAgenciesProps {
  agencies?: ConfidentialAgency[];
  setAgencies?: React.Dispatch<React.SetStateAction<ConfidentialAgency[]>>;
  uuid?: string | null;
}

export default function ConfidentialAgenciesForm({
  agencies = [],
  setAgencies,
  uuid,
}: ConfidentialAgenciesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Track newly added agencies that haven't been submitted
  const [unsavedAgencyIndexes, setUnsavedAgencyIndexes] = useState<Set<number>>(
    new Set()
  );

  const handleFieldChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!setAgencies) return;
    const { name, value } = e.target;
    const updatedAgencies = [...agencies];
    updatedAgencies[index][name as keyof ConfidentialAgency] = value;
    setAgencies(updatedAgencies);
  };

  const addConfidentialAgency = () => {
    if (!setAgencies) return;

    const newIndex = agencies.length;
    setAgencies([
      ...agencies,
      {
        name: "",
        role: "",
        contact: "",
        agency_name: "",
        service_type: "",
        information_shared: "",
        goal_key: "", // Empty goal_key for new unsaved agencies
      },
    ]);

    // Track the index of the newly added agency
    setUnsavedAgencyIndexes((prev) => new Set([...prev, newIndex]));
  };

  const removeConfidentialAgency = async (index: number) => {
    if (!setAgencies) return;
    const agency = agencies[index];

    // Check if this agency has a goal_key (submitted to backend) or is unsaved
    const hasGoalKey = !!agency.goal_key;

    // Only call API for agencies that have goal_key (exist in backend)
    if (hasGoalKey && uuid) {
      try {
        await destroy("confidential-form/remove-section", {
          uuid: uuid,
          table: "confidential_information_agency",
          field: "goal_key",
          value: agency.goal_key,
        });
      } catch (error) {
        console.error("Failed to remove agency from backend:", error);
        // Even if API call fails, remove from local state
        // You might want to show an error message to the user
      }
    }

    // Remove from local state regardless of API call success
    const updatedAgencies = [...agencies];
    updatedAgencies.splice(index, 1);
    setAgencies(updatedAgencies);

    // Update the unsavedAgencyIndexes to adjust indexes
    const updatedIndexes = new Set<number>();
    unsavedAgencyIndexes.forEach((unsavedIndex) => {
      if (unsavedIndex > index) {
        updatedIndexes.add(unsavedIndex - 1);
      } else if (unsavedIndex < index) {
        updatedIndexes.add(unsavedIndex);
      }
    });
    setUnsavedAgencyIndexes(updatedIndexes);
  };

  const handleViewLogs = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 rounded shadow bg-white">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h2 className="text-lg font-semibold text-heading">
          CONFIDENTIAL AGENCIES
        </h2>
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
        <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
          <div className="text-gray-700 space-y-3 w-full">
            <p className="text-gray-600 mb-4">
              <b>
                PROPOSED USE AND DISCLOSURE OF MY PERSONAL INFORMATION BETWEEN
                THE ORGANISATION AND AS LISTED BELOW:
              </b>
            </p>
            <p>
              I understand that the following service(s) are recommended and
              relevant information about me may be forwarded to the agency(s)
              that provide these services, in order that I receive the best
              possible service, including external agencies (e.g. NDIS, DHHS,
              and Certification Body) and other service providers.
            </p>
          </div>
        </div>
        {agencies.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No confidential agencies added yet.
          </p>
        ) : (
          agencies.map((agency, index) => (
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
                  value={agency.name || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter contact person name"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block mb-1 font-medium">Role</label>
                <input
                  type="text"
                  name="role"
                  value={agency.role || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., Case Manager, Therapist"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block mb-1 font-medium">
                  Contact Information
                </label>
                <input
                  type="text"
                  name="contact"
                  value={agency.contact || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Phone, email, or other contact"
                />
              </div>

              {/* Agency Name */}
              <div>
                <label className="block mb-1 font-medium">Agency Name</label>
                <input
                  type="text"
                  name="agency_name"
                  value={agency.agency_name || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter agency name"
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block mb-1 font-medium">Service Type</label>
                <input
                  type="text"
                  name="service_type"
                  value={agency.service_type || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., Counseling, Legal, Medical"
                />
              </div>

              {/* Information Shared */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">
                  Type of Information (Including Limits as Applicable)
                </label>
                <textarea
                  name="information_shared"
                  value={agency.information_shared || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Describe what information is shared with this agency"
                  rows={3}
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeConfidentialAgency(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                title="Remove this agency"
              >
                ❌ Remove
              </button>
            </div>
          ))
        )}

        {/* Add Button */}
        <button
          type="button"
          onClick={addConfidentialAgency}
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          ➕ Add Another Confidential Agency
        </button>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="confidential_information_agency"
        field="all"
        url="confidential-form/logs"
      />
    </div>
  );
}
