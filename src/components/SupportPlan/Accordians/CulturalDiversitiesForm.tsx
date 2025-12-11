"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { CulturalDiversities } from "@/src/components/SupportPlan/types";

interface CulturalDiversitiesProps {
  formData: CulturalDiversities;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function CulturalDiversitiesForm({
  formData,
  handleChange,
  uuid,
}: CulturalDiversitiesProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.is_lgbti === 0 && formData.lgbti_details) {
      handleChange({
        target: {
          name: 'lgbti_details',
          value: ''
        }
      });
    }
  }, [formData.is_lgbti, formData.lgbti_details, handleChange]);

  // Clear separated family details when is_separated_family is set to "No"
  useEffect(() => {
    if (formData.is_separated_family === 0 && formData.separated_family_details) {
      handleChange({
        target: {
          name: 'separated_family_details',
          value: ''
        }
      });
    }
  }, [formData.is_separated_family, formData.separated_family_details, handleChange]);

  // Clear cultural events details when has_cultural_events is set to "No"
  useEffect(() => {
    if (formData.has_cultural_events === 0 && formData.cultural_events_details) {
      handleChange({
        target: {
          name: 'cultural_events_details',
          value: ''
        }
      });
    }
  }, [formData.has_cultural_events, formData.cultural_events_details, handleChange]);

  // Clear past events details when has_past_events is set to "No"
  useEffect(() => {
    if (formData.has_past_events === 0 && formData.past_events_details) {
      handleChange({
        target: {
          name: 'past_events_details',
          value: ''
        }
      });
    }
  }, [formData.has_past_events, formData.past_events_details, handleChange]);

  // Clear non-disclosure details when has_non_disclosure_items is set to "No"
  useEffect(() => {
    if (formData.has_non_disclosure_items === 0 && formData.non_disclosure_details) {
      handleChange({
        target: {
          name: 'non_disclosure_details',
          value: ''
        }
      });
    }
  }, [formData.has_non_disclosure_items, formData.non_disclosure_details, handleChange]);


  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const yesNoOptions = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  const handleRadioNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value: Number(value),
      },
    });
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Cultural Diversities
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LGBTI */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("is_lgbti")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do you identify as a lesbian, gay, bisexual, transgender, or intersex person</label>
              {hoveredField === "is_lgbti" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("is_lgbti")}
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
                    name="is_lgbti"
                    value={value}
                    checked={formData.is_lgbti === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* LGBTI Details */}
          {formData.is_lgbti === 1 && (
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField("lgbti_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Details</label>
                {hoveredField === "lgbti_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("lgbti_details")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="lgbti_details"
                placeholder="Provide details about LGBTI identity..."
                value={formData.lgbti_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          )}

          {/* Separated Family */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("is_separated_family")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do you identify as a person separated from your parents or children by forced adoption or removal</label>
              {hoveredField === "is_separated_family" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("is_separated_family")}
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
                    name="is_separated_family"
                    value={value}
                    checked={formData.is_separated_family === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Separated Family Details */}
          {formData.is_separated_family === 1 && (
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField("separated_family_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Details</label>
                {hoveredField === "separated_family_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("separated_family_details")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="separated_family_details"
                placeholder="Provide details about family separation..."
                value={formData.separated_family_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          )}

          {/* Cultural Events */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("has_cultural_events")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Are there cultural events, dates or practices we should be aware of to support you?</label>
              {hoveredField === "has_cultural_events" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("has_cultural_events")}
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
                    name="has_cultural_events"
                    value={value}
                    checked={formData.has_cultural_events === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Cultural Events Details */}
          {formData.has_cultural_events === 1 && (
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField("cultural_events_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">List Details</label>
                {hoveredField === "cultural_events_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("cultural_events_details")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="cultural_events_details"
                placeholder="Provide details about cultural events..."
                value={formData.cultural_events_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          )}

          {/* Past Events */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("has_past_events")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Are there events from your past you would like us to know about so we can support you safely?</label>
              {hoveredField === "has_past_events" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("has_past_events")}
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
                    name="has_past_events"
                    value={value}
                    checked={formData.has_past_events === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Past Events Details */}
          {formData.has_past_events === 1 && (
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField("past_events_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">List Details</label>
                {hoveredField === "past_events_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("past_events_details")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="past_events_details"
                placeholder="Provide details about past events..."
                value={formData.past_events_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          )}

          {/* Non-Disclosure Items */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("has_non_disclosure_items")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Are there any items discussed regarding your culture,diversity or identity that you would BHC to not disclose to others?</label>
              {hoveredField === "has_non_disclosure_items" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("has_non_disclosure_items")}
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
                    name="has_non_disclosure_items"
                    value={value}
                    checked={formData.has_non_disclosure_items === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Non-Disclosure Details */}
          {formData.has_non_disclosure_items === 1 && (
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField("non_disclosure_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">List Details</label>
                {hoveredField === "non_disclosure_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("non_disclosure_details")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="non_disclosure_details"
                placeholder="Provide details about non-disclosure items..."
                value={formData.non_disclosure_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="cultural_diversity"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}