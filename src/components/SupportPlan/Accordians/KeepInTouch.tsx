"use client";
import React, { useState, useEffect } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { KeepInTouch } from "@/src/components/SupportPlan/types";

interface KeepInTouchProps {
  formData: KeepInTouch;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function KeepInTouchForm({
  formData,
  handleChange,
  uuid,
}: KeepInTouchProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Clear contact details when contact person is set to "No"
  useEffect(() => {
    if (formData.contact_first_instance === 0 && formData.details) {
      handleChange({
        target: {
          name: "details",
          value: "",
        },
      });
    }
  }, [formData.contact_first_instance, formData.details, handleChange]);

  const handleViewLogs = (fieldName: string) => {
    console.log("View logs clicked", fieldName);
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
          KEEP IN TOUCH
        </h4>
      </div>
      <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
        <div className="text-gray-700 space-y-3 w-full">
          <p>
            We’ll check in with you at least once a month to make sure you’re
            receiving the care and services you need and to answer any
            questions. We may also contact you for a variety of reasons related
            to your care—such as confirming services, discussing changes,
            reviewing your support plan, or responding to any concerns. That’s
            why it’s important that we know the best way to reach you.
          </p>
        </div>
      </div>
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("need_help_to_communicate")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                Do you ever need help to communicate (to understand or be understood by others)?
              </label>
              {hoveredField === "need_help_to_communicate" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("need_help_to_communicate")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="need_help_to_communicate"
                    value={value}
                    checked={formData.need_help_to_communicate === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("type_of_difficulty")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Type of Difficulty</label>
              {hoveredField === "type_of_difficulty" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("type_of_difficulty")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="type_of_difficulty"
              placeholder="Type of Difficulty"
              value={formData.type_of_difficulty || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("contact_first_instance")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Should we contact you in the first instance?*If no, please refer to the Contacts section.</label>
              {hoveredField === "contact_first_instance" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("contact_first_instance")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="contact_first_instance"
                    value={value}
                    checked={formData.contact_first_instance === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Show "Contact Details" block only if 'Yes' is selected */}
            {formData.contact_first_instance === 1 && (
              <div
                className="relative"
                onMouseEnter={() => setHoveredField("details")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Contact Details</label>
                  {hoveredField === "details" && (
                    <button
                      type="button"
                      onClick={() => handleViewLogs("details")}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="details"
                  placeholder="Contact Details"
                  value={formData.details || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            )}
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("language_spoken")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Language Spoken</label>
              {hoveredField === "language_spoken" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("language_spoken")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="language_spoken"
              placeholder="Language Spoken"
              value={formData.language_spoken || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div
            className="relative"
            onMouseEnter={() => setHoveredField("use_nrs")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do you use the National Relay Service (NRS)?</label>
              {hoveredField === "use_nrs" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("use_nrs")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="use_nrs"
                    value={value}
                    checked={formData.use_nrs === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setHoveredField("require_interpreter")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do you require an interpreter</label>
              {hoveredField === "require_interpreter" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("require_interpreter")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="require_interpreter"
                    value={value}
                    checked={formData.require_interpreter === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("written")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Written</label>
              {hoveredField === "written" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("written")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="written"
              placeholder="Written"
              value={formData.written || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("verbal")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Verbal</label>
              {hoveredField === "verbal" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("verbal")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="verbal"
              placeholder="Verbal"
              value={formData.verbal || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("schedule_change_notification")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                How do you want to know about schedule changes?
              </label>
              {hoveredField === "schedule_change_notification" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("schedule_change_notification")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="schedule_change_notification"
              placeholder="Schedule Change Notification"
              value={formData.schedule_change_notification || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("interpreter_arrangement")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                Do you want to use a family/friend or would you like BHC to arrange an interpreter?
              </label>
              {hoveredField === "interpreter_arrangement" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("interpreter_arrangement")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="interpreter_arrangement"
              placeholder="Interpreter Arrangement"
              value={formData.interpreter_arrangement || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("financial_statement_method")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                How do you want to receive financial/statement?
              </label>
              {hoveredField === "financial_statement_method" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("financial_statement_method")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="financial_statement_method"
              placeholder="Financial Statement Method"
              value={formData.financial_statement_method || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("feedback_survey_method")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                How do you want to receive feedback surveys?
              </label>
              {hoveredField === "feedback_survey_method" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("feedback_survey_method")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="feedback_survey_method"
              placeholder="Feedback Survey Method"
              value={formData.feedback_survey_method || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("marketing_material_method")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                How do you want to receive marketing material?
              </label>
              {hoveredField === "marketing_material_method" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("marketing_material_method")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="marketing_material_method"
              placeholder="Marketing Material Method"
              value={formData.marketing_material_method || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() =>
              setHoveredField("preferred_communication_method")
            }
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                How do you want to communicate with us?
              </label>
              {hoveredField === "preferred_communication_method" && (
                <button
                  type="button"
                  onClick={() =>
                    handleViewLogs("preferred_communication_method")
                  }
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="preferred_communication_method"
              placeholder="Preferred Communication Method"
              value={formData.preferred_communication_method || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("join_cab")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do you want to be involved with the Consumer Advisory Body (CAB)?</label>
              {hoveredField === "join_cab" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("join_cab")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="join_cab"
                    value={value}
                    checked={formData.join_cab === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        table="keeping_in_touch"
        field={selectedField}
        uuid={effectiveUuid ?? ""}
        url="logs/view/support"
      />
    </div>
  );
}
