import React from "react";
import { SectionProps } from "../types";

const FormDetailsSection: React.FC<SectionProps> = ({ formData, handleChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-6">
      {/* Document Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 p-4 border border-blue-200 rounded-lg mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Medicine Administration Consent Form</h3>
          <p className="text-sm text-slate-600">Document No: Form-F20</p>
        </div>
      </div>

      {/* Confirmation text & Participant Name */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
        <label className="block text-sm font-semibold text-slate-800">
          Participant Statement:
        </label>
        <div className="text-sm text-slate-700 leading-relaxed space-y-2">
          <p>
            I{" "}
            <input
              type="text"
              name="participant_name"
              value={formData.participant_name || ""}
              onChange={handleChange}
              placeholder="Enter participant name"
              className="inline-block border-b-2 border-blue-500 bg-white px-2 py-1 mx-1 font-semibold text-blue-900 focus:outline-none focus:border-blue-700 rounded-t"
            />{" "}
            confirm that I require medicine to be taken in accordance with medical advice. I give consent to Best of Homecare to administer my medicine as per the instructions on the medication label and contact the prescriber or pharmacy if there are any administration concerns.
          </p>
        </div>
      </div>

      {/* Action Choices */}
      <div className="space-y-4">
        <h4 className="font-bold text-slate-800 text-base">
          Which of the following actions you would like Best of Homecare to carry out.
        </h4>

        <div className="space-y-3 bg-white p-4 border border-slate-200 rounded-lg">
          <label className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition">
            <input
              type="checkbox"
              name="medication_support"
              checked={!!formData.medication_support}
              onChange={(e) => handleChange({ target: { name: "medication_support", value: e.target.checked } })}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 leading-relaxed">
              Provide <strong>medication support</strong> which may involve reminding or prompting me to take my medicine or assisting me to open medicine containers.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition">
            <input
              type="checkbox"
              name="medication_assistance"
              checked={!!formData.medication_assistance}
              onChange={(e) => handleChange({ target: { name: "medication_assistance", value: e.target.checked } })}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 leading-relaxed">
              Provide <strong>medication assistance</strong> which may involve storing medicine, opening medicine containers, removing the prescribed dose from the medication containers, and administering the medicine as per instructions.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition">
            <input
              type="checkbox"
              name="manage_medication_self"
              checked={!!formData.manage_medication_self}
              onChange={(e) => handleChange({ target: { name: "manage_medication_self", value: e.target.checked } })}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 leading-relaxed">
              I would like to <strong>manage my medication by myself</strong>.
            </span>
          </label>
        </div>
      </div>

      {/* Declaration by Best of Homecare */}
      <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-3">
        <h4 className="font-bold text-slate-800 text-sm">
          Declaration by Best of Homecare:
        </h4>
        <ol className="list-lower-alpha list-inside text-sm text-slate-700 space-y-2 pl-2">
          <li className="leading-relaxed">
            A suitably qualified staff member will provide support or assistance with medication when given consent by the participant.
          </li>
          <li className="leading-relaxed">
            Best of Homecare staff will record all instances of medicine administration on the participant&apos;s chart.
          </li>
          <li className="leading-relaxed">
            Best of Homecare staff will ensure that the storage of medicines where they are responsible is appropriate for each medicine and all medicines are kept safely and securely.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default FormDetailsSection;
