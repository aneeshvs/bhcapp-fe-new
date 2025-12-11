"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanGeneralHealth } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";


interface GeneralHealthProps {
  formData: SupportPlanGeneralHealth;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function GeneralHealthForm({
  formData,
  handleChange,
  uuid,
}: GeneralHealthProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.admitted_hospital_last12months === 0 && formData.admitted_hospital_details) {
      handleChange({
        target: {
          name: 'admitted_hospital_details',
          value: ''
        }
      });
    }
  }, [formData.admitted_hospital_last12months, formData.admitted_hospital_details, handleChange]);

  // Clear preferred hospital details when preferred_hospital is set to "No"
  useEffect(() => {
    if (formData.preferred_hospital === 0 && formData.preferred_hospital_details) {
      handleChange({
        target: {
          name: 'preferred_hospital_details',
          value: ''
        }
      });
    }
  }, [formData.preferred_hospital, formData.preferred_hospital_details, handleChange]);

  // Clear allergy details when has_allergies is set to "No"
  useEffect(() => {
    if (formData.has_allergies === 0 && formData.allergy_details) {
      handleChange({
        target: {
          name: 'allergy_details',
          value: ''
        }
      });
    }
  }, [formData.has_allergies, formData.allergy_details, handleChange]);

  // Clear painful day to day details when painful_day_to_day is set to "No"
  useEffect(() => {
    if (formData.painful_day_to_day === 0 && formData.painful_day_to_day_details) {
      handleChange({
        target: {
          name: 'painful_day_to_day_details',
          value: ''
        }
      });
    }
  }, [formData.painful_day_to_day, formData.painful_day_to_day_details, handleChange]);

  // Clear weight loss details when weight_loss_last3months is set to "No"
  useEffect(() => {
    if (formData.weight_loss_last3months === 0 && formData.weight_loss_details) {
      handleChange({
        target: {
          name: 'weight_loss_details',
          value: ''
        }
      });
    }
  }, [formData.weight_loss_last3months, formData.weight_loss_details, handleChange]);

  // Clear nutritional concerns details when nutritional_concerns is set to "No"
  useEffect(() => {
    if (formData.nutritional_concerns === 0 && formData.nutritional_concerns_details) {
      handleChange({
        target: {
          name: 'nutritional_concerns_details',
          value: ''
        }
      });
    }
  }, [formData.nutritional_concerns, formData.nutritional_concerns_details, handleChange]);

  // Clear annual vaccination details when annual_vaccinations is set to "No"
  useEffect(() => {
    if (formData.annual_vaccinations === 0 && formData.annual_vaccination_details) {
      handleChange({
        target: {
          name: 'annual_vaccination_details',
          value: ''
        }
      });
    }
  }, [formData.annual_vaccinations, formData.annual_vaccination_details, handleChange]);

  // Clear sleep difficulties details when sleep_difficulties is set to "No"
  useEffect(() => {
    if (formData.sleep_difficulties === 0 && formData.sleep_difficulties_details) {
      handleChange({
        target: {
          name: 'sleep_difficulties_details',
          value: ''
        }
      });
    }
  }, [formData.sleep_difficulties, formData.sleep_difficulties_details, handleChange]);

  // Clear sleep routine worries details when sleep_routine_worries is set to "No"
  useEffect(() => {
    if (formData.sleep_routine_worries === 0 && formData.sleep_routine_worries_details) {
      handleChange({
        target: {
          name: 'sleep_routine_worries_details',
          value: ''
        }
      });
    }
  }, [formData.sleep_routine_worries, formData.sleep_routine_worries_details, handleChange]);

  // Clear substance use details when alcohol_smoke_drug_use is set to "No"
  useEffect(() => {
    if (formData.alcohol_smoke_drug_use === 0 && formData.alcohol_smoke_drug_details) {
      handleChange({
        target: {
          name: 'alcohol_smoke_drug_details',
          value: ''
        }
      });
    }
  }, [formData.alcohol_smoke_drug_use, formData.alcohol_smoke_drug_details, handleChange]);

  // Clear substance use worries details when alcohol_smoke_drug_worries is set to "No"
  useEffect(() => {
    if (formData.alcohol_smoke_drug_worries === 0 && formData.alcohol_smoke_drug_worries_details) {
      handleChange({
        target: {
          name: 'alcohol_smoke_drug_worries_details',
          value: ''
        }
      });
    }
  }, [formData.alcohol_smoke_drug_worries, formData.alcohol_smoke_drug_worries_details, handleChange]);

  // Clear referral required details when referral_required is set to "No"
  useEffect(() => {
    if (formData.referral_required === 0 && formData.referral_required_details) {
      handleChange({
        target: {
          name: 'referral_required_details',
          value: ''
        }
      });
    }
  }, [formData.referral_required, formData.referral_required_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanGeneralHealth] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanGeneralHealth] === 1 && (
        <div
          className="relative md:col-span-2"
          onMouseEnter={() => setHoveredField(detailsField)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">List Details</label>
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
            value={formData[detailsField as keyof SupportPlanGeneralHealth] || ""}
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
          General Health Information
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GP Visit Frequency */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("gp_visit_frequency")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">How regularly do you visit your GP?</label>
              {hoveredField === "gp_visit_frequency" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("gp_visit_frequency")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="gp_visit_frequency"
              placeholder="e.g., Monthly, Quarterly, etc."
              value={formData.gp_visit_frequency || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Hospital Admission */}
          {renderYesNoField("admitted_hospital_last12months", "Have you attended/been admitted to hospital in the last 12 months?", "admitted_hospital_details")}

          {/* Preferred Hospital */}
          {renderYesNoField("preferred_hospital", "Do you have a preference for hospital if you need to be admitted?", "preferred_hospital_details")}

          {/* Diagnosis & Medications */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("diagnosis_medication_conditions")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Diagnosis & Medication Conditions</label>
              {hoveredField === "diagnosis_medication_conditions" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("diagnosis_medication_conditions")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="diagnosis_medication_conditions"
              placeholder="List medical conditions, diagnoses, and medications..."
              value={formData.diagnosis_medication_conditions || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Previous Surgeries */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("previous_surgeries")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Previous Surgeries</label>
              {hoveredField === "previous_surgeries" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("previous_surgeries")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="previous_surgeries"
              placeholder="List previous surgeries and dates..."
              value={formData.previous_surgeries || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Allergies */}
          {renderYesNoField("has_allergies", "Do you have any allergies?", "allergy_details")}

          {/* Health Impact Scale */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("health_impact_scale")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">How much have health issues affected your normal activities</label>
              {hoveredField === "health_impact_scale" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("health_impact_scale")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              name="health_impact_scale"
              placeholder="Enter a Scale"
              value={formData.health_impact_scale || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
            </input>
          </div>

          {/* Painful Day to Day */}
          {renderYesNoField("painful_day_to_day", "During the last 3 months has it often been too painful to do many of your day-to-day activities?", "painful_day_to_day_details")}

          {/* Weight Loss */}
          {renderYesNoField("weight_loss_last3months", "Have you unintentionally lost >5% of your body weight in the last 3 months?", "weight_loss_details")}

          {/* Nutritional Concerns */}
          {renderYesNoField("nutritional_concerns", "Do you have any weight loss or nutritional concerns?", "nutritional_concerns_details")}

          {/* Current Weight */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("current_weight")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Current Weight</label>
              {hoveredField === "current_weight" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("current_weight")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="current_weight"
              placeholder="e.g., 70 kg, 154 lbs"
              value={formData.current_weight || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Annual Vaccinations */}
          {renderYesNoField("annual_vaccinations", "Do you receive annual vaccinations", "annual_vaccination_details")}

          {/* Vaccine Dates */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("last_influenza_vaccine")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Last Influenza vaccination</label>
              {hoveredField === "last_influenza_vaccine" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("last_influenza_vaccine")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="last_influenza_vaccine"
              value={formData.last_influenza_vaccine}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="last_influenza_vaccine"
              value={formData.last_influenza_vaccine || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setHoveredField("last_covid19_vaccine")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Last COVID 19 vaccinations</label>
              {hoveredField === "last_covid19_vaccine" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("last_covid19_vaccine")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="last_covid19_vaccine"
              value={formData.last_covid19_vaccine}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="last_covid19_vaccine"
              value={formData.last_covid19_vaccine || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setHoveredField("last_pneumonia_vaccine")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Last Pneumonia vaccination</label>
              {hoveredField === "last_pneumonia_vaccine" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("last_pneumonia_vaccine")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="last_pneumonia_vaccine"
              value={formData.last_pneumonia_vaccine}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="last_pneumonia_vaccine"
              value={formData.last_pneumonia_vaccine || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Sleep Difficulties */}
          {renderYesNoField("sleep_difficulties", "Do you experience any difficulties sleeping?", "sleep_difficulties_details")}

          {/* Sleep Routine */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("sleep_routine")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">What is your sleep routine?</label>
              {hoveredField === "sleep_routine" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("sleep_routine")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="sleep_routine"
              placeholder="Describe typical sleep routine..."
              value={formData.sleep_routine || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Sleep Routine Worries */}
          {renderYesNoField("sleep_routine_worries", "Does any aspect of your sleep routine worry you?", "sleep_routine_worries_details")}

          {/* Alcohol/Smoke/Drug Use */}
          {renderYesNoField("alcohol_smoke_drug_use", "Do you consume alcohol, smoke or use illegal drugs? ", "alcohol_smoke_drug_details")}

          {/* Alcohol/Smoke/Drug Worries */}
          {renderYesNoField("alcohol_smoke_drug_worries", "Does your alcohol, smoking or drug use worry you?", "alcohol_smoke_drug_worries_details")}

          {/* Referral Required */}
          {renderYesNoField("referral_required", "Is a referral to support reduction of alcohol, smoking or drug use required?", "referral_required_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_general_health"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}