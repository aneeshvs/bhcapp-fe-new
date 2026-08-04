"use client";

import React, { useState } from "react";
import { HousingSilSupportData } from "./types";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface Props {
  formData: HousingSilSupportData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    > | { target: { name: string; value: string | number | boolean | string[] } }
  ) => void;
  uuid?: string;
}

const HousingSilSupportSection: React.FC<Props> = ({
  formData,
  handleChange,
  uuid,
}) => {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleCheckbox = (name: string, checked: boolean) => {
    handleChange({
      target: { name, value: checked ? "Yes" : "No" },
    });
  };

  return (
    <div className="space-y-6 text-gray-800">
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h3 className="text-xl font-bold mb-4 text-blue-900">Important Information About Your Rights</h3>
        
        <div className="mb-4">
          <p className="font-semibold text-gray-900">Your home and your SIL support are separate</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
            <li>Your housing is NOT linked to your SIL provider</li>
            <li>You will NOT lose your home if you change SIL providers</li>
            <li>You can choose a different SIL provider at any time</li>
            <li>Your support services do not control where you live</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="font-semibold text-gray-900">Your tenancy rights</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
            <li>Your home is a private rental property</li>
            <li>Your tenancy is separate from your support services</li>
            <li>Your SIL provider does not control your lease</li>
            <li>Housing decisions are made under tenancy law</li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="font-semibold text-gray-900">Your choices matter</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
            <li>You can make choices about your supports</li>
            <li>You can ask questions at any time</li>
            <li>You can get help from an advocate or support person</li>
            <li>Information will be explained in a way you understand</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-gray-900">No conflict of interest</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
            <li>You are never forced to stay with a SIL provider to keep your home</li>
            <li>Your housing is not used to influence your support choices</li>
            <li>You get clear information about your rights</li>
            <li>Everything is explained to you in writing and verbally</li>
          </ul>
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 text-red-900 font-medium">
        <p>Important to know</p>
        <p>This is NOT SDA housing.</p>
        <p>You are living in a privately rented home.</p>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Understanding this information</h3>
        
        <div className="space-y-3">
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("housing_separate")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300"
                  checked={formData.housing_separate === "Yes"}
                  onChange={(e) => handleCheckbox("housing_separate", e.target.checked)}
                />
                <span>My housing arrangement is separate from my SIL support provider.</span>
              </label>
              {hoveredField === "housing_separate" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("housing_separate")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
          </div>
          
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("change_sil_without_losing_home")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300"
                  checked={formData.change_sil_without_losing_home === "Yes"}
                  onChange={(e) => handleCheckbox("change_sil_without_losing_home", e.target.checked)}
                />
                <span>I understand that my choice of SIL provider is independent of my housing arrangement.</span>
              </label>
              {hoveredField === "change_sil_without_losing_home" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("change_sil_without_losing_home")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
          </div>
          
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("tenancy_separate")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300"
                  checked={formData.tenancy_separate === "Yes"}
                  onChange={(e) => handleCheckbox("tenancy_separate", e.target.checked)}
                />
                <span>My tenancy agreement is separate from the supports I receive.</span>
              </label>
              {hoveredField === "tenancy_separate" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("tenancy_separate")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
          </div>
          
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("explained_to_me")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300"
                  checked={formData.explained_to_me === "Yes"}
                  onChange={(e) => handleCheckbox("explained_to_me", e.target.checked)}
                />
                <span>These arrangements have been clearly explained to me, and I understand my rights and choices.</span>
              </label>
              {hoveredField === "explained_to_me" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("explained_to_me")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("participant_name")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            {hoveredField === "participant_name" && (
              <button
                type="button"
                onClick={() => handleViewLogs("participant_name")}
                className="text-xs btn-primary text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="participant_name"
            value={formData.participant_name || ""}
            onChange={handleChange}
            className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent p-2"
          />
        </div>
        
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("date")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            {hoveredField === "date" && (
              <button
                type="button"
                onClick={() => handleViewLogs("date")}
                className="text-xs btn-primary text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="date"
            name="date"
            value={formData.date || ""}
            onChange={handleChange}
            className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent p-2"
          />
        </div>
        
        <div
          className="md:col-span-2 relative"
          onMouseEnter={() => setHoveredField("support_person")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Support person (if needed)
            </label>
            {hoveredField === "support_person" && (
              <button
                type="button"
                onClick={() => handleViewLogs("support_person")}
                className="text-xs btn-primary text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="support_person"
            value={formData.support_person || ""}
            onChange={handleChange}
            className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent p-2"
          />
        </div>
      </div>
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="housing_sil_support"
        field={selectedField}
        url="housing-sil-support/logs"
      />
    </div>
  );
};

export default HousingSilSupportSection;
