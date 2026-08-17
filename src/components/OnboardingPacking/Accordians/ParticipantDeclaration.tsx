"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import SignaturePad from "signature_pad";
import DatePickerSaveMany from "../../DatePickerSaveMany";

interface ParticipantDeclaration {
  participant_name?: string;
  relationship_to_participant?: string;
  participant_signature?: string;
  signed_date?: string;
  verbal_consent_staff_name?: string;
  verbal_consent_staff_position?: string;
  verbal_consent_staff_signature?: string;
  verbal_consent_date?: string;
  verbal_consent_notes?: string;
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
  hideSaveButton?: boolean;
  isSignatureOnly?: boolean;
}

export default function ParticipantDeclarations({
  formData,
  handleChange,
  uuid,
  hideSaveButton = false,
  isSignatureOnly = false,
}: ParticipantDeclarationsProps) {
  const signaturePad = useRef<SignaturePad | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verbalSignaturePad = useRef<SignaturePad | null>(null);
  const verbalCanvasRef = useRef<HTMLCanvasElement>(null);

  const [saveStatus, setSaveStatus] = useState(false);
  const [verbalSaveStatus, setVerbalSaveStatus] = useState(false);

  const searchParams = useSearchParams();
  const urlUuid = searchParams.get("uuid") || searchParams.get("form-uuid");
  const effectiveUuid = uuid || urlUuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Sync data helper
  const syncPad = useCallback((padRef: React.MutableRefObject<SignaturePad | null>, value: string | undefined) => {
    const pad = padRef.current;
    if (!pad) return;

    if (value && value.startsWith('data:image')) {
      if (pad.isEmpty() || pad.toDataURL() !== value) {
        pad.clear();
        pad.fromDataURL(value, { ratio: 1, width: (pad as any).canvas.width, height: (pad as any).canvas.height });
      }
    } else if (!value) {
      pad.clear();
    }
  }, []);

  // Initialize and handle resizes for signature pads
  useEffect(() => {
    const initOrResizePad = (
      cRef: React.RefObject<HTMLCanvasElement | null>,
      padRef: React.MutableRefObject<SignaturePad | null>,
      fieldName: string,
      initialValue?: string
    ) => {
      const canvas = cRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = canvas.offsetWidth || rect.width || 300;
      const height = canvas.offsetHeight || rect.height || 160;

      if (width === 0 || height === 0) return;

      if (!padRef.current) {
        canvas.width = width;
        canvas.height = height;
        const pad = new SignaturePad(canvas, { backgroundColor: "rgba(255,255,255,0)" });
        padRef.current = pad;

        pad.addEventListener("endStroke", () => {
          if (!pad.isEmpty()) {
            handleChange({ target: { name: fieldName, value: pad.toDataURL() } });
          }
        });

        if (initialValue && initialValue.startsWith("data:image")) {
          pad.fromDataURL(initialValue, { ratio: 1, width, height });
        }
      } else {
        if (canvas.width !== width || canvas.height !== height) {
          const pad = padRef.current;
          const data = pad.toData();
          canvas.width = width;
          canvas.height = height;
          pad.clear();
          pad.fromData(data);
        }
      }
    };

    const handleAllPads = () => {
      initOrResizePad(canvasRef, signaturePad, "participant_signature", formData.participant_signature);
      initOrResizePad(verbalCanvasRef, verbalSignaturePad, "verbal_consent_staff_signature", formData.verbal_consent_staff_signature);
    };

    handleAllPads();
    const timer = setTimeout(handleAllPads, 200);

    const resizeObserver = new ResizeObserver(() => {
      handleAllPads();
    });

    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    if (verbalCanvasRef.current) resizeObserver.observe(verbalCanvasRef.current);

    window.addEventListener("resize", handleAllPads);
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleAllPads);
    };
  }, []);

  // Sync data when formData values change from API payload
  useEffect(() => {
    syncPad(signaturePad, formData.participant_signature);
    syncPad(verbalSignaturePad, formData.verbal_consent_staff_signature);
  }, [formData.participant_signature, formData.verbal_consent_staff_signature, syncPad]);

  const handleClear = (type: 'participant' | 'verbal') => {
    const pad = type === 'participant' ? signaturePad.current : verbalSignaturePad.current;
    if (!pad) return;

    pad.clear();
    const fieldName = type === 'participant' ? 'participant_signature' : 'verbal_consent_staff_signature';
    handleChange({ target: { name: fieldName, value: "" } });
  };

  const handleSave = (type: 'participant' | 'verbal') => {
    const pad = type === 'participant' ? signaturePad.current : verbalSignaturePad.current;
    if (!pad) return;

    const data = pad.isEmpty() ? "" : pad.toDataURL();
    const fieldName = type === 'participant' ? 'participant_signature' : 'verbal_consent_staff_signature';
    handleChange({ target: { name: fieldName, value: data } });

    if (type === 'participant') {
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 2000);
    } else {
      setVerbalSaveStatus(true);
      setTimeout(() => setVerbalSaveStatus(false), 2000);
    }
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
            disabled={isSignatureOnly}
            value={formData.participant_name || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={isSignatureOnly}
            value={formData.relationship_to_participant || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={isSignatureOnly}
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
          id="participant-signature-pad"
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
              className="w-full h-32 border-4 border-yellow-400 bg-yellow-50 rounded mb-2 touch-none shadow-md"
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
              onClick={() => handleClear('participant')}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
            >
              Clear Signature
            </button>
            {!hideSaveButton && (
              <button
                type="button"
                onClick={() => handleSave('participant')}
                className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${saveStatus
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
            )}
          </div>
        </div>
      </div>

      {/* Verbal Participant Consent Section */}
      <div className="mt-8 pt-8 border-t border-gray-200 bg-gray-50 -mx-4 px-4 pb-6">
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h5 className="text-xl font-bold text-gray-800 mb-2">Verbal Participant Consent</h5>
          <p className="text-sm text-gray-600 leading-relaxed italic">
            Verbal consent should only be used where it is not practicable to obtain written consent. 
            I have discussed the proposed Service Agreement with the Participant or authorised representative, 
            and I am satisfied that they understand the proposed Service Agreement and Schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Staff Name */}
          <div className="relative" onMouseEnter={() => setHoveredField("verbal_consent_staff_name")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium text-gray-700 text-sm">Staff Name</label>
              {hoveredField === "verbal_consent_staff_name" && (
                <button type="button" onClick={() => handleViewLogs("verbal_consent_staff_name")} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
              )}
            </div>
            <input type="text" name="verbal_consent_staff_name" disabled={isSignatureOnly} value={formData.verbal_consent_staff_name || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder="Enter staff full name" />
          </div>

          {/* Staff Position */}
          <div className="relative" onMouseEnter={() => setHoveredField("verbal_consent_staff_position")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium text-gray-700 text-sm">Staff Position</label>
              {hoveredField === "verbal_consent_staff_position" && (
                <button type="button" onClick={() => handleViewLogs("verbal_consent_staff_position")} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
              )}
            </div>
            <input type="text" name="verbal_consent_staff_position" disabled={isSignatureOnly} value={formData.verbal_consent_staff_position || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder="Enter staff position" />
          </div>

          {/* Staff Signature - Full Width */}
          <div className="md:col-span-2 relative mt-2" onMouseEnter={() => setHoveredField("verbal_consent_staff_signature")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium text-gray-700 text-sm">Staff Signature</label>
              {hoveredField === "verbal_consent_staff_signature" && (
                <button type="button" onClick={() => handleViewLogs("verbal_consent_staff_signature")} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
              )}
            </div>
            <canvas ref={verbalCanvasRef} className="w-full h-40 border-2 border-gray-300 rounded mb-2 bg-white touch-none shadow-inner transition hover:border-blue-300" />
            
            {formData.verbal_consent_staff_signature?.startsWith("data:image") && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Saved Signature Preview:</p>
                <img src={formData.verbal_consent_staff_signature} alt="staff signature" className="w-48 h-20 border rounded shadow-md object-contain bg-white p-1" />
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button type="button" onClick={() => handleClear('verbal')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition font-medium text-sm">Clear</button>
              {!hideSaveButton && (
                <button type="button" onClick={() => handleSave('verbal')} className={`btn-primary px-6 py-2 rounded text-white font-medium text-sm transition-all shadow-sm ${verbalSaveStatus ? "bg-green-600 scale-105" : "hover:bg-blue-700"}`}>
                  {verbalSaveStatus ? "✓ Saved!" : "Save Signature"}
                </button>
              )}
            </div>
          </div>

          {/* Date of Verbal Consent */}
          <div className="relative mt-2" onMouseEnter={() => setHoveredField("verbal_consent_date")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium text-gray-700 text-sm">Date</label>
              {hoveredField === "verbal_consent_date" && (
                <button type="button" onClick={() => handleViewLogs("verbal_consent_date")} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
              )}
            </div>
            <DatePickerSaveMany name="verbal_consent_date" disabled={isSignatureOnly} value={formData.verbal_consent_date || null} onChange={handleChange} />
          </div>

          {/* Verbal Consent Notes - Full Width */}
          <div className="md:col-span-2 relative mt-2" onMouseEnter={() => setHoveredField("verbal_consent_notes")} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium text-gray-700 text-sm">Other Notes</label>
              {hoveredField === "verbal_consent_notes" && (
                <button type="button" onClick={() => handleViewLogs("verbal_consent_notes")} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
              )}
            </div>
            <textarea name="verbal_consent_notes" disabled={isSignatureOnly} value={formData.verbal_consent_notes || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder="Add any additional context or details about the verbal consent discussion..." />
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table={selectedField?.startsWith('verbal_consent_') ? "onboarding_packing_signoff_verbal_consent" : "onboarding_packing_signoff_participant_declaration"}
        field={selectedField}
        url="onboarding-packing-signoff/logs"
      />
    </div>
  );
}
