"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface PreConsentDisclosure {
  discuss_referral_services?: number;
  explain_release_agreement?: number;
  explain_share_without_consent?: number;
  provide_privacy_information?: number;
}

interface PreConsentDisclosuresProps {
  formData: PreConsentDisclosure;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function PreConsentDisclosures({
  formData,
  handleChange,
  uuid,
}: PreConsentDisclosuresProps) {
  const searchParams = useSearchParams();
  const urlUuid = searchParams.get("uuid");
  const effectiveUuid = uuid || urlUuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

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

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          CONSENT DISCLOSURE
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
          <div className="text-gray-700 space-y-3 w-full">
            <p className="text-gray-600 mb-4">
              <b>
                To ensure the participant can make an informed decision about
                consent to disclose their information, the organisation should
                complete these steps, (tick when completed).
              </b>
            </p>
          </div>
        </div>
        {/* Discuss Referral Services */}
        <div
          className="relative mb-4"
          onMouseEnter={() => setHoveredField("discuss_referral_services")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">
              Discuss with the participant the proposed referral to other services/agencies.
            </label>
            {hoveredField === "discuss_referral_services" && (
              <button
                type="button"
                onClick={() => handleViewLogs("discuss_referral_services")}
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
                  name="discuss_referral_services"
                  value={value}
                  checked={formData.discuss_referral_services === value}
                  onChange={handleRadioNumberChange}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Explain Release Agreement */}
        <div
          className="relative mb-4"
          onMouseEnter={() => setHoveredField("explain_release_agreement")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">
              Explain that the participant’s information will only be released if the participant has agreed and advise that services will still be provided even if the participant does not want information disclosed.
            </label>
            {hoveredField === "explain_release_agreement" && (
              <button
                type="button"
                onClick={() => handleViewLogs("explain_release_agreement")}
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
                  name="explain_release_agreement"
                  value={value}
                  checked={formData.explain_release_agreement === value}
                  onChange={handleRadioNumberChange}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Explain Share Without Consent */}
        <div
          className="relative mb-4"
          onMouseEnter={() => setHoveredField("explain_share_without_consent")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">
              Explain that information will be shared without consent if there is a serious threat to the health or safety of person(s), to report illegal activity or is required under law.
            </label>
            {hoveredField === "explain_share_without_consent" && (
              <button
                type="button"
                onClick={() => handleViewLogs("explain_share_without_consent")}
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
                  name="explain_share_without_consent"
                  value={value}
                  checked={formData.explain_share_without_consent === value}
                  onChange={handleRadioNumberChange}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Provide Privacy Information */}
        <div
          className="relative mb-4"
          onMouseEnter={() => setHoveredField("provide_privacy_information")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">
              Provide the participant with information about privacy if requested.
            </label>
            {hoveredField === "provide_privacy_information" && (
              <button
                type="button"
                onClick={() => handleViewLogs("provide_privacy_information")}
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
                  name="provide_privacy_information"
                  value={value}
                  checked={formData.provide_privacy_information === value}
                  onChange={handleRadioNumberChange}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="pre_consent_disclosure"
        field={selectedField}
        url="confidential-form/logs"
      />
    </div>
  );
}
