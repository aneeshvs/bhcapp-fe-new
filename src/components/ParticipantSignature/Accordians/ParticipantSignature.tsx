'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import SignaturePad from 'signature_pad';
import DatePickerSaveMany from '../../DatePickerSaveMany';

interface ParticipantSignature {
  participant_signature?: string; // Can be binary data URL or base64 string
  date_signed?: string;
}

interface ParticipantSignaturesProps {
  formData: ParticipantSignature;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
  hideSaveButton?: boolean;
}

export default function ParticipantSignatures({
  formData,
  handleChange,
  uuid,
  hideSaveButton = false,
}: ParticipantSignaturesProps) {
  const signaturePad = useRef<SignaturePad | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [saveStatus, setSaveStatus] = useState(false);
  const searchParams = useSearchParams();
  const urlUuid = searchParams.get('uuid');
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
        backgroundColor: 'rgba(255,255,255,0)',
        penColor: 'rgb(0, 0, 0)',
        throttle: 16,
        minWidth: 0.5,
        maxWidth: 2.5
      });
      signaturePad.current = pad;

      // Load existing signature if available
      if (
        formData.participant_signature &&
        formData.participant_signature.startsWith("data:image")
      ) {
        pad.fromDataURL(formData.participant_signature);
      }

      pad.addEventListener("endStroke", () => {
        if (pad.isEmpty()) return;
        const data = pad.toDataURL();
        handleChange({
          target: { name: "participant_signature", value: data },
        });
      });
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
          PARTICIPANT SIGNATURE
        </h4>
      </div>

      {/* Fields */}
      <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Signed */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField('date_signed')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Date Signed</label>
            {hoveredField === 'date_signed' && (
              <button
                type="button"
                onClick={() => handleViewLogs('date_signed')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <DatePickerSaveMany
            name="date_signed"
            value={formData.date_signed || null}
            onChange={handleChange}
          />
          {/* <input
            type="date"
            name="date_signed"
            value={formData.date_signed || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          /> */}
        </div>

        {/* Participant Signature */}
        <div
          className="md:col-span-2 relative"
          onMouseEnter={() => setHoveredField('participant_signature')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Participant Signature</label>
            {hoveredField === 'participant_signature' && (
              <button
                type="button"
                onClick={() => handleViewLogs('participant_signature')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>

          <div className="mb-2">
            <p className="text-sm text-gray-600 mb-2">
              Please sign in the box below using your mouse, touchpad, or touchscreen
            </p>
            <canvas
              ref={canvasRef}
              className="w-full h-32 border rounded mb-2 touch-none bg-white"
            />
          </div>

          {/* Show saved signature if available */}
          {formData.participant_signature?.startsWith('data:image') && (
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
            {!hideSaveButton && (
              <button
                type="button"
                onClick={handleSave}
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

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="participant_signature"
        field={selectedField}
        url="multiple-supports/logs"
      />
    </div>
  );
}