"use client";
import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import SignaturePad from "signature_pad";
import DatePickerSaveMany from "../../DatePickerSaveMany";

interface ParticipantDeclaration {
  participant_name?: string;
  relationship_to_participant?: string;
  participant_signature?: string; // Can be binary data URL or base64 string
  signed_date?: string;
}

interface ParticipantDeclarationsProps {
  formData: ParticipantDeclaration;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function ParticipantDeclarations({
  formData,
  handleChange,
  uuid,
}: ParticipantDeclarationsProps) {
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
        penColor: "rgb(0, 0, 0)",
        throttle: 16,
        minWidth: 0.5,
        maxWidth: 2.5,
      });
      signaturePad.current = pad;

      // Load existing signature if available
      if (
        formData.participant_signature &&
        formData.participant_signature.startsWith("data:image")
      ) {
        pad.fromDataURL(formData.participant_signature);
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
  }, [formData.participant_signature]);

  const handleClear = () => {
    if (!signaturePad.current) return;
    signaturePad.current.clear();
    handleChange({ target: { name: "participant_signature", value: "" } });
  };

  const handleSave = () => {
    if (!signaturePad.current) return;
    const data = signaturePad.current.isEmpty()
      ? ""
      : signaturePad.current.toDataURL();
    handleChange({ target: { name: "participant_signature", value: data } });

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
          PARTICIPANT DECLARATION
        </h4>
      </div>

      {/* Fields */}
      <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
        <div className="text-gray-700 space-y-3 w-full">
          <p className="text-gray-600 mb-4">
            <b>
              Participant to sign to indicate that you have been provided with a
              copy of the items identified on the above list, with contents
              explained and understood?.
            </b>
          </p>
        </div>
      </div>
      <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="participant_name"
            value={formData.participant_name || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter participant's full name"
          />
        </div>

        {/* Relationship to Participant */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("relationship_to_participant")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">
              Relationship to Participant
            </label>
            {hoveredField === "relationship_to_participant" && (
              <button
                type="button"
                onClick={() => handleViewLogs("relationship_to_participant")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="relationship_to_participant"
            value={formData.relationship_to_participant || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter relationship to participant"
          />
        </div>

        {/* Signed Date */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("signed_date")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Date Signed</label>
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

        {/* Participant Signature */}
        <div
          className="md:col-span-2 relative"
          onMouseEnter={() => setHoveredField("participant_signature")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Participant Signature</label>
            {hoveredField === "participant_signature" && (
              <button
                type="button"
                onClick={() => handleViewLogs("participant_signature")}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>

          <div className="mb-2">
            <p className="text-sm text-gray-600 mb-2">
              Please sign in the box below using your mouse, touchpad, or
              touchscreen
            </p>
            <canvas
              ref={canvasRef}
              className="w-full h-32 border rounded mb-2 touch-none bg-white"
            />
          </div>

          {/* Show saved signature if available */}
          {formData.participant_signature?.startsWith("data:image") && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
              <img
                src={formData.participant_signature}
                alt="participant signature"
                className="w-48 h-20 border rounded shadow object-contain bg-white"
              />
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
            >
              Clear Signature
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${
                saveStatus
                  ? "bg-green-600 hover:bg-green-700"
                  : "hover:bg-blue-700"
              }`}
            >
              {saveStatus ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Saved!
                </>
              ) : (
                "Save Signature"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="onboarding_packing_signoff_participant_declaration"
        field={selectedField}
        url="onboarding-packing-signoff/logs"
      />
    </div>
  );
}
