'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import SignaturePad from 'signature_pad';
import DatePickerSaveMany from '@/src/components/DatePickerSaveMany';

interface AgreementSignatures {
  participant_signature?: string; // base64 string
  agreement_participant_name?: string;
  participant_date?: string;
  representative_signature?: string; // base64 string
  representative_name?: string;
  representative_date?: string;
  verbal_consent_staff_name?: string;
  verbal_consent_staff_position?: string;
  verbal_consent_staff_signature?: string;
  verbal_consent_date?: string;
  verbal_consent_notes?: string;
}

interface AgreementSignaturesProps {
  formData: AgreementSignatures;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
  hideSaveButton?: boolean;
  isSignatureOnly?: boolean;
}

export default function AgreementSignatures({
  formData,
  handleChange,
  uuid,
  hideSaveButton = false,
  isSignatureOnly = false,
}: AgreementSignaturesProps) {
  const participantSignaturePad = useRef<SignaturePad | null>(null);
  const representativeSignaturePad = useRef<SignaturePad | null>(null);
  const participantCanvasRef = useRef<HTMLCanvasElement>(null);
  const representativeCanvasRef = useRef<HTMLCanvasElement>(null);

  const searchParams = useSearchParams();
  const urlUuid = searchParams.get('uuid');
  const effectiveUuid = uuid || urlUuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [participantSaveStatus, setParticipantSaveStatus] = useState(false);
  const [representativeSaveStatus, setRepresentativeSaveStatus] = useState(false);
  const [verbalSaveStatus, setVerbalSaveStatus] = useState(false);

  const verbalSignaturePad = useRef<SignaturePad | null>(null);
  const verbalCanvasRef = useRef<HTMLCanvasElement>(null);

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

      setupPad(participantCanvasRef, participantSignaturePad, "participant_signature");
      setupPad(representativeCanvasRef, representativeSignaturePad, "representative_signature");
      setupPad(verbalCanvasRef, verbalSignaturePad, "verbal_consent_staff_signature");
    };

    const timer = setTimeout(initializePads, 200);

    const handleResize = () => {
      [participantCanvasRef, representativeCanvasRef, verbalCanvasRef].forEach((canvasRef, index) => {
        const canvas = canvasRef.current;
        const pad = index === 0 ? participantSignaturePad.current : (index === 1 ? representativeSignaturePad.current : verbalSignaturePad.current);
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
        }
        else if (!value) {
          pad.clear();
        }
      }
    };

    syncPad(participantSignaturePad, formData.participant_signature);
    syncPad(representativeSignaturePad, formData.representative_signature);
    syncPad(verbalSignaturePad, formData.verbal_consent_staff_signature);
  }, [formData.participant_signature, formData.representative_signature, formData.verbal_consent_staff_signature]);

  const handleClear = (type: 'participant' | 'representative' | 'verbal') => {
    const pad =
      type === 'participant'
        ? participantSignaturePad.current
        : type === 'representative'
          ? representativeSignaturePad.current
          : verbalSignaturePad.current;
    if (!pad) return;

    pad.clear();
    const fieldName = type === 'verbal' ? 'verbal_consent_staff_signature' : `${type}_signature`;
    handleChange({
      target: {
        name: fieldName,
        value: ''
      }
    });
  };

  const handleSave = (type: "participant" | "representative" | "verbal") => {
    const pad =
      type === "participant"
        ? participantSignaturePad.current
        : type === "representative" ? representativeSignaturePad.current : verbalSignaturePad.current;
    if (!pad) return;

    const fieldName = type === 'verbal' ? 'verbal_consent_staff_signature' : `${type}_signature`;
    const data = pad.isEmpty() ? "" : pad.toDataURL();
    handleChange({
      target: {
        name: fieldName,
        value: data,
      },
    });

    if (type === "participant") {
      setParticipantSaveStatus(true);
      setTimeout(() => setParticipantSaveStatus(false), 2000);
    } else if (type === "representative") {
      setRepresentativeSaveStatus(true);
      setTimeout(() => setRepresentativeSaveStatus(false), 2000);
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
          The parties agree to the terms and conditions in the Service Agreement and the details outlined in this Support Schedule
        </h4>
      </div>

      {/* Fields */}
      <div className="p-4 bg-white">
        {/* Participant Section */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h5 className="text-md font-semibold mb-4 text-gray-700">Participant Signature</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Participant Name */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredField('agreement_participant_name')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Participant Name</label>
                {hoveredField === 'agreement_participant_name' && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs('agreement_participant_name')}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="agreement_participant_name"
                disabled={isSignatureOnly}
                placeholder="Enter participant name"
                value={formData.agreement_participant_name || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Participant Date */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredField('participant_date')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Date</label>
                {hoveredField === 'participant_date' && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs('participant_date')}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <DatePickerSaveMany
                name="participant_date"
                disabled={isSignatureOnly}
                value={formData.participant_date || null}
                onChange={handleChange}
              />
              {/* <input
                type="date"
                name="participant_date"
                value={formData.participant_date || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              /> */}
            </div>

            {/* Participant Signature */}
            <div
              id="participant-signature-pad"
              className="md:col-span-2 relative"
              onMouseEnter={() => setHoveredField('participant_signature')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Signature</label>
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

              <canvas
                ref={participantCanvasRef}
                className="w-full h-32 border-4 border-yellow-400 bg-yellow-50 rounded mb-2 touch-none shadow-md"
              />

              {/* Show saved participant signature if available */}
              {formData.participant_signature?.startsWith('data:image') && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
                  <img
                    src={formData.participant_signature}
                    alt="participant signature"
                    className="w-48 h-20 border rounded shadow"
                  />
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleClear('participant')}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Clear
                </button>
                {!hideSaveButton && (
                  <button
                    type="button"
                    onClick={() => handleSave("participant")}
                    className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${participantSaveStatus ? "bg-green-600" : ""
                      }`}
                  >
                    {participantSaveStatus ? "Saved!" : "Save Signature"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Representative Section */}
        <div>
          <h5 className="text-md font-semibold mb-4 text-gray-700">Representative Signature</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Representative Name */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredField('representative_name')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Representative Name</label>
                {hoveredField === 'representative_name' && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs('representative_name')}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="representative_name"
                disabled={isSignatureOnly}
                placeholder="Enter representative name"
                value={formData.representative_name || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Representative Date */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredField('representative_date')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Date</label>
                {hoveredField === 'representative_date' && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs('representative_date')}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <DatePickerSaveMany
                name="representative_date"
                disabled={isSignatureOnly}
                value={formData.representative_date || null}
                onChange={handleChange}
              />
              {/* <input
                type="date"
                name="representative_date"
                value={formData.representative_date || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              /> */}
            </div>

            {/* Representative Signature */}
            <div
              className="md:col-span-2 relative"
              onMouseEnter={() => setHoveredField('representative_signature')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Signature</label>
                {hoveredField === 'representative_signature' && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs('representative_signature')}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>

              <canvas
                ref={representativeCanvasRef}
                className="w-full h-32 border rounded mb-2 touch-none"
              />

              {/* Show saved representative signature if available */}
              {formData.representative_signature?.startsWith('data:image') && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
                  <img
                    src={formData.representative_signature}
                    alt="representative signature"
                    className="w-48 h-20 border rounded shadow"
                  />
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleClear('representative')}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Clear
                </button>
                {!hideSaveButton && (
                  <button
                    type="button"
                    onClick={() => handleSave("representative")}
                    className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${representativeSaveStatus ? "bg-green-600" : ""
                      }`}
                  >
                    {representativeSaveStatus ? "Saved!" : "Save Signature"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verbal Participant Consent Section */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="md:col-span-2 border-l-4 border-blue-500 bg-gray-50 p-4 mt-2 mb-6">
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
            <input type="text" name="verbal_consent_staff_name" disabled={isSignatureOnly} placeholder='Enter staff name' value={formData.verbal_consent_staff_name || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed" />
          </div>

          <div className="relative" onMouseEnter={() => setHoveredField('verbal_consent_staff_position')} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium text-gray-700">Staff Position</label>
              {hoveredField === 'verbal_consent_staff_position' && (
                <button type="button" onClick={() => handleViewLogs('verbal_consent_staff_position')} className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm">View Logs</button>
              )}
            </div>
            <input type="text" name="verbal_consent_staff_position" disabled={isSignatureOnly} placeholder='Enter position' value={formData.verbal_consent_staff_position || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed" />
          </div>

          <div className="md:col-span-2 relative mt-4" onMouseEnter={() => setHoveredField('verbal_consent_staff_signature')} onMouseLeave={() => setHoveredField(null)}>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium text-gray-700">Staff Signature</label>
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
              <button type="button" onClick={() => handleClear('verbal')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium text-sm">Clear</button>
              {!hideSaveButton && (
                <button type="button" onClick={() => handleSave("verbal")} className={`btn-primary px-4 py-2 text-white rounded font-medium text-sm transition ${verbalSaveStatus ? "bg-green-600" : ""}`}>
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
            <textarea name="verbal_consent_notes" disabled={isSignatureOnly} placeholder='Enter any additional notes' value={formData.verbal_consent_notes || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table={selectedField?.startsWith('verbal_consent_') ? "schedule_of_support_verbal_consent" : "agreement_signature"}
        field={selectedField}
        url="schedule-of-supports/logs"
      />
    </div>
  );
}