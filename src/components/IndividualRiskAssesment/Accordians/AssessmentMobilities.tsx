"use client";
import React, { useState, useEffect } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface AssessmentMobilitiesFormData {
  // Walking and mobility
  walk_unaided?: number;
  accessibility_required?: number;
  walk_hazards?: string;
  walk_management_plan?: string;

  manages_stairs?: number;
  stairs_hazards?: string;
  stairs_management_plan?: string;

  uses_walking_aid?: number;
  walking_aid_hazards?: string;
  walking_aid_management_plan?: string;

  uses_wheelchair?: number;
  wheelchair_hazards?: string;
  wheelchair_management_plan?: string;

  // Transfers
  bed_transfer?: number;
  bed_transfer_hazards?: string;
  bed_transfer_management_plan?: string;

  vehicle_transfer?: number;
  vehicle_transfer_hazards?: string;
  vehicle_transfer_management_plan?: string;

  toilet_transfer?: number;
  toilet_transfer_hazards?: string;
  toilet_transfer_management_plan?: string;
}

interface AssessmentMobilitiesProps {
  formData: AssessmentMobilitiesFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function AssessmentMobilitiesForm({
  formData,
  handleChange,
  uuid,
}: AssessmentMobilitiesProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.walk_unaided === 0) {
      if (formData.walk_hazards) {
        handleChange({
          target: {
            name: "walk_hazards",
            value: "",
          },
        });
      }
      if (formData.walk_management_plan) {
        handleChange({
          target: {
            name: "walk_management_plan",
            value: "",
          },
        });
      }
    }
  }, [
    formData.walk_unaided,
    formData.walk_hazards,
    formData.walk_management_plan,
    handleChange,
  ]);

  // Clear stairs hazards and management plan when manages_stairs is set to "No"
  useEffect(() => {
    if (formData.manages_stairs === 0) {
      if (formData.stairs_hazards) {
        handleChange({
          target: {
            name: "stairs_hazards",
            value: "",
          },
        });
      }
      if (formData.stairs_management_plan) {
        handleChange({
          target: {
            name: "stairs_management_plan",
            value: "",
          },
        });
      }
    }
  }, [
    formData.manages_stairs,
    formData.stairs_hazards,
    formData.stairs_management_plan,
    handleChange,
  ]);

  // Clear walking aid hazards and management plan when uses_walking_aid is set to "No"
  useEffect(() => {
    if (formData.uses_walking_aid === 0) {
      if (formData.walking_aid_hazards) {
        handleChange({
          target: {
            name: "walking_aid_hazards",
            value: "",
          },
        });
      }
      if (formData.walking_aid_management_plan) {
        handleChange({
          target: {
            name: "walking_aid_management_plan",
            value: "",
          },
        });
      }
    }
  }, [
    formData.uses_walking_aid,
    formData.walking_aid_hazards,
    formData.walking_aid_management_plan,
    handleChange,
  ]);

  // Clear wheelchair hazards and management plan when uses_wheelchair is set to "No"
  useEffect(() => {
    if (formData.uses_wheelchair === 0) {
      if (formData.wheelchair_hazards) {
        handleChange({
          target: {
            name: "wheelchair_hazards",
            value: "",
          },
        });
      }
      if (formData.wheelchair_management_plan) {
        handleChange({
          target: {
            name: "wheelchair_management_plan",
            value: "",
          },
        });
      }
    }
  }, [
    formData.uses_wheelchair,
    formData.wheelchair_hazards,
    formData.wheelchair_management_plan,
    handleChange,
  ]);

  // Clear bed transfer hazards and management plan when bed_transfer is set to "No"
  useEffect(() => {
    if (formData.bed_transfer === 0) {
      if (formData.bed_transfer_hazards) {
        handleChange({
          target: {
            name: "bed_transfer_hazards",
            value: "",
          },
        });
      }
      if (formData.bed_transfer_management_plan) {
        handleChange({
          target: {
            name: "bed_transfer_management_plan",
            value: "",
          },
        });
      }
    }
  }, [
    formData.bed_transfer,
    formData.bed_transfer_hazards,
    formData.bed_transfer_management_plan,
    handleChange,
  ]);

  // Clear vehicle transfer hazards and management plan when vehicle_transfer is set to "No"
  useEffect(() => {
    if (formData.vehicle_transfer === 0) {
      if (formData.vehicle_transfer_hazards) {
        handleChange({
          target: {
            name: "vehicle_transfer_hazards",
            value: "",
          },
        });
      }
      if (formData.vehicle_transfer_management_plan) {
        handleChange({
          target: {
            name: "vehicle_transfer_management_plan",
            value: "",
          },
        });
      }
    }
  }, [
    formData.vehicle_transfer,
    formData.vehicle_transfer_hazards,
    formData.vehicle_transfer_management_plan,
    handleChange,
  ]);

  // Clear toilet transfer hazards and management plan when toilet_transfer is set to "No"
  useEffect(() => {
    if (formData.toilet_transfer === 0) {
      if (formData.toilet_transfer_hazards) {
        handleChange({
          target: {
            name: "toilet_transfer_hazards",
            value: "",
          },
        });
      }
      if (formData.toilet_transfer_management_plan) {
        handleChange({
          target: {
            name: "toilet_transfer_management_plan",
            value: "",
          },
        });
      }
    }
  }, [
    formData.toilet_transfer,
    formData.toilet_transfer_hazards,
    formData.toilet_transfer_management_plan,
    handleChange,
  ]);

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

  const renderYesNoField = (
    fieldName: string,
    label: string,
    hazardsField?: string,
    managementPlanField?: string
  ) => (
    <>
      <div
        className="relative"
        onMouseEnter={() => setHoveredField(fieldName)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <div className="flex justify-between items-center mb-1">
          <label className="block font-medium">{label}</label>
          {hoveredField === fieldName && (
            <button
              type="button"
              onClick={() => handleViewLogs(fieldName)}
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
                name={fieldName}
                value={value}
                checked={
                  formData[fieldName as keyof AssessmentMobilitiesFormData] ===
                  value
                }
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {fieldName === "walk_unaided" && formData.walk_unaided === 1 && (
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("accessibility_required")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">
              Are environmental accessibility considerations required (e.g.,
              premise must have ramp, sensory requirements, parking
              requirements)
            </label>
            {hoveredField === "accessibility_required" && (
              <button
                type="button"
                onClick={() => handleViewLogs("accessibility_required")}
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
                  name="accessibility_required"
                  value={value}
                  checked={formData.accessibility_required === value}
                  onChange={handleRadioNumberChange}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Show hazards and management plan only if Yes is selected */}
      {formData[fieldName as keyof AssessmentMobilitiesFormData] === 1 &&
        hazardsField &&
        managementPlanField && (
          <>
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField(hazardsField)}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Hazards Identified</label>
                {hoveredField === hazardsField && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs(hazardsField)}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name={hazardsField}
                placeholder={"Describe hazards"}
                value={
                  formData[
                    hazardsField as keyof AssessmentMobilitiesFormData
                  ] || ""
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>

            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField(managementPlanField)}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                {fieldName === "walk_unaided" ? (
                  <label className="block font-medium">
                    Outline potential risks when walking without assistance.
                  </label>
                ) : (
                  <label className="block font-medium">Management Plan</label>
                  )
                }
                {hoveredField === managementPlanField && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs(managementPlanField)}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name={managementPlanField}
                placeholder={"Describe management plan"}
                value={
                  formData[
                    managementPlanField as keyof AssessmentMobilitiesFormData
                  ] || ""
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          </>
        )}
    </>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          ASSESSMENT MOBILITIES
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Walking Section */}
          <div className="md:col-span-2">
            <h5 className="font-semibold text-lg mb-4 text-gray-700 border-b pb-2">
              Walking & Mobility
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Walk Unaided */}
              {renderYesNoField(
                "walk_unaided",
                "Does the participant face risks when walking without assistance? ",
                "walk_hazards",
                "walk_management_plan"
              )}

              {/* Accessibility Required */}
            </div>
          </div>

          {/* Stairs Section */}
          <div className="md:col-span-2">
            {renderYesNoField(
              "manages_stairs",
              "Does the participant require assistance to use the stairs?",
              "stairs_hazards",
              "stairs_management_plan"
            )}
          </div>

          {/* Walking Aid Section */}
          <div className="md:col-span-2">
            {renderYesNoField(
              "uses_walking_aid",
              "Uses walking aid to walk",
              "walking_aid_hazards",
              "walking_aid_management_plan"
            )}
          </div>

          {/* Wheelchair Section */}
          <div className="md:col-span-2">
            {renderYesNoField(
              "uses_wheelchair",
              "Uses electric wheelchair/ scooter",
              "wheelchair_hazards",
              "wheelchair_management_plan"
            )}
          </div>
          {/* Bed Transfer */}
          <div className="md:col-span-2">
            {renderYesNoField(
              "bed_transfer",
              "Bed Transfer",
              "bed_transfer_hazards",
              "bed_transfer_management_plan"
            )}
          </div>

          {/* Vehicle Transfer */}
          <div className="md:col-span-2">
            {renderYesNoField(
              "vehicle_transfer",
              "Vehicle Transfer",
              "vehicle_transfer_hazards",
              "vehicle_transfer_management_plan"
            )}
          </div>

          {/* Toilet Transfer */}
          <div className="md:col-span-2">
            {renderYesNoField(
              "toilet_transfer",
              "Toilet Transfer",
              "toilet_transfer_hazards",
              "toilet_transfer_management_plan"
            )}
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="individual_risk_assessment_mobility"
        field={selectedField}
        url="risk-assessment/logs"
      />
    </div>
  );
}
