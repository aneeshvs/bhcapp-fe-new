"use client";
import React, { useState } from "react";
import { SilResidencyHandbookData } from "./types";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface Props {
  formData: SilResidencyHandbookData;
  handleChange: (e: { target: { name: string; value: any } }) => void;
  uuid?: string;
  readOnly?: boolean;
}

export default function SilResidencyHandbookSection({
  formData,
  handleChange,
  uuid,
  readOnly = false,
}: Props) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6 text-slate-800">
      {/* 1. Welcome */}
      <div className="border border-slate-200 rounded-md p-5 bg-slate-50 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1">Welcome</h2>
        <p className="text-sm leading-relaxed">
          Welcome to your home and to Supported Independent Living (SIL) supports provided by Best of Homecare.
        </p>
        <p className="text-sm leading-relaxed">
          This handbook explains your rights, responsibilities, tenancy arrangements, supports, safety processes, and how to raise concerns. It is designed to help you understand how services are delivered in your home.
        </p>
        <p className="text-sm leading-relaxed">
          Information will always be provided in a way that is easy to understand and appropriate to your communication needs.
        </p>
      </div>

      {/* 2. Your Rights */}
      <div className="border border-slate-200 rounded-md p-5 bg-slate-50 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1">Your Rights</h2>
        <p className="text-sm font-medium">You have the right to:</p>
        <ul className="list-disc list-inside text-sm space-y-1 text-slate-700 pl-2">
          <li>Be treated with dignity, respect, and fairness</li>
          <li>Make your own choices and decisions</li>
          <li>Live safely in your home</li>
          <li>Receive person-centred supports</li>
          <li>Have privacy in your home and personal space</li>
          <li>Have visitors</li>
          <li>Access advocacy and support people</li>
          <li>Make complaints without fear of disadvantage</li>
          <li>Change your SIL provider</li>
          <li>Be involved in decisions about your home and supports</li>
        </ul>
      </div>

      {/* 3. Your Tenancy */}
      <div className="border border-slate-200 rounded-md p-5 bg-slate-50 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1">Your Tenancy</h2>
        <p className="text-sm leading-relaxed">
          Your tenancy agreement is separate from your SIL supports. It explains:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 text-slate-700 pl-2">
          <li>Your rights and responsibilities as a tenant</li>
          <li>Rent and household costs (if applicable)</li>
          <li>Notice periods and exit arrangements</li>
          <li>House-sharing arrangements</li>
          <li>Property access and privacy</li>
          <li>Tenancy laws and protections</li>
        </ul>
        <p className="text-sm leading-relaxed italic text-slate-600">
          You will receive information in a format you can understand, and support will be provided if needed.
        </p>
      </div>

      {/* 4. SIL Supports */}
      <div className="border border-slate-200 rounded-md p-5 bg-slate-50 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1">Supported Independent Living (SIL) Supports</h2>
        <p className="text-sm leading-relaxed">
          Your SIL supports help you live independently and work towards your goals. You have the right to:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 text-slate-700 pl-2">
          <li>Choose your supports</li>
          <li>Participate in support planning and reviews</li>
          <li>Make decisions about your daily life</li>
          <li>Change your SIL provider</li>
          <li>Be supported in a way that respects your preferences</li>
        </ul>
        <p className="text-sm font-semibold text-slate-800">
          SIL supports are separate from your tenancy.
        </p>
      </div>

      {/* 5. Separation of Tenancy and SIL Supports */}
      <div className="border border-slate-200 rounded-md p-5 bg-slate-50 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1">Separation of Tenancy and SIL Supports</h2>
        <p className="text-sm leading-relaxed">
          Best of Homecare ensures tenancy and SIL supports are clearly separated. This means:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 text-slate-700 pl-2">
          <li>Your housing is not dependent on your SIL provider</li>
          <li>You can change SIL providers without losing your home</li>
          <li>Tenancy decisions are separate from support delivery</li>
          <li>You are supported to make informed choices</li>
        </ul>
        <p className="text-sm leading-relaxed">
          Conflict of interest safeguards are in place and explained to you in writing and verbally.
        </p>
      </div>

      {/* 6. Advocacy Services */}
      <div className="border border-slate-200 rounded-md p-5 bg-slate-50 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1">Advocacy Services</h2>
        <p className="text-sm leading-relaxed">
          You can access independent advocacy at any time. An advocate can help you understand your rights, make decisions, raise concerns or complaints, and attend meetings with you. You can choose your own advocate.
        </p>
        <div className="text-sm space-y-1">
          <p className="font-semibold text-slate-800">External advocacy supports include:</p>
          <ul className="list-disc list-inside pl-2 text-blue-600">
            <li>
              <a href="https://www.ndiscommission.gov.au" target="_blank" rel="noopener noreferrer" className="hover:underline">
                https://www.ndiscommission.gov.au
              </a>
            </li>
            <li>
              <a href="https://www.disabilitygateway.gov.au/advocacy" target="_blank" rel="noopener noreferrer" className="hover:underline">
                https://www.disabilitygateway.gov.au/advocacy
              </a>
            </li>
          </ul>
        </div>
        <div
          className="pt-2 relative"
          onMouseEnter={() => setHoveredField("local_advocacy_contact")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-semibold text-slate-700">Local Advocacy Contact</label>
            {hoveredField === "local_advocacy_contact" && (
              <button
                type="button"
                onClick={() => handleViewLogs("local_advocacy_contact")}
                className="text-xs btn-primary text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="local_advocacy_contact"
            value={formData.local_advocacy_contact || ""}
            onChange={handleChange}
            disabled={readOnly}
            placeholder="Enter local advocacy contact details"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          />
        </div>
      </div>

      {/* 7. Complaints and Feedback */}
      <div className="border border-slate-200 rounded-md p-5 bg-slate-50 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1">Complaints and Feedback</h2>
        <p className="text-sm leading-relaxed">
          You have the right to provide feedback or make a complaint at any time about your home, supports, team members behaviour, other residents, or your rights or treatment.
        </p>
        <p className="text-sm leading-relaxed">
          You will not be treated unfairly for making a complaint. Complaints can be made to Best of Homecare or externally to the NDIS Quality and Safeguards Commission.
        </p>
      </div>

      {/* 8. Incident Management */}
      <div className="border border-slate-200 rounded-md p-5 bg-slate-50 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1">Incident Management</h2>
        <p className="text-sm leading-relaxed">
          Best of Homecare is committed to keeping you safe and responding appropriately to incidents (medical emergencies, abuse, neglect, violence, property damage, medication errors, restrictive practices).
        </p>
        <p className="text-sm leading-relaxed">
          If an incident occurs, immediate action is taken to ensure safety, emergency services or family notified as appropriate, recorded internally, and reported to the NDIS Commission where required.
        </p>
      </div>

      {/* 9 - 15. Additional Policy Sections */}
      <div className="border border-slate-200 rounded-md p-5 bg-slate-50 space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Behaviour Support and Safety</h3>
          <p className="text-sm text-slate-700 mt-1">
            Where a Behaviour Support Plan is in place, team members will follow it. Any restrictive practices must be authorised, least restrictive, and follow NDIS requirements.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Visitors</h3>
          <p className="text-sm text-slate-700 mt-1">
            You have the right to have visitors in your home while respecting co-tenants, safety, and privacy.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Privacy and Personal Space</h3>
          <p className="text-sm text-slate-700 mt-1">
            You have the right to privacy in your room, control over who enters, and respect for your belongings.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">House Participation & Vacancies</h3>
          <p className="text-sm text-slate-700 mt-1">
            Encouraged to participate in house meetings, meal planning, and household decisions. Your preferences and compatibility are considered if housemate vacancies occur.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Emergency & Transitions</h3>
          <p className="text-sm text-slate-700 mt-1">
            Fire evacuation plans and emergency procedures are established. Best of Homecare supports transition planning when moving in or out.
          </p>
        </div>
      </div>

      {/* Contact Information Fields */}
      <div className="border border-blue-200 rounded-md p-5 bg-blue-50/50 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-500 pb-1">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("support_provider")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">Support Provider</label>
              {hoveredField === "support_provider" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("support_provider")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="support_provider"
              value={formData.support_provider || "Best of Homecare"}
              onChange={handleChange}
              disabled={readOnly}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("tenancy_contact")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">Tenancy Contact</label>
              {hoveredField === "tenancy_contact" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("tenancy_contact")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="tenancy_contact"
              value={formData.tenancy_contact || ""}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Enter tenancy contact details"
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            />
          </div>
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("after_hours_support")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">After Hours Support</label>
              {hoveredField === "after_hours_support" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("after_hours_support")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="after_hours_support"
              value={formData.after_hours_support || ""}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Enter after hours contact details"
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Emergency Services</label>
            <input
              type="text"
              value="000"
              disabled
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-slate-100 font-bold text-red-600"
            />
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="sil_residency_handbook"
        field={selectedField}
        url="sil-residency-handbook/logs"
      />
    </div>
  );
}
