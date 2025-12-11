"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import DatePickerSaveMany from "../../DatePickerSaveMany";

interface InformationFormData {
  participant_name?: string;
  address?: string;
  post_code?: string;
  date_of_birth?: string;
  phone?: string;
  email?: string;
  mobile_no?: string;
}

interface InformationFormProps {
  formData: InformationFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function InformationForm({
  formData,
  handleChange,
  uuid,
}: InformationFormProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value,
      },
    });
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading uppercase">
          PARTICIPANT DETAILS
        </h4>
      </div>
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          <div className="border-b pb-4">
            {/* Participant Name */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("participant_name")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Participant Name</label>
                {hoveredField === "participant_name" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("participant_name")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="participant_name"
                value={formData.participant_name || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter participant name"
              />
            </div>

            {/* Address */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("address")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Address</label>
                {hoveredField === "address" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("address")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            {/* Post Code */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("post_code")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Post Code</label>
                {hoveredField === "post_code" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("post_code")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="post_code"
                value={formData.post_code || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post code"
                maxLength={10}
              />
            </div>

            {/* Date of Birth */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("date_of_birth")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Date of Birth</label>
                {hoveredField === "date_of_birth" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("date_of_birth")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <DatePickerSaveMany
                name="date_of_birth"
                value={formData.date_of_birth || null}
                onChange={handleChange}
              />
              {/* <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}
            </div>

            {/* Phone */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("phone")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Phone</label>
                {hoveredField === "phone" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("phone")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            {/* Email */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("email")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Email</label>
                {hoveredField === "email" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("email")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>

            {/* Mobile No */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("mobile_no")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Mobile Number</label>
                {hoveredField === "mobile_no" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("mobile_no")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="tel"
                name="mobile_no"
                value={formData.mobile_no || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter mobile number"
              />
            </div>
          </div>
          <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
            <div className="text-gray-700 space-y-3 w-full">
              <p className="text-gray-600 mb-4"><b>
                The organisation will comply with relevant privacy legislation and in the standards set for dealing with personal information outlined in our policy, practice guidelines and procedures
                Please discuss the following statement with Participants before proceeding:</b>
              </p>
              <ul className="list-disc ml-6">
                <li>If your information is required by law, your information may be shared without your consent.</li>
                <li>Information can include data that is held in audio/visual format being photos or any other recorded material.</li>
                <li>This consent form includes your permission for BHC to provide care/treatment described in the Goal Plan or Support Plan.</li>
                <li>This consent form includes your permission to conduct surveillance within the common areas of your SIL home. Surveillance does not occur in bedrooms or private spaces. The purpose of the surveillance is for participant and worker safety. This footage may be reviewed during an incident investigation. Video surveillance is stored for a period of 30 days unless the video footage is in relation to a complaint or incident in which the footage could be stored for up to 7 years.</li>
                <li>If your information is required by law, your information may be shared without your consent.</li>
                <li>Information can include data that is held in audio/visual format being photos or any other recorded material.</li>
                <li>This consent form includes your permission for BHC to provide care/treatment described in the Goal Plan or Support Plan.</li>
                <li>This consent form includes your permission to conduct surveillance within the common areas of your SIL home. Surveillance does not occur in bedrooms or private spaces. The purpose of the surveillance is for participant and worker safety. This footage may be reviewed during an incident investigation. Video surveillance is stored for a period of 30 days unless the video footage is in relation to a complaint or incident in which the footage could be stored for up to 7 years.</li>
                <li>The organisation will only collect personal information, and details regarding my health, that is necessary for them to deliver a service to me.</li>
                <li>The organisation will take all necessary steps to protect my right to privacy and confidentiality when collecting my personal information. All information collected will be handled and maintained in a secure environment.</li>
                <li>I am aware that my personal information and details will be stored electronically.</li>
                <li>I have the right to request to see my records and to request a correction if I believe the information is wrong.</li>
                <li>I have identified below any other individuals/services which I give informed consent for the organisation to contact on my behalf.</li>
                <li>I may cancel all or part of this agreement at any time, by advising the organization.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="confidential_information_form" // Update with your actual table name
        field={selectedField}
        url="confidential-form/logs" // Update with your actual logs URL
      />
    </div>
  );
}