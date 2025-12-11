'use client';
import React, { useState } from 'react';

interface ClientMedicalInfoProps {
  formData: {
    primary_disability?: string;
    secondary_disability?: string;
    requires_high_intensity_support?: number;
    complex_bowel_care?: number;
    enteral_feeding?: number;
    tracheostomy_care?: number;
    urinary_catheters?: number;
    ventilation?: number;
    subcutaneous_injections?: number;
    communication_method?: string;
    communication_assessment?: string;
    occupational_therapy_assessment?: string;
    hoisting?: number;
    assisted_devices?: number;
    mobility_other?: string;
    hospital_bed?: number;
    pressure_mattresses?: number;
    equipment_other?: string;
    challenging_behaviours?: string;
    pbsp_attached?: number;
    pbsp_required?: number;
    pbsp_review_requested?: number;
    behaviour_support_practitioner_contact?: string;
    other: number;
    // [key: string]: any;
  };
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string | number | boolean  } }
  ) => void;
}

export default function ClientMedicalInfo({ formData, handleChange }: ClientMedicalInfoProps) {
  const [localFormData, setLocalFormData] = useState({
    complex_bowel_care: formData.complex_bowel_care || 0,
    enteral_feeding: formData.enteral_feeding || 0,
    tracheostomy_care: formData.tracheostomy_care || 0,
    urinary_catheters: formData.urinary_catheters || 0,
    ventilation: formData.ventilation || 0,
    subcutaneous_injections: formData.subcutaneous_injections || 0,
    hospital_bed: formData.hospital_bed || 0,
    pressure_mattresses: formData.pressure_mattresses || 0,
    equipment_other: formData.equipment_other || 0,
    hoisting: formData.hoisting || 0,
    assisted_devices: formData.assisted_devices || 0,
    other: formData.other || 0,
  });

  const handle1Change = (name: string, value: string | number | boolean ) => {
    handleChange({ target: { name, value } });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;
    const newLocalFormData = {
      ...localFormData,
      [name]: newValue,
    };
    setLocalFormData(newLocalFormData);
    handle1Change(name, newValue);

    // const anyChecked = Object.values(newLocalFormData).some((val) => val === 1);
    // handle1Change('requires_high_intensity_support', anyChecked ? 1 : 0);
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-heading">6. CLIENT MEDICAL INFORMATION</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-sm">Primary Disability</label>
          <input
            type="text"
            name="primary_disability"
            value={formData.primary_disability || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Secondary Disability</label>
          <input
            type="text"
            name="secondary_disability"
            value={formData.secondary_disability || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* High Intensity Support */}
        <div className="md:col-span-2 space-y-2">
          <label className="block mb-1 font-medium text-sm">Does the Participant Require High-Intensity Support?</label>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'complex_bowel_care', label: 'Complex Bowel Care' },
              { name: 'enteral_feeding', label: 'Enteral Feeding' },
              { name: 'tracheostomy_care', label: 'Tracheostomy Care' },
              { name: 'urinary_catheters', label: 'Urinary Catheters' },
              { name: 'ventilation', label: 'Ventilation' },
              { name: 'subcutaneous_injection', label: 'Subcutaneous Injection' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={localFormData[name as keyof typeof localFormData] === 1}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Communication (e.g., Verbal, Sign)</label>
          <input
            type="text"
            name="communication_method"
            value={formData.communication_method || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Communication Assessment</label>
          <div className="flex gap-4">
            {['Completed and Attached', 'Not Available'].map((val) => (
              <label key={val} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="communication_assessment"
                  value={val}
                  checked={formData.communication_assessment === val}
                  onChange={handleChange}
                />
                {val}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Occupational Therapy Assessment</label>
          <div className="flex gap-4">
            {['Completed and Attached', 'Not Available'].map((val) => (
              <label key={val} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="occupational_therapy_assessment"
                  value={val}
                  checked={formData.occupational_therapy_assessment === val}
                  onChange={handleChange}
                />
                {val}
              </label>
            ))}
          </div>
        </div>

        {/* Equipment Support */}
        <div>
            <div className="md:col-span-2 space-y-2">
            <label className="block mb-1 font-medium text-sm">Equipment Support</label>
            <div className="flex flex-wrap gap-4">
                {[
                { name: 'hospital_bed', label: 'Hospital Bed' },
                { name: 'pressure_mattresses', label: 'Pressure Mattresses' },
                { name: 'equipment_other', label: 'Other Equipment' },
                ].map(({ name, label }) => (
                <label key={name} className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    name={name}
                    checked={localFormData[name as keyof typeof localFormData] === 1}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4"
                    />
                    {label}
                </label>
                ))}
            </div>
            </div>
        </div>
        {/* Mobility Aids */}
        <div>
            <div className="md:col-span-2 space-y-2">
                <label className="block mb-1 font-medium text-sm">Mobility Aids</label>

                <div className="flex flex-wrap gap-4 items-center">
                    {/* Other checkboxes */}
                    {[
                    { name: 'hoisting', label: 'Complex Hoisting Care' },
                    { name: 'assisted_devices', label: 'Assisted Devices' },
                    ].map(({ name, label }) => (
                    <label key={name} className="flex items-center gap-2">
                        <input
                        type="checkbox"
                        name={name}
                        checked={localFormData[name as keyof typeof localFormData] === 1}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4"
                        />
                        {label}
                    </label>
                    ))}

                    {/* Other checkbox + input together */}
                    <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="other"
                        checked={localFormData.other === 1}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4"
                    />
                    <label className="mr-2">Other</label>

                    {localFormData.other === 1 && (
                        <input
                        type="text"
                        name="mobility_other"
                        value={formData.mobility_other || ''}
                        onChange={handleChange}
                        placeholder="Please specify"
                        className="border border-gray-300 rounded px-2 py-1"
                        />
                    )}
                    </div>
                </div>
            </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">
            Challenging Behaviours (e.g., Aggressive, Absconding)
          </label>
          <input
            type="text"
            name="challenging_behaviours"
            value={formData.challenging_behaviours || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* PBSP Section */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">Is there a Positive Behaviour Support Plan (PBSP)?</label>
          <div className="flex gap-4">
            {[
              { label: 'Yes, Please Attach a Copy', value: 1 },
              { label: 'No', value: 0 },
            ].map(({ label, value }) => (
              <label key={label} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pbsp_attached"
                  value={value}
                  checked={formData.pbsp_attached === value}
                  onChange={() => handleChange({ target: { name: 'pbsp_attached', value } })}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">If No, Is a PBSP Required?</label>
          <div className="flex gap-4">
            {[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }].map(({ label, value }) => (
              <label key={label} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pbsp_required"
                  value={value}
                  checked={formData.pbsp_required === value}
                  onChange={() => handleChange({ target: { name: 'pbsp_required', value } })}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">If Yes, Has a PBSP Review been Requested?</label>
          <div className="flex gap-4">
            {[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }].map(({ label, value }) => (
              <label key={label} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pbsp_review_requested"
                  value={value}
                  checked={formData.pbsp_review_requested === value}
                  onChange={() => handleChange({ target: { name: 'pbsp_review_requested', value } })}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Behaviour Support Practitioner Contact */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">Behaviour Support Practitioner Contact Details</label>
          <textarea
            name="behaviour_support_practitioner_contact"
            value={formData.behaviour_support_practitioner_contact || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          ></textarea>
        </div>

      </div>
    </div>
  );
}
