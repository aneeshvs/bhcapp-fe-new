'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import SignaturePad from 'signature_pad';
import DatePicker from '../../DatePicker';

interface SupportPlanApproval {
  participant_name?: string;
  date_of_approval: string;
  signature?: string; // Can be file path or base64 string
}

interface SupportPlanApprovalProps {
  formData: SupportPlanApproval;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
  hideSaveButton?: boolean;
}

export default function SupportPlanApproval({
  formData,
  handleChange,
  uuid,
  hideSaveButton = false,
}: SupportPlanApprovalProps) {
  const signaturePad = useRef<SignaturePad | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [saveStatus, setSaveStatus] = useState(false);
  const searchParams = useSearchParams();
  const urlUuid = searchParams.get('uuid');
  const effectiveUuid = uuid || urlUuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Initialize pad ONCE
  useEffect(() => {
    const initializePad = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (signaturePad.current) return; // Prevent double init

      // Explicitly set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const pad = new SignaturePad(canvas, { backgroundColor: 'rgba(255,255,255,0)' });
      signaturePad.current = pad;

      // Auto-save on end stroke
      pad.addEventListener("endStroke", () => {
        if (pad.isEmpty()) return;
        const data = pad.toDataURL();
        handleChange({ target: { name: "signature", value: data } });
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
  }, []); // Run once on mount

  // Sync data
  useEffect(() => {
    const pad = signaturePad.current;
    if (!pad) return;

    if (formData.signature && formData.signature.startsWith("data:image")) {
      // Check if data is different from current pad content to avoid loop
      const currentData = pad.isEmpty() ? "" : pad.toDataURL();
      if (formData.signature !== currentData) {
        pad.fromDataURL(formData.signature);
      }
    } else if (!formData.signature) {
      pad.clear();
    }
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
          SUPPORT PLAN APPROVAL
        </h4>
      </div>

      {/* Fields */}
      <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Participant Name */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField('participant_name')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Participant Name</label>
            {hoveredField === 'participant_name' && (
              <button
                type="button"
                onClick={() => handleViewLogs('participant_name')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="participant_name"
            placeholder='Enter participant name'
            value={formData.participant_name || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Date of Approval */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField('date_of_approval')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Date of Approval</label>
            {hoveredField === 'date_of_approval' && (
              <button
                type="button"
                onClick={() => handleViewLogs('date_of_approval')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <DatePicker
            name="date_of_approval"
            value={formData.date_of_approval}
            onChange={handleChange}
          />
          {/* <input
            type="date"
            name="date_of_approval"
            value={formData.date_of_approval || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          /> */}
        </div>

        {/* Signature */}
        <div
          className="md:col-span-2 relative"
          onMouseEnter={() => setHoveredField('signature')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Signature</label>
            {hoveredField === 'signature' && (
              <button
                type="button"
                onClick={() => handleViewLogs('signature')}
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
          {formData.signature?.startsWith('data:image') && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
              <img
                src={formData.signature}
                alt="participant signature"
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
            {!hideSaveButton && (
              <button
                type="button"
                onClick={handleSave}
                className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${saveStatus ? "bg-green-600" : ""
                  }`}
              >
                {saveStatus ? "Saved!" : "Save Signature"}
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
        table="support_plan_approval"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}