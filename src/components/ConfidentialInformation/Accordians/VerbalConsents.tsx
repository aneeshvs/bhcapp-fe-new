"use client";
import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import SignaturePad from "signature_pad";
import DatePickerSaveMany from "@/src/components/DatePickerSaveMany";



interface VerbalConsent {
  verbal_signature?: string; // Can be file path or base64 string
  verbal_signed_date?: string;
  verbal_name?: string;
  position?: string;
}

interface VerbalConsentsProps {
  formData: VerbalConsent;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function VerbalConsents({
  formData,
  handleChange,
  uuid,
}: VerbalConsentsProps) {
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
      if (
        formData.verbal_signature &&
        formData.verbal_signature.startsWith("data:image")
      ) {
        pad.fromDataURL(formData.verbal_signature);
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
  }, [formData.verbal_signature]);

  const handleClear = () => {
    if (!signaturePad.current) return;
    signaturePad.current.clear();
    handleChange({ target: { name: "verbal_signature", value: "" } });
  };

  const handleSave = () => {
    if (!signaturePad.current) return;
    const data = signaturePad.current.isEmpty()
      ? ""
      : signaturePad.current.toDataURL();
    handleChange({ target: { name: "verbal_signature", value: data } });

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
          VERBAL CONSENTS
        </h4>
      </div>

      {/* Fields */}
      <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
          <div className="text-gray-700 space-y-3 w-full">
            <p className="text-gray-600 mb-4">
              <b>
                Verbal consent should only be used where it is not practicable
                to obtain written consent. I have discussed the proposed
                referrals with the Participant or authorised representative and
                I am satisfied that they understand the proposed uses and
                disclosures and have provided their informed consent to these.
              </b>
            </p>
          </div>
        </div>
        {/* Verbal Name */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("verbal_name")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">
              Name
            </label>
            {hoveredField === "verbal_name" && (
              <button
                type="button"
                onClick={() => handleViewLogs("verbal_name")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="verbal_name"
            placeholder="Enter full name of person providing consent"
            value={formData.verbal_name || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Position */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("position")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Position</label>
            {hoveredField === "position" && (
              <button
                type="button"
                onClick={() => handleViewLogs("position")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="position"
            placeholder="Enter staff position obtaining consent"
            value={formData.position || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Signed Date */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("verbal_signed_date")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Consent Date</label>
            {hoveredField === "verbal_signed_date" && (
              <button
                type="button"
                onClick={() => handleViewLogs("verbal_signed_date")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <DatePickerSaveMany
                name="verbal_signed_date"
                value={formData.verbal_signed_date || null}
                onChange={handleChange}
              />
          {/* <input
            type="date"
            name="verbal_signed_date"
            value={formData.verbal_signed_date || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          /> */}
        </div>

        {/* Verbal Signature */}
        <div
          className="md:col-span-2 relative"
          onMouseEnter={() => setHoveredField("verbal_signature")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">
              Verbal Consent Signature
            </label>
            {hoveredField === "verbal_signature" && (
              <button
                type="button"
                onClick={() => handleViewLogs("verbal_signature")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>

          <div className="mb-2">
            <canvas
              ref={canvasRef}
              className="w-full h-32 border rounded mb-2 touch-none"
            />
          </div>

          {/* Show saved image if available */}
          {formData.verbal_signature?.startsWith("data:image") && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
              <img
                src={formData.verbal_signature}
                alt="verbal consent signature"
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
              Clear Signature
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
        table="confidential_verbal_consent"
        field={selectedField}
        url="confidential-form/logs"
      />
    </div>
  );
}
