'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import SignaturePad from 'signature_pad';
import DatePickerSaveMany from '../../DatePickerSaveMany';

interface ParticipantSignature {
  participant_signature?: string;
  date_signed?: string;
 
  verbal_consent_staff_name?: string;
  verbal_consent_staff_position?: string;
  verbal_consent_staff_signature?: string;
  verbal_consent_date?: string;
  verbal_consent_notes?: string;
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
  isSignatureOnly?: boolean;
}

export default function ParticipantSignatures({
  formData,
  handleChange,
  uuid,
  hideSaveButton = false,
  isSignatureOnly = false,
}: ParticipantSignaturesProps) {
  const signaturePad = useRef<SignaturePad | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verbalSignaturePad = useRef<SignaturePad | null>(null);
  const verbalCanvasRef = useRef<HTMLCanvasElement>(null);

  const [saveStatus, setSaveStatus] = useState(false);
  const [verbalSaveStatus, setVerbalSaveStatus] = useState(false);

  const searchParams = useSearchParams();
  const urlUuid = searchParams.get('uuid');
  const effectiveUuid = uuid || urlUuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Initialize pads ONCE
  useEffect(() => {
    const initializePads = () => {
      const setupPad = (canvasRef: React.RefObject<HTMLCanvasElement | null>, padRef: React.MutableRefObject<SignaturePad | null>, fieldName: string) => {
        const canvas = canvasRef.current;
        if (canvas && !padRef.current) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          const pad = new SignaturePad(canvas, { backgroundColor: "rgba(255,255,255,0)" });
          padRef.current = pad;
          pad.addEventListener("endStroke", () => {
            if (pad.isEmpty()) return;
            handleChange({ target: { name: fieldName, value: pad.toDataURL() } });
          });
        }
      };

      setupPad(canvasRef, signaturePad, "participant_signature");
      setupPad(verbalCanvasRef, verbalSignaturePad, "verbal_consent_staff_signature");
    };

    const timer = setTimeout(initializePads, 200);

    const handleResize = () => {
      [canvasRef, verbalCanvasRef].forEach((cref, idx) => {
        const canvas = cref.current;
        const pad = idx === 0 ? signaturePad.current : verbalSignaturePad.current;
        if (canvas && pad) {
          const data = pad.toData();
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          pad.clear();
          pad.fromData(data);
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync data
  useEffect(() => {
    const syncPad = (padRef: React.MutableRefObject<SignaturePad | null>, value: string | undefined) => {
      const pad = padRef.current;
      if (!pad) return;

      const currentData = pad.isEmpty() ? "" : pad.toDataURL();
      if (value !== currentData) {
        if (value && value.startsWith('data:image')) {
          pad.fromDataURL(value);
        } else if (!value) {
          pad.clear();
        }
      }
    };

    syncPad(signaturePad, formData.participant_signature);
    syncPad(verbalSignaturePad, formData.verbal_consent_staff_signature);
  }, [formData.participant_signature, formData.verbal_consent_staff_signature]);

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
    } else if (type === 'verbal') {
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
            disabled={isSignatureOnly}
            value={formData.date_signed || null}
            onChange={handleChange}
          />
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
                {saveStatus ? "Saved!" : "Save Signature"}
              </button>
            )}
          </div>
        </div>



        {/* Verbal Participant Consent Section */}
        <div className="md:col-span-2 mt-8 pt-8 border-t border-gray-200 bg-gray-50 -mx-4 px-4 pb-4">
          <div className="border-l-4 border-blue-500 pl-4 mb-6">
            <h5 className="text-xl font-bold text-gray-800 mb-2">Verbal Participant Consent</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              Verbal consent should only be used where it is not practicable to obtain written consent. 
              I have discussed the proposed Service Agreement with the Participant or authorised representative, 
              and I am satisfied that they understand the proposed Service Agreement and Schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative" onMouseEnter={() => setHoveredField('verbal_consent_staff_name')} onMouseLeave={() => setHoveredField(null)}>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium text-gray-700">Staff Name</label>
                {hoveredField === 'verbal_consent_staff_name' && (
                  <button type="button" onClick={() => handleViewLogs('verbal_consent_staff_name')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
                )}
              </div>
              <input type="text" name="verbal_consent_staff_name" disabled={isSignatureOnly} placeholder='Enter staff name' value={formData.verbal_consent_staff_name || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed" />
            </div>

            <div className="relative" onMouseEnter={() => setHoveredField('verbal_consent_staff_position')} onMouseLeave={() => setHoveredField(null)}>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium text-gray-700">Staff Position</label>
                {hoveredField === 'verbal_consent_staff_position' && (
                  <button type="button" onClick={() => handleViewLogs('verbal_consent_staff_position')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
                )}
              </div>
              <input type="text" name="verbal_consent_staff_position" disabled={isSignatureOnly} placeholder='Enter position' value={formData.verbal_consent_staff_position || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed" />
            </div>

            <div className="md:col-span-2 relative mt-4" onMouseEnter={() => setHoveredField('verbal_consent_staff_signature')} onMouseLeave={() => setHoveredField(null)}>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium text-gray-700">Staff Signature</label>
                {hoveredField === 'verbal_consent_staff_signature' && (
                  <button type="button" onClick={() => handleViewLogs('verbal_consent_staff_signature')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
                )}
              </div>
              <canvas ref={verbalCanvasRef} className="w-full h-40 border-2 border-gray-300 rounded mb-2 touch-none bg-white shadow-inner" />
              {formData.verbal_consent_staff_signature?.startsWith('data:image') && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Saved Signature:</p>
                  <img src={formData.verbal_consent_staff_signature} alt="staff signature" className="w-48 h-20 border rounded shadow bg-white object-contain" />
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => handleClear('verbal')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium text-sm transition">Clear</button>
                {!hideSaveButton && (
                  <button type="button" onClick={() => handleSave('verbal')} className={`btn-primary px-4 py-2 text-white rounded font-medium text-sm transition ${verbalSaveStatus ? "bg-green-600" : ""}`}>
                    {verbalSaveStatus ? "Saved!" : "Save Signature"}
                  </button>
                )}
              </div>
            </div>

            <div className="relative mt-4" onMouseEnter={() => setHoveredField('verbal_consent_date')} onMouseLeave={() => setHoveredField(null)}>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium text-gray-700">Date</label>
                {hoveredField === 'verbal_consent_date' && (
                  <button type="button" onClick={() => handleViewLogs('verbal_consent_date')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
                )}
              </div>
              <DatePickerSaveMany name="verbal_consent_date" disabled={isSignatureOnly} value={formData.verbal_consent_date || null} onChange={handleChange} />
            </div>

            <div className="md:col-span-2 relative mt-4" onMouseEnter={() => setHoveredField('verbal_consent_notes')} onMouseLeave={() => setHoveredField(null)}>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium text-gray-700">Other Notes</label>
                {hoveredField === 'verbal_consent_notes' && (
                  <button type="button" onClick={() => handleViewLogs('verbal_consent_notes')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
                )}
              </div>
              <textarea name="verbal_consent_notes" disabled={isSignatureOnly} placeholder='Enter any additional notes' value={formData.verbal_consent_notes || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed" />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table={selectedField?.startsWith('verbal_consent_') ? "participant_signature_verbal_consent" : "participant_signature"}
        field={selectedField}
        url="multiple-supports/logs"
      />
    </div>
  );
}