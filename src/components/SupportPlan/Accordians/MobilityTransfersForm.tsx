"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanMobilityTransfers } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";

interface MobilityTransfersProps {
  formData: SupportPlanMobilityTransfers;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function MobilityTransfersForm({
  formData,
  handleChange,
  uuid,
}: MobilityTransfersProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.can_walk_independently === 0 && formData.walk_independently_details) {
      handleChange({
        target: {
          name: 'walk_independently_details',
          value: ''
        }
      });
    }
  }, [formData.can_walk_independently, formData.walk_independently_details, handleChange]);

  // Clear primary equipment used when needs_transfer_support is set to "No"
  useEffect(() => {
    if (formData.needs_transfer_support === 0 && formData.primary_equipment_used) {
      handleChange({
        target: {
          name: 'primary_equipment_used',
          value: ''
        }
      });
    }
  }, [formData.needs_transfer_support, formData.primary_equipment_used, handleChange]);

  // Clear climb stairs details when can_climb_stairs is set to "No"
  useEffect(() => {
    if (formData.can_climb_stairs === 0 && formData.climb_stairs_details) {
      handleChange({
        target: {
          name: 'climb_stairs_details',
          value: ''
        }
      });
    }
  }, [formData.can_climb_stairs, formData.climb_stairs_details, handleChange]);

  // Clear stairs at home details when has_stairs_at_home is set to "No"
  useEffect(() => {
    if (formData.has_stairs_at_home === 0 && formData.stairs_at_home_details) {
      handleChange({
        target: {
          name: 'stairs_at_home_details',
          value: ''
        }
      });
    }
  }, [formData.has_stairs_at_home, formData.stairs_at_home_details, handleChange]);

  // Clear bed pole prescribed by OT when uses_bed_pole_or_rails is set to "No"
  useEffect(() => {
    if (formData.uses_bed_pole_or_rails === 0 && formData.bed_pole_prescribed_by_ot !== undefined) {
      handleChange({
        target: {
          name: 'bed_pole_prescribed_by_ot',
          value: 0
        }
      });
    }
  }, [formData.uses_bed_pole_or_rails, formData.bed_pole_prescribed_by_ot, handleChange]);

  // Clear access places details when can_access_places_outside_walking_distance is set to "No"
  useEffect(() => {
    if (formData.can_access_places_outside_walking_distance === 0 && formData.access_places_details) {
      handleChange({
        target: {
          name: 'access_places_details',
          value: ''
        }
      });
    }
  }, [formData.can_access_places_outside_walking_distance, formData.access_places_details, handleChange]);

  // Clear mobilise yard details when safe_to_mobilise_in_yard is set to "No"
  useEffect(() => {
    if (formData.safe_to_mobilise_in_yard === 0 && formData.mobilise_yard_details) {
      handleChange({
        target: {
          name: 'mobilise_yard_details',
          value: ''
        }
      });
    }
  }, [formData.safe_to_mobilise_in_yard, formData.mobilise_yard_details, handleChange]);

  // Clear driving risk details when medications_or_conditions_risk is set to "No"
  useEffect(() => {
    if (formData.medications_or_conditions_risk === 0 && formData.driving_risk_details) {
      handleChange({
        target: {
          name: 'driving_risk_details',
          value: ''
        }
      });
    }
  }, [formData.medications_or_conditions_risk, formData.driving_risk_details, handleChange]);

  // Clear four wheel walker details when uses_four_wheel_walker is set to "No"
  useEffect(() => {
    if (formData.uses_four_wheel_walker === 0 && formData.four_wheel_walker_details) {
      handleChange({
        target: {
          name: 'four_wheel_walker_details',
          value: ''
        }
      });
    }
  }, [formData.uses_four_wheel_walker, formData.four_wheel_walker_details, handleChange]);

  // Clear carry 5kg details when can_carry_5kg is set to "No"
  useEffect(() => {
    if (formData.can_carry_5kg === 0 && formData.carry_5kg_details) {
      handleChange({
        target: {
          name: 'carry_5kg_details',
          value: ''
        }
      });
    }
  }, [formData.can_carry_5kg, formData.carry_5kg_details, handleChange]);

  // Clear foot problems details when foot_problems is set to "No"
  useEffect(() => {
    if (formData.foot_problems === 0 && formData.foot_problems_details) {
      handleChange({
        target: {
          name: 'foot_problems_details',
          value: ''
        }
      });
    }
  }, [formData.foot_problems, formData.foot_problems_details, handleChange]);

  // Clear mobility worries details when mobility_worries is set to "No"
  useEffect(() => {
    if (formData.mobility_worries === 0 && formData.mobility_worries_details) {
      handleChange({
        target: {
          name: 'mobility_worries_details',
          value: ''
        }
      });
    }
  }, [formData.mobility_worries, formData.mobility_worries_details, handleChange]);

  // Clear DEMMI assessment result when demmi_assessment_required is set to "No"
  useEffect(() => {
    if (formData.demmi_assessment_required === 0 && formData.demmi_assessment_result) {
      handleChange({
        target: {
          name: 'demmi_assessment_result',
          value: ''
        }
      });
    }
  }, [formData.demmi_assessment_required, formData.demmi_assessment_result, handleChange]);

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

  const renderYesNoField = (fieldName: string, label: string, detailsField?: string) => (
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
                checked={formData[fieldName as keyof SupportPlanMobilityTransfers] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanMobilityTransfers] === 1 && (
        <div
          className="relative md:col-span-2"
          onMouseEnter={() => setHoveredField(detailsField)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Details</label>
            {hoveredField === detailsField && (
              <button
                type="button"
                onClick={() => handleViewLogs(detailsField)}
                className="text-xs btn-primary text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <textarea
            name={detailsField}
            placeholder={"List details..."}
            value={formData[detailsField as keyof SupportPlanMobilityTransfers] || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>
      )}
    </>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Mobility & Transfers
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Walking Independence */}
          {renderYesNoField("can_walk_independently", "Are you able to walk independently?", "walk_independently_details")}

          {/* Transfer Support */}
          {renderYesNoField("needs_transfer_support", "Do you need support with transfers?")}

          {/* Primary Equipment Used */}
          {formData.needs_transfer_support === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("primary_equipment_used")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Primary equipment used for mobility</label>
                {hoveredField === "primary_equipment_used" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("primary_equipment_used")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="primary_equipment_used"
                placeholder="Enter primary equipment used"
                value={formData.primary_equipment_used || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}

          {/* Stair Climbing */}
          {renderYesNoField("can_climb_stairs", "Can you climb stairs safely?", "climb_stairs_details")}

          {/* Stairs at Home */}
          {renderYesNoField("has_stairs_at_home", "Do you have stairs in your house?", "stairs_at_home_details")}

          {/* Transfer Abilities */}
          {renderYesNoField("can_transfer_self", "Are you able to transfer yourself from a chair, bed, etc.?")}
          {renderYesNoField("can_transfer_in_other_envs", "Are you able to transfer when not at home in different environments?")}

          {/* Bed Equipment */}
          {renderYesNoField("uses_bed_pole_or_rails", "Do you use a Bed Pole/Bed Rails")}
          {formData.uses_bed_pole_or_rails === 1 && (
            renderYesNoField("bed_pole_prescribed_by_ot", "If yes, was this prescribed by an Occupational Therapist")
          )}

          {/* Access to Places */}
          {renderYesNoField("can_access_places_outside_walking_distance", "Are you able to get to places out of walking distance? (100m+)", "access_places_details")}

          {/* Yard Mobility */}
          {renderYesNoField("safe_to_mobilise_in_yard", "Is it safe for you to mobilise in your back/front yard?", "mobilise_yard_details")}

          {/* Community Access */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("community_access")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">How do you access the community?</label>
              {hoveredField === "community_access" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("community_access")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="community_access"
              placeholder="Describe community access abilities and limitations..."
              value={formData.community_access || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Driving */}
          {renderYesNoField("drives", "Do you drive?")}
          {renderYesNoField("medications_or_conditions_risk", "If yes, do any of your medications or health conditions pose a safety risk?", "driving_risk_details")}

          {/* Mobility Equipment */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("mobility_equipment")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Equipment you use to aid mobility.</label>
              {hoveredField === "mobility_equipment" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("mobility_equipment")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="mobility_equipment"
              placeholder="List all mobility equipment used..."
              value={formData.mobility_equipment || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Equipment Purchase Type */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("equipment_purchase_type")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Did you self-purchase this equipment or was it recommended by an Occupational Therapist?</label>
              {hoveredField === "equipment_purchase_type" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("equipment_purchase_type")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="equipment_purchase_type"
              placeholder="Enter equipment purchase type"
              value={formData.equipment_purchase_type || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Four Wheel Walker */}
          {renderYesNoField("uses_four_wheel_walker", "Do you use a 4-wheel walker?", "four_wheel_walker_details")}

          {/* Wheelchair Information */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("wheelchair_type")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Wheelchair Type</label>
              {hoveredField === "wheelchair_type" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("wheelchair_type")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="wheelchair_type"
              placeholder="Enter wheelchair type"
              value={formData.wheelchair_type || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Wheelchair Operation */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("wheelchair_operation")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">How do you operate your wheelchair?</label>
              {hoveredField === "wheelchair_operation" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("wheelchair_operation")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="wheelchair_operation"
              placeholder="Describe wheelchair operation abilities..."
              value={formData.wheelchair_operation || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Wheelchair Details */}
          {renderYesNoField("wheelchair_ot_recommended", "Was the wheelchair recommended by an Occupational Therapist?")}
          {renderYesNoField("can_charge_wheelchair", "Can you independently charge the wheelchair battery?")}

          {/* Last Wheelchair Service */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("last_wheelchair_service_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Last service date for wheelchair</label>
              {hoveredField === "last_wheelchair_service_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("last_wheelchair_service_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="last_wheelchair_service_date"
              value={formData.last_wheelchair_service_date}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="last_wheelchair_service_date"
              value={formData.last_wheelchair_service_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Carrying Ability */}
          {renderYesNoField("can_carry_5kg", "Are you able to carry items 5kg< while mobilising?", "carry_5kg_details")}

          {/* Foot Problems */}
          {renderYesNoField("foot_problems", "Any foot problems that impact your mobility", "foot_problems_details")}

          {/* Mobility Worries */}
          {renderYesNoField("mobility_worries", "Are there any aspects of your mobility that worry you?", "mobility_worries_details")}

          {/* OT Assessment */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("last_ot_assessment_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Date of last Occupational Therapist assessment</label>
              {hoveredField === "last_ot_assessment_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("last_ot_assessment_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="last_ot_assessment_date"
              value={formData.last_ot_assessment_date}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="last_ot_assessment_date"
              value={formData.last_ot_assessment_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* OT Referral */}
          {renderYesNoField("new_ot_referral_required", "Is a new Occupational; Therapist referral required")}

          {/* DEMMI Assessment */}
          {renderYesNoField("demmi_assessment_required", "DEMMI Assessment required")}

          {/* DEMMI Result */}
          {formData.demmi_assessment_required === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("demmi_assessment_result")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">DEMMI Assessment Result</label>
                {hoveredField === "demmi_assessment_result" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("demmi_assessment_result")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="demmi_assessment_result"
                placeholder="Enter DEMMI assessment result"
                value={formData.demmi_assessment_result || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_mobility_transfer"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}