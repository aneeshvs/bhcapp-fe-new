"use client";
import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import SignaturePad from "signature_pad";
import DatePickerSaveMany from "@/src/components/DatePickerSaveMany";


interface ConfidentialConsent {
  signature?: string; // Can be file path or base64 string
  signed_date?: string;
  signed_by?: string;
  name?: string;
  witnessed_by?: string;
}

interface ConfidentialConsentsProps {
  formData: ConfidentialConsent;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function ConfidentialConsents({
  formData,
  handleChange,
  uuid,
}: ConfidentialConsentsProps) {
  const signaturePad = useRef<SignaturePad | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [saveStatus, setSaveStatus] = useState(false);
  const searchParams = useSearchParams();
  const urlUuid = searchParams.get("uuid");
  const effectiveUuid = uuid || urlUuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    const initializePad = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Explicitly set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const pad = new SignaturePad(canvas, {
        backgroundColor: "rgba(255,255,255,0)",
      });
      signaturePad.current = pad;

      // Load existing signature if available
      if (formData.signature && formData.signature.startsWith("data:image")) {
        pad.fromDataURL(formData.signature);
      }
    };

    initializePad();

    // Optional: Resize handling on window resize
    const handleResize = () => {
      const pad = signaturePad.current;
      const canvas = canvasRef.current;

      if (canvas && pad) {
        const data = pad.toData();
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        pad.clear();
        pad.fromData(data);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [formData.signature]);

  const handleClear = () => {
    if (!signaturePad.current) return;
    signaturePad.current.clear();
    handleChange({ target: { name: "signature", value: "" } });
  };

  const handleSave = () => {
    if (!signaturePad.current) return;
    const data = signaturePad.current.isEmpty()
      ? ""
      : signaturePad.current.toDataURL();
    handleChange({ target: { name: "signature", value: data } });

    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
    }, 2000);
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
          WRITTEN PARTICIPANT CONSENT
        </h4>
      </div>

      {/* Fields */}
      <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
          <div className="text-gray-700 space-y-3 w-full">
            <p className="text-gray-600 mb-4">
              <b>
                Best of Homecare has discussed with me how and why certain
                information about me may need to be provided to other service
                providers. I understand the recommendations and I give my
                permission for the information to be shared as detailed above.
              </b>
            </p>
          </div>
        </div>
        {/* Name */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("name")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Name</label>
            {hoveredField === "name" && (
              <button
                type="button"
                onClick={() => handleViewLogs("name")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Signed By */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("signed_by")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Signed By</label>
            {hoveredField === "signed_by" && (
              <button
                type="button"
                onClick={() => handleViewLogs("signed_by")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <select
            name="signed_by"
            value={formData.signed_by || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select who is signing</option>
            <option value="participant">Participant</option>
            <option value="authorized_rep">Authorized Representative</option>
          </select>
        </div>

        {/* Signed Date */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("signed_date")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Signed Date</label>
            {hoveredField === "signed_date" && (
              <button
                type="button"
                onClick={() => handleViewLogs("signed_date")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <DatePickerSaveMany
                name="signed_date"
                value={formData.signed_date || null}
                onChange={handleChange}
              />
          {/* <input
            type="date"
            name="signed_date"
            value={formData.signed_date || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          /> */}
        </div>

        {/* Witnessed By */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("witnessed_by")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Witnessed By</label>
            {hoveredField === "witnessed_by" && (
              <button
                type="button"
                onClick={() => handleViewLogs("witnessed_by")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="witnessed_by"
            placeholder="Enter witness name"
            value={formData.witnessed_by || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Signature */}
        <div
          className="md:col-span-2 relative"
          onMouseEnter={() => setHoveredField("signature")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Signature</label>
            {hoveredField === "signature" && (
              <button
                type="button"
                onClick={() => handleViewLogs("signature")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-32 border rounded mb-2 touch-none"
          />

          {/* Show saved image if available */}
          {formData.signature?.startsWith("data:image") && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
              <img
                src={formData.signature}
                alt="consent signature"
                className="w-48 h-20 border rounded shadow"
              />
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${
                saveStatus ? "bg-green-600" : ""
              }`}
            >
              {saveStatus ? "Saved!" : "Save Signature"}
            </button>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="confidential_information_consent"
        field={selectedField}
        url="confidential-form/logs"
      />
    </div>
  );
}
