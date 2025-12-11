'use client';
import React from 'react';

export interface Independent {
  formData: {
    rent_per_week?: number;
    utilities_per_week?: number;
    needs_furnished: number;
    owns_furniture: number;
    lease_duration?: string;
    can_pay_bond_upfront: number;
    preferred_location?: string;
    living_preference?: string;
    share_preferences?: string;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean  } }
  ) => void;
}

export default function IndependentLiving({ formData, handleChange }: Independent) {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({ target: { name, value: value === 'Yes' ? 1 : 0 } });
  };

  return (
    <div className="mb-4 mt-4 border-gray-300 border-gray-300-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-4 text-heading">10. INDEPENDENT LIVING OPTIONS (ILO)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rent & Utilities */}
        <div>
          <label className="form-label font-medium mb-1 block">Rent per Week</label>
          <input
            type="number"
            name="rent_per_week"
            value={formData.rent_per_week || ''}
            onChange={handleChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="form-label font-medium mb-1 block">Utilities per Week</label>
          <input
            type="number"
            name="utilities_per_week"
            value={formData.utilities_per_week || ''}
            onChange={handleChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter amount"
          />
        </div>

        {/* Furnished */}
        <div>
          <label className="form-label font-medium mb-1 block">Require fully furnished accommodation?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="needs_furnished"
                value="Yes"
                checked={formData.needs_furnished === 1}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="needs_furnished"
                value="No"
                checked={formData.needs_furnished === 0}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
        </div>

        {/* Own furniture */}
        <div>
          <label className="form-label font-medium mb-1 block">Do you own your own furniture?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="owns_furniture"
                value="Yes"
                checked={formData.owns_furniture === 1}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="owns_furniture"
                value="No"
                checked={formData.owns_furniture === 0}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
        </div>

        {/* Lease Duration */}
        <div>
          <label className="form-label font-medium mb-1 block">Lease Duration</label>
          <input
            type="text"
            name="lease_duration"
            value={formData.lease_duration || ''}
            onChange={handleChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g., 6 months"
          />
        </div>

        {/* Bond & Rent */}
        <div>
          <label className="form-label font-medium mb-1 block">Can you pay bond & rent in advance?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="can_pay_bond_upfront"
                value="Yes"
                checked={formData.can_pay_bond_upfront === 1}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="can_pay_bond_upfront"
                value="No"
                checked={formData.can_pay_bond_upfront === 0}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
        </div>

        {/* Preferred Location */}
        <div className="md:col-span-2">
          <label className="form-label font-medium mb-1 block">Preferred Location</label>
          <input
            type="text"
            name="preferred_location"
            value={formData.preferred_location || ''}
            onChange={handleChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter preferred location"
          />
        </div>

        {/* Living Preference */}
        <div className="md:col-span-2">
          <label className="form-label font-medium mb-1 block">Living Preference</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="living_preference"
                value="On Your Own"
                checked={formData.living_preference === 'On Your Own'}
                onChange={handleChange}
              />
              On Your Own
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="living_preference"
                value="Share"
                checked={formData.living_preference === 'Share'}
                onChange={handleChange}
              />
              Share
            </label>
          </div>
        </div>

        {/* Sharing Preferences */}
        {formData.living_preference === 'Share' && (
          <div className="md:col-span-2">
            <label className="form-label font-medium mb-1 block">Sharing Preferences (gender, age, etc.)</label>
            <textarea
              name="share_preferences"
              value={formData.share_preferences || ''}
              onChange={handleChange}
              className="form-textarea w-full border-gray-300 rounded px-3 py-2"
              placeholder="Enter sharing preferences"
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
}
