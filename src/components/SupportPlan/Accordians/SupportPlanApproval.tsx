'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import SignaturePad from 'signature_pad';
import DatePickerSaveMany from '@/src/components/DatePickerSaveMany';

interface SupportPlanApproval {
  participant_name?: string;
  date_of_approval: string;
  signature?: string; // Can be file path or base64 string
  // Verbal Consent fields
  verbal_consent_staff_name?: string;
  verbal_consent_staff_position?: string;
  verbal_consent_staff_signature?: string;
  verbal_consent_date?: string;
  verbal_consent_notes?: string;
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
  isSignatureOnly?: boolean;
}

export default function SupportPlanApproval({
  formData,
  handleChange,
  uuid,
  hideSaveButton = false,
  isSignatureOnly = false,
}: SupportPlanApprovalProps) {
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

  const initPad = useCallback((canvas: HTMLCanvasElement | null, padRef: React.MutableRefObject<SignaturePad | null>, fieldName: string) => {
    if (!canvas) return;
    
    // Set internal size to match displayed size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const pad = new SignaturePad(canvas, { backgroundColor: 'rgba(255,255,255,0)' });
    padRef.current = pad;
    
    pad.addEventListener("endStroke", () => {
      if (pad.isEmpty()) return;
      const data = pad.toDataURL();
      handleChange({ target: { name: fieldName, value: data } });
    });

    // Load existing data if any
    const existingData = fieldName === 'signature' ? formData.signature : formData.verbal_consent_staff_signature;
    if (existingData && existingData.startsWith("data:image")) {
      pad.fromDataURL(existingData);
    }
  }, [formData.signature, formData.verbal_consent_staff_signature, handleChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      initPad(canvasRef.current, signaturePad, 'signature');
      initPad(verbalCanvasRef.current, verbalSignaturePad, 'verbal_consent_staff_signature');
    }, 200);

    const handleResize = () => {
      [
        { canvas: canvasRef.current, pad: signaturePad.current },
        { canvas: verbalCanvasRef.current, pad: verbalSignaturePad.current }
      ].forEach(({ canvas, pad }) => {
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

  const handleClear = () => {
    if (!signaturePad.current) return;
    signaturePad.current.clear();
    handleChange({ target: { name: "signature", value: "" } });
  };

  const handleSave = () => {
    if (!signaturePad.current) return;
    const data = signaturePad.current.isEmpty() ? "" : signaturePad.current.toDataURL();
    handleChange({ target: { name: "signature", value: data } });
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const handleVerbalClear = () => {
    if (!verbalSignaturePad.current) return;
    verbalSignaturePad.current.clear();
    handleChange({ target: { name: "verbal_consent_staff_signature", value: "" } });
  };

  const handleVerbalSave = () => {
    if (!verbalSignaturePad.current) return;
    const data = verbalSignaturePad.current.isEmpty() ? "" : verbalSignaturePad.current.toDataURL();
    handleChange({ target: { name: "verbal_consent_staff_signature", value: data } });
    setVerbalSaveStatus(true);
    setTimeout(() => setVerbalSaveStatus(false), 2000);
  };

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3 border-b">
        <h4 className="text-lg font-semibold text-heading uppercase">
          SUPPORT PLAN APPROVAL
        </h4>
      </div>

      <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Approval Fields */}
        <div className="relative" onMouseEnter={() => setHoveredField('participant_name')} onMouseLeave={() => setHoveredField(null)}>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Participant Name</label>
            {hoveredField === 'participant_name' && (
              <button type="button" onClick={() => handleViewLogs('participant_name')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
            )}
          </div>
          <input type="text" name="participant_name" disabled={isSignatureOnly} placeholder='Enter participant name' value={formData.participant_name || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed" />
        </div>

        <div className="relative" onMouseEnter={() => setHoveredField('date_of_approval')} onMouseLeave={() => setHoveredField(null)}>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Date of Approval</label>
            {hoveredField === 'date_of_approval' && (
              <button type="button" onClick={() => handleViewLogs('date_of_approval')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
            )}
          </div>
          <DatePickerSaveMany name="date_of_approval" disabled={isSignatureOnly} value={formData.date_of_approval} onChange={handleChange} />
        </div>

        <div id="participant-signature-pad" className="md:col-span-2 relative" onMouseEnter={() => setHoveredField('signature')} onMouseLeave={() => setHoveredField(null)}>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Signature</label>
            {hoveredField === 'signature' && (
              <button type="button" onClick={() => handleViewLogs('signature')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
            )}
          </div>
          <canvas ref={canvasRef} className="w-full h-32 border-4 border-yellow-400 bg-yellow-50 rounded mb-2 touch-none shadow-md" />
          
          {formData.signature?.startsWith('data:image') && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
              <img src={formData.signature} alt="participant signature" className="w-48 h-20 border rounded shadow" />
            </div>
          )}
          
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={handleClear} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Clear</button>
            {!hideSaveButton && (
              <button type="button" onClick={handleSave} className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${saveStatus ? "bg-green-600" : ""}`}>
                {saveStatus ? "Saved!" : "Save Signature"}
              </button>
            )}
          </div>
        </div>

        {/* Verbal Participant Consent Header and Para */}
        <div className="md:col-span-2 border-l-4 border-blue-500 bg-gray-50 p-4 mt-6 mb-4">
          <h5 className="text-xl font-bold text-gray-800 mb-2">Verbal Participant Consent</h5>
          <p className="text-sm text-gray-600 leading-relaxed">
            Verbal consent should only be used where it is not practicable to obtain written consent. 
            I have discussed the proposed Service Agreement with the Participant or authorised representative, 
            and I am satisfied that they understand the proposed Service Agreement and Schedule.
          </p>
        </div>

        <div className="md:col-span-2 mb-2">
          <label className="block font-medium text-blue-800 text-sm uppercase">Verbal Agreement</label>
        </div>

        {/* Staff Name and Position */}
        <div className="relative" onMouseEnter={() => setHoveredField('verbal_consent_staff_name')} onMouseLeave={() => setHoveredField(null)}>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Staff Name</label>
            {hoveredField === 'verbal_consent_staff_name' && (
              <button type="button" onClick={() => handleViewLogs('verbal_consent_staff_name')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
            )}
          </div>
          <input type="text" name="verbal_consent_staff_name" disabled={isSignatureOnly} placeholder='Enter staff name' value={formData.verbal_consent_staff_name || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed" />
        </div>

        <div className="relative" onMouseEnter={() => setHoveredField('verbal_consent_staff_position')} onMouseLeave={() => setHoveredField(null)}>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Staff Position</label>
            {hoveredField === 'verbal_consent_staff_position' && (
              <button type="button" onClick={() => handleViewLogs('verbal_consent_staff_position')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
            )}
          </div>
          <input type="text" name="verbal_consent_staff_position" disabled={isSignatureOnly} placeholder='Enter position' value={formData.verbal_consent_staff_position || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed" />
        </div>

        {/* Staff Signature - Standard cursor */}
        <div className="md:col-span-2 relative mt-4" onMouseEnter={() => setHoveredField('verbal_consent_staff_signature')} onMouseLeave={() => setHoveredField(null)}>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Staff Signature</label>
            {hoveredField === 'verbal_consent_staff_signature' && (
              <button type="button" onClick={() => handleViewLogs('verbal_consent_staff_signature')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
            )}
          </div>
          <canvas ref={verbalCanvasRef} className="w-full h-40 border-2 border-gray-800 rounded mb-2 touch-none bg-white" />
          
          {formData.verbal_consent_staff_signature?.startsWith('data:image') && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-1">Saved Signature:</p>
              <img src={formData.verbal_consent_staff_signature} alt="staff signature" className="w-48 h-20 border-2 border-gray-800 rounded shadow" />
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={handleVerbalClear} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium">Clear</button>
            {!hideSaveButton && (
              <button type="button" onClick={handleVerbalSave} className={`btn-primary px-4 py-2 text-white rounded font-medium transition ${verbalSaveStatus ? "bg-green-600" : ""}`}>
                {verbalSaveStatus ? "Saved!" : "Save Signature"}
              </button>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="relative mt-4" onMouseEnter={() => setHoveredField('verbal_consent_date')} onMouseLeave={() => setHoveredField(null)}>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Date</label>
            {hoveredField === 'verbal_consent_date' && (
              <button type="button" onClick={() => handleViewLogs('verbal_consent_date')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
            )}
          </div>
          <DatePickerSaveMany name="verbal_consent_date" disabled={isSignatureOnly} value={formData.verbal_consent_date || ''} onChange={handleChange} />
        </div>

        {/* Other Notes */}
        <div className="md:col-span-2 relative mt-4" onMouseEnter={() => setHoveredField('verbal_consent_notes')} onMouseLeave={() => setHoveredField(null)}>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Other Notes</label>
            {hoveredField === 'verbal_consent_notes' && (
              <button type="button" onClick={() => handleViewLogs('verbal_consent_notes')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
            )}
          </div>
          <textarea name="verbal_consent_notes" disabled={isSignatureOnly} placeholder='Enter any additional notes' value={formData.verbal_consent_notes || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
        </div>
      </div>

      <FieldLogsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} uuid={effectiveUuid ?? ""} table={selectedField?.startsWith('verbal_consent_') ? "support_plan_verbal_consent" : "support_plan_approval"} field={selectedField} url="logs/view/support" />
    </div>
  );
}