import React from "react";
import { SectionProps } from "../types";

const FormDetailsSection: React.FC<SectionProps> = ({ formData, handleChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-6">
      {/* Document Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 p-4 border border-blue-200 rounded-lg mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Food Preference Consent Form</h3>
          <p className="text-sm text-slate-600">SIL Document No: Internal Form-F34</p>
        </div>
      </div>

      {/* Participant Statement */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
        <label className="block text-sm font-semibold text-slate-800">
          Consent Statement:
        </label>
        <div className="text-sm text-slate-700 leading-relaxed">
          <p>
            I,{" "}
            <input
              type="text"
              name="participant_name"
              value={formData.participant_name || ""}
              onChange={handleChange}
              placeholder="Enter participant name"
              className="inline-block border-b-2 border-blue-500 bg-white px-2 py-1 mx-1 font-semibold text-blue-900 focus:outline-none focus:border-blue-700 rounded-t"
            />{" "}
            hereby acknowledge and provide consent for my food preferences as follows:
          </p>
        </div>
      </div>

      {/* Option 1: Best of Homecare Support for Menu Plan */}
      <div className="space-y-4 bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
        <label className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition">
          <input
            type="checkbox"
            name="support_for_menu_plan"
            checked={!!formData.support_for_menu_plan}
            onChange={(e) => handleChange({ target: { name: "support_for_menu_plan", value: e.target.checked } })}
            className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-800 leading-relaxed">
            <strong>Best of Homecare Support for Menu Plan:</strong> I confirm that I am presently under the care of the Best of Homecare team for my overall health. I agree to collaborate with them, as well as other residents, to determine the house menu for the week. The BHC food menu strives to align with clients&apos; preferences as well as meeting optimum health considerations.
          </span>
        </label>

        <div className="ml-10 space-y-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded border border-slate-100">
          <p>
            In situations where clients cannot specify their preferences, we will seek assistance from the NOK or guardian to determine the menu schedule.
          </p>
          <p>
            <strong>Health Considerations:</strong> I understand that main meals are based on nutritional value, and that should I choose to eat unhealthy food, this will be consumed outside of the household main menu plan.
          </p>
          <p>
            <strong>Communication:</strong> I agree to maintain open and honest communication with the Best of Homecare team regarding my food preferences and any concerns related to my diet.
          </p>
        </div>
      </div>

      {/* Option 2: Revocation of Consent */}
      <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
        <label className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition">
          <input
            type="checkbox"
            name="revocation_of_consent"
            checked={!!formData.revocation_of_consent}
            onChange={(e) => handleChange({ target: { name: "revocation_of_consent", value: e.target.checked } })}
            className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-800 leading-relaxed">
            <strong>Revocation of Consent:</strong> I do not wish to follow the BHC Menu Plan and would prefer to follow my diet.
          </span>
        </label>
      </div>
    </div>
  );
};

export default FormDetailsSection;
