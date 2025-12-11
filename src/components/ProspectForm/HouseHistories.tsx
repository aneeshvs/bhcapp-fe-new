'use client';
import React from 'react';

export interface HouseHistory {
  formData: {
    most_recent_housing?: string;
    prior_housing?: string;
    mental_health_service?: number;
    aboriginal_service?: number;
    communities_and_justice?: number;
    family_violence?: number;
    correctional_service?: number;
    child_protection?: number;
    drug_alcohol_rehabilitation?: number;
    other_services_involved?: number;
    other_services_description?: string;
    services_background_info?: string;
    services_contact_details?: string;
    issue_mental_health?: number;
    issue_drug_alcohol?: number;
    issue_family_violence?: number;
    issue_police_involvement?: number;
    issue_child_protection?: number;
    issue_child_custody?: number;
    issue_other_description?: string;
    // [key: string]: any;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean  } }
  ) => void;
}

export default function HouseHistories({ formData, handleChange }: HouseHistory) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    handleChange({ target: { name, value: checked ? 1 : 0 } });
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-4 text-heading">6. HOUSING HISTORY & SERVICES</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Housing Details */}
        <div>
          <label className="block mb-1 font-medium text-sm">Most Recent Housing</label>
          <input
            type="text"
            name="most_recent_housing"
            value={formData.most_recent_housing || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">Prior Housing</label>
          <input
            type="text"
            name="prior_housing"
            value={formData.prior_housing || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Services Involved */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">Services Previously Involved</label>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'mental_health_service', label: 'Mental Health Service' },
              { name: 'aboriginal_service', label: 'Aboriginal Services' },
              { name: 'communities_and_justice', label: 'Department of Communities and Justice' },
              { name: 'family_violence', label: 'Family Violence' },
              { name: 'correctional_service', label: 'Correctional Services' },
              { name: 'child_protection', label: 'Child Protection' },
              { name: 'drug_alcohol_rehabilitation', label: 'Drug/Alcohol Rehabilitation' },
              { name: 'other_services_involved', label: 'Other' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name as keyof typeof formData] === 1}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {formData.other_services_involved === 1 && (
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-sm">Please Specify Other Services</label>
            <input
              type="text"
              name="other_services_description"
              value={formData.other_services_description || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        )}

        {/* Background Info */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">Where Indicated Above, Please Provide Background Information</label>
          <textarea
            name="services_background_info"
            value={formData.services_background_info || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Contact Details */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">Where Indicated Above, Please Provide Contact Details</label>
          <textarea
            name="services_contact_details"
            value={formData.services_contact_details || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Issues Faced */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">Are there any Known Issues For:</label>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'issue_mental_health', label: 'Mental Health' },
              { name: 'issue_drug_alcohol', label: 'Drug/Alcohol' },
              { name: 'issue_family_violence', label: 'Family Violence' },
              { name: 'issue_police_involvement', label: 'Police Involvement' },
              { name: 'issue_child_protection', label: 'Child Protection' },
              { name: 'issue_child_custody', label: 'Child Custody' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name as keyof typeof formData] === 1}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Other Issue Description */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">Other Issues (if any)</label>
          <input
            type="text"
            name="issue_other_description"
            value={formData.issue_other_description || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
