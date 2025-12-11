'use client';
import React from 'react';

export interface RosterOfCareProps {
  formData: {
    need_bhc_community_support: number;
    comments: string;
    transport_funding: number;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean  } }
  ) => void;
}

export default function RosterOfCare({ formData, handleChange }: RosterOfCareProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    handleChange({ target: { name, value: checked ? 1 : 0 } });
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-4 text-heading">8. ROSTER OF CARE (SIL or OTHER)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BHC Support for Community Activities */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">
            Do you need BHC support to participate in community activities?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="need_bhc_community_support"
                checked={formData.need_bhc_community_support === 1}
                onChange={handleCheckboxChange}
                className="w-4 h-4"
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="need_bhc_community_support"
                checked={formData.need_bhc_community_support === 0}
                onChange={handleCheckboxChange}
                className="w-4 h-4"
              />
              No
            </label>
          </div>
        </div>

        {/* Comments */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">Comments</label>
          <textarea
            name="comments"
            value={formData.comments || ''}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Transport Funding */}
        <div>
          <label className="block mb-1 font-medium text-sm">Transport Funding Available ($)</label>
          <input
            type="number"
            name="transport_funding"
            value={formData.transport_funding || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
