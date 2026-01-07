"use client";
import React, { useState, useEffect } from "react";
import { index } from "@/src/services/crud";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { Participant } from "@/src/components/ServiceAgreement/types";
import DatePickerSaveMany from "../../DatePickerSaveMany";

interface ParticipantRepresentativeProps {
  formData: Participant;
  handleChange: (
    event:
      | React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
      | { target: { name: string; value: string | number | boolean | string[] } }
  ) => void;
  uuid?: string;
}
interface Chargeband {
  id: number;
  chargeband_name: string;
}
export default function ParticipantRepresentativeForm({
  formData,
  handleChange,
  uuid,
}: ParticipantRepresentativeProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [chargebands, setChargebands] = useState<Chargeband[]>([]);

  useEffect(() => {
    const fetchChargebands = async () => {
      try {
        const res = await index<Chargeband[]>("chargebands"); // API CALL
        setChargebands(res.data);       // adjust based on your API structure
      } catch (err) {
        console.error("Failed to load chargebands:", err);
      }
    };

    fetchChargebands();
  }, []);

  const filteredChargebands = chargebands.filter((item) =>
    item.chargeband_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Card Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Participant / Representative Details
        </h4>
      </div>

      {/* Form Body */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Participant Name */}
          <div
            className="relative"
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
              placeholder="Enter participant name"
              value={formData.participant_name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* NDIS Number */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("ndis_number")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">NDIS Number</label>
              {hoveredField === "ndis_number" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("ndis_number")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="ndis_number"
              placeholder="Enter NDIS number"
              value={formData.ndis_number || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Address */}
          <div
            className="relative md:col-span-2"
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
              placeholder="Enter address"
              value={formData.address || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Contact */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("contact")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Contact</label>
              {hoveredField === "contact" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("contact")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="tel"
              name="contact"
              placeholder="Enter contact number"
              value={formData.contact || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Email */}
          <div
            className="relative"
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
              placeholder="Enter email address"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Date of Birth */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("dob")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Date of Birth</label>
              {hoveredField === "dob" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("dob")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
              name="dob"
              value={formData.dob || null}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* NDIS Plan Start Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("ndis_plan_start_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">NDIS Plan Start Date</label>
              {hoveredField === "ndis_plan_start_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("ndis_plan_start_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
              name="ndis_plan_start_date"
              value={formData.ndis_plan_start_date || null}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="ndis_plan_start_date"
              value={formData.ndis_plan_start_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* NDIS Plan End Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("ndis_plan_end_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">NDIS Plan End Date</label>
              {hoveredField === "ndis_plan_end_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("ndis_plan_end_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
              name="ndis_plan_end_date"
              value={formData.ndis_plan_end_date || null}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="ndis_plan_end_date"
              value={formData.ndis_plan_end_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Term Start Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("term_start_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Term of this agreement Start Date</label>
              {hoveredField === "term_start_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("term_start_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
              name="term_start_date"
              value={formData.term_start_date || null}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="term_start_date"
              value={formData.term_start_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Term End Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("term_end_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Term of this agreement End Date</label>
              {hoveredField === "term_end_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("term_end_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
              name="term_end_date"
              value={formData.term_end_date || null}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="term_end_date"
              value={formData.term_end_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>



          {/* Area of Support */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("area_of_support")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Area of Support</label>
              {hoveredField === "area_of_support" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.open("/chargebands", "_blank")}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Manage Chargeband
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewLogs("area_of_support")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                </div>
              )}
            </div>

            {/* Search Bar for Chargebands */}
            <input
              type="text"
              placeholder="Search charge bands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-800 rounded px-3 py-2 mb-2"
            />

            <div className="border border-gray-300 rounded px-3 py-2 max-h-48 overflow-y-auto">
              {filteredChargebands.length > 0 ? (
                filteredChargebands.map((item) => (
                  <div key={item.id} className="flex items-center mb-2 last:mb-0">
                    <input
                      type="checkbox"
                      id={`chargeband-${item.id}`}
                      value={item.chargeband_name}
                      checked={(Array.isArray(formData.area_of_support)
                        ? formData.area_of_support
                        : []
                      ).includes(item.chargeband_name)}
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        const current = Array.isArray(formData.area_of_support)
                          ? formData.area_of_support
                          : [];
                        const newValue = checked
                          ? [...current, value]
                          : current.filter((v: string) => v !== value);

                        handleChange({
                          target: {
                            name: "area_of_support",
                            value: newValue,
                          },
                        });
                      }}
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`chargeband-${item.id}`}
                      className="text-gray-700 cursor-pointer select-none"
                    >
                      {item.chargeband_name}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">
                  No chargebands match your search
                </div>
              )}
            </div>
          </div>

          {/* Representative Name */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("representative_name")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Representative Name</label>
              {hoveredField === "representative_name" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("representative_name")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="representative_name"
              placeholder="Enter representative name"
              value={formData.representative_name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Representative Relationship */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("representative_relationship")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Relationship</label>
              {hoveredField === "representative_relationship" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("representative_relationship")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="representative_relationship"
              placeholder="Enter relationship"
              value={formData.representative_relationship || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Representative Contact */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("representative_contact")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Representative Contact</label>
              {hoveredField === "representative_contact" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("representative_contact")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="tel"
              name="representative_contact"
              placeholder="Enter representative contact"
              value={formData.representative_contact || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Representative Email */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("representative_email")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Representative Email</label>
              {hoveredField === "representative_email" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("representative_email")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="email"
              name="representative_email"
              placeholder="Enter representative email"
              value={formData.representative_email || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="service_agreement"
        field={selectedField}
        url="service-agreement/logs"
      />
    </div>
  );
}