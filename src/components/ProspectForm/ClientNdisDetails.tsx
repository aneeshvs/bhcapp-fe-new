'use client';
import React from 'react';

interface ClientNdisFormData {
  formData: {
    ndis_plan_approved?: string;
    ndis_number?: string;
    ndis_plan_start_date?: string;
    ndis_plan_end_date?: string;
    plan_manager_name?: string;
    plan_manager_contact_mobile?: string;
    plan_manager_contact_email?: string;
    plan_type?: string;
    copy_of_plan_provided?: string;
    reason_plan_not_provided?: string;
    engagement_concerns?: string;
    engagement_concerns_description?: string;
    // [key: string]: any;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean  } }
  ) => void;
}

export default function ClientNdisDetails({ formData, handleChange }: ClientNdisFormData) {
  return (
    <div className="mb-4 mt-4 border border-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-4 text-heading">5. CLIENT NDIS DETAILS</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NDIS Plan Approved */}
        <div>
          <label className="block mb-1 font-medium text-sm">NDIS Plan Approved</label>
          <div className="flex gap-4">
            {['Yes', 'No', 'Pending'].map((val) => (
              <label key={val} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="ndis_plan_approved"
                  value={val}
                  checked={formData.ndis_plan_approved === val}
                  onChange={handleChange}
                />
                {val}
              </label>
            ))}
          </div>
        </div>

        {/* NDIS Number */}
        <div>
          <label className="block mb-1 font-medium text-sm">NDIS Number</label>
          <input
            type="text"
            name="ndis_number"
            value={formData.ndis_number || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block mb-1 font-medium text-sm">NDIS Plan Start Date</label>
          <input
            type="date"
            name="ndis_plan_start_date"
            value={formData.ndis_plan_start_date || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-1 font-medium text-sm">NDIS Plan End Date</label>
          <input
            type="date"
            name="ndis_plan_end_date"
            value={formData.ndis_plan_end_date || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Plan Manager Name */}
        <div>
          <label className="block mb-1 font-medium text-sm">Plan Manager Name (If Applicable)</label>
          <input
            type="text"
            name="plan_manager_name"
            value={formData.plan_manager_name || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Plan Manager Contact + Email */}
        <div>
          <label className="block mb-1 font-medium text-sm">Plan Manager Contact & Email</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Mobile"
              name="plan_manager_contact_mobile"
              value={formData.plan_manager_contact_mobile || ''}
              onChange={handleChange}
              className="w-1/2 border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              name="plan_manager_contact_email"
              value={formData.plan_manager_contact_email || ''}
              onChange={handleChange}
              className="w-1/2 border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Plan Type */}
        <div>
          <label className="block mb-1 font-medium text-sm">Plan Type</label>
          <div className="flex gap-4">
            {['Plan Managed', 'Agency Managed', 'Self-Managed'].map((val) => (
              <label key={val} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="plan_type"
                  value={val}
                  checked={formData.plan_type === val}
                  onChange={handleChange}
                />
                {val}
              </label>
            ))}
          </div>
        </div>

        {/* Copy of Plan Provided */}
        <div>
          <label className="block mb-1 font-medium text-sm">Is a Copy of the Plan Provided?</label>
          <div className="flex gap-4">
            {['Yes', 'No'].map((val) => (
              <label key={val} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="copy_of_plan_provided"
                  value={val}
                  checked={formData.copy_of_plan_provided === val}
                  onChange={handleChange}
                />
                {val}
              </label>
            ))}
          </div>
        </div>

        {/* Reason Plan Not Provided */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">If No, Why?</label>
          <textarea
            name="reason_plan_not_provided"
            value={formData.reason_plan_not_provided || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Engagement Concerns */}
        <div>
          <label className="block mb-1 font-medium text-sm">
            Are there any Concerns that Might Impact Clients Ability to Engage?
          </label>
          <div className="flex gap-4">
            {['Yes', 'No', 'Not Sure'].map((val) => (
              <label key={val} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="engagement_concerns"
                  value={val}
                  checked={formData.engagement_concerns === val}
                  onChange={handleChange}
                />
                {val}
              </label>
            ))}
          </div>
        </div>

        {/* Engagement Description */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">If Yes, Please Describe</label>
          <textarea
            name="engagement_concerns_description"
            value={formData.engagement_concerns_description || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
