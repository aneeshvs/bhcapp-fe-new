"use client";

import React, { useState } from "react";
import SingleSignaturePad from "./SingleSignaturePad";

interface ReviewSignaturesData {
  signer_type?: string;
  participant_name?: string;
  participant_date?: string;
  participant_signature?: string;
  representative_name?: string;
  representative_relation?: string;
  representative_date?: string;
  representative_signature?: string;
  guardian_nominee_name?: string;
  guardian_nominee_date?: string;
  guardian_nominee_signature?: string;
  key_team_member_name?: string;
  key_team_member_date?: string;
  key_team_member_signature?: string;
  date?: string;
  client?: string;
  guardian_nominee?: string;
  key_team_member?: string;
  acknowledgement?: string;
}

interface ReviewSignaturesSectionProps {
  data: ReviewSignaturesData;
  onChange: (field: string, value: string) => void;
  readOnly?: boolean;
  onViewLogs?: (fieldName: string) => void;
  showAcknowledgement?: boolean;
}

const ReviewSignaturesSection: React.FC<ReviewSignaturesSectionProps> = ({
  data,
  onChange,
  readOnly = false,
  onViewLogs,
  showAcknowledgement = false,
}) => {
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const signerType = data.signer_type || "participant";

  return (
    <div className="space-y-6" id="review-signatures-section">
      {/* Optional Acknowledgement Section */}
      {(showAcknowledgement || data.acknowledgement !== undefined) && (
        <div className="bg-white p-5 border rounded-lg shadow-sm space-y-3">
          <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">Acknowledgement</h4>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="acknowledgement"
              checked={data.acknowledgement === "Yes"}
              onChange={(e) =>
                !readOnly && onChange("acknowledgement", e.target.checked ? "Yes" : "No")
              }
              disabled={readOnly}
              className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-slate-700">
              I confirm that I have received and understood this Residency Handbook.
            </span>
          </label>
        </div>
      )}

      {/* Signer Type Radio Choice */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center bg-gray-50 p-4 border rounded shadow-sm">
        <span className="font-semibold text-gray-800">Signing As:</span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            name="signer_type"
            value="participant"
            checked={signerType === "participant"}
            onChange={() => !readOnly && onChange("signer_type", "participant")}
            disabled={readOnly}
            className="form-radio text-blue-600 h-4 w-4"
          />
          <span className="ml-2 font-medium text-gray-700">Participant</span>
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            name="signer_type"
            value="representative"
            checked={signerType === "representative"}
            onChange={() => !readOnly && onChange("signer_type", "representative")}
            disabled={readOnly}
            className="form-radio text-blue-600 h-4 w-4"
          />
          <span className="ml-2 font-medium text-gray-700">Representative</span>
        </label>
      </div>

      {/* Conditional: Participant vs Representative Details */}
      {signerType === "participant" ? (
        <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
          <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">Participant Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("rev_sig_participant_name")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Participant Name</label>
                {hoveredField === "rev_sig_participant_name" && onViewLogs && (
                  <button
                    type="button"
                    onClick={() => onViewLogs("rev_sig_participant_name")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                value={data.participant_name ?? data.client ?? ""}
                onChange={(e) => onChange("participant_name", e.target.value)}
                disabled={readOnly}
                placeholder="Enter participant name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
              />
            </div>

            <div
              className="relative"
              onMouseEnter={() => setHoveredField("rev_sig_participant_date")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                {hoveredField === "rev_sig_participant_date" && onViewLogs && (
                  <button
                    type="button"
                    onClick={() => onViewLogs("rev_sig_participant_date")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="date"
                value={data.participant_date ?? data.date ?? ""}
                onChange={(e) => onChange("participant_date", e.target.value)}
                disabled={readOnly}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
          <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">Representative Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("rev_sig_representative_name")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Representative Name</label>
                {hoveredField === "rev_sig_representative_name" && onViewLogs && (
                  <button
                    type="button"
                    onClick={() => onViewLogs("rev_sig_representative_name")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                value={data.representative_name || ""}
                onChange={(e) => onChange("representative_name", e.target.value)}
                disabled={readOnly}
                placeholder="Enter representative name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
              />
            </div>

            <div
              className="relative"
              onMouseEnter={() => setHoveredField("rev_sig_representative_relation")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Relation to the participant</label>
                {hoveredField === "rev_sig_representative_relation" && onViewLogs && (
                  <button
                    type="button"
                    onClick={() => onViewLogs("rev_sig_representative_relation")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                value={data.representative_relation || ""}
                onChange={(e) => onChange("representative_relation", e.target.value)}
                disabled={readOnly}
                placeholder="e.g. Parent, Advocate"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
              />
            </div>

            <div
              className="relative"
              onMouseEnter={() => setHoveredField("rev_sig_representative_date")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                {hoveredField === "rev_sig_representative_date" && onViewLogs && (
                  <button
                    type="button"
                    onClick={() => onViewLogs("rev_sig_representative_date")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="date"
                value={data.representative_date ?? data.date ?? ""}
                onChange={(e) => onChange("representative_date", e.target.value)}
                disabled={readOnly}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Signature Pad for Participant / Representative */}
      <div className="bg-white p-5 border rounded-lg shadow-sm">
        <SingleSignaturePad
          label={signerType === "participant" ? "Participant Signature" : "Representative Signature"}
          elementId={signerType === "participant" ? "participant-signature-pad" : "representative-signature-pad"}
          value={
            signerType === "representative"
              ? data.representative_signature || data.participant_signature || ""
              : data.participant_signature || ""
          }
          disabled={readOnly}
          onChange={(val) => {
            if (signerType === "representative") {
              onChange("representative_signature", val);
              onChange("participant_signature", val);
            } else {
              onChange("participant_signature", val);
            }
          }}
        />
      </div>

      {/* Guardian / Nominee Section */}
      <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
        <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">Guardian / Nominee</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("rev_sig_guardian_nominee_name")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Guardian/Nominee Name</label>
              {hoveredField === "rev_sig_guardian_nominee_name" && onViewLogs && (
                <button
                  type="button"
                  onClick={() => onViewLogs("rev_sig_guardian_nominee_name")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              value={data.guardian_nominee_name ?? data.guardian_nominee ?? ""}
              onChange={(e) => onChange("guardian_nominee_name", e.target.value)}
              disabled={readOnly}
              placeholder="Enter guardian/nominee name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            />
          </div>

          <div
            className="relative"
            onMouseEnter={() => setHoveredField("rev_sig_guardian_nominee_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              {hoveredField === "rev_sig_guardian_nominee_date" && onViewLogs && (
                <button
                  type="button"
                  onClick={() => onViewLogs("rev_sig_guardian_nominee_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="date"
              value={data.guardian_nominee_date ?? data.date ?? ""}
              onChange={(e) => onChange("guardian_nominee_date", e.target.value)}
              disabled={readOnly}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            />
          </div>
        </div>

        <SingleSignaturePad
          label="Guardian / Nominee Signature"
          elementId="guardian-signature-pad"
          value={data.guardian_nominee_signature || ""}
          disabled={readOnly}
          onChange={(val) => onChange("guardian_nominee_signature", val)}
        />
      </div>

      {/* Key Team Member Section */}
      <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
        <h4 className="font-semibold text-lg text-gray-800 border-b pb-2">Key Team Member</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("rev_sig_key_team_member_name")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Key Team Member Name</label>
              {hoveredField === "rev_sig_key_team_member_name" && onViewLogs && (
                <button
                  type="button"
                  onClick={() => onViewLogs("rev_sig_key_team_member_name")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              value={data.key_team_member_name ?? data.key_team_member ?? ""}
              onChange={(e) => onChange("key_team_member_name", e.target.value)}
              disabled={readOnly}
              placeholder="Enter key team member name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            />
          </div>

          <div
            className="relative"
            onMouseEnter={() => setHoveredField("rev_sig_key_team_member_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              {hoveredField === "rev_sig_key_team_member_date" && onViewLogs && (
                <button
                  type="button"
                  onClick={() => onViewLogs("rev_sig_key_team_member_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="date"
              value={data.key_team_member_date ?? data.date ?? ""}
              onChange={(e) => onChange("key_team_member_date", e.target.value)}
              disabled={readOnly}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            />
          </div>
        </div>

        <SingleSignaturePad
          label="Key Team Member Signature"
          elementId="key-team-signature-pad"
          value={data.key_team_member_signature || ""}
          disabled={readOnly}
          onChange={(val) => onChange("key_team_member_signature", val)}
        />
      </div>
    </div>
  );
};

export default ReviewSignaturesSection;
