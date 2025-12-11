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
}

interface AgreementSignaturesProps {
  formData: AgreementSignatures;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function AgreementSignatures({
  formData,
  handleChange,
  uuid,
}: AgreementSignaturesProps) {
  const participantSignaturePad = useRef<SignaturePad | null>(null);
  const representativeSignaturePad = useRef<SignaturePad | null>(null);
  const participantCanvasRef = useRef<HTMLCanvasElement>(null);
  const representativeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [participantSaveStatus, setParticipantSaveStatus] = useState(false);
  const [representativeSaveStatus, setRepresentativeSaveStatus] = useState(false);
  const searchParams = useSearchParams();
  const urlUuid = searchParams.get('uuid');
  const effectiveUuid = uuid || urlUuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    const initializePads = () => {
      // Initialize Participant Signature Pad
      const participantCanvas = participantCanvasRef.current;
      if (participantCanvas) {
        participantCanvas.width = participantCanvas.offsetWidth;
        participantCanvas.height = participantCanvas.offsetHeight;
        const participantPad = new SignaturePad(participantCanvas, { 
          backgroundColor: 'rgba(255,255,255,0)' 
        });
        participantSignaturePad.current = participantPad;

        // Load existing participant signature if available
        if (formData.participant_signature && formData.participant_signature.startsWith('data:image')) {
          participantPad.fromDataURL(formData.participant_signature);
        }
      }

      // Initialize Representative Signature Pad
      const representativeCanvas = representativeCanvasRef.current;
      if (representativeCanvas) {
        representativeCanvas.width = representativeCanvas.offsetWidth;
        representativeCanvas.height = representativeCanvas.offsetHeight;
        const representativePad = new SignaturePad(representativeCanvas, { 
          backgroundColor: 'rgba(255,255,255,0)' 
        });
        representativeSignaturePad.current = representativePad;

        // Load existing representative signature if available
        if (formData.representative_signature && formData.representative_signature.startsWith('data:image')) {
          representativePad.fromDataURL(formData.representative_signature);
        }
      }
    };

    initializePads();

    // Resize handling
    const handleResize = () => {
      [participantCanvasRef, representativeCanvasRef].forEach((canvasRef, index) => {
        const canvas = canvasRef.current;
        const pad = index === 0 ? participantSignaturePad.current : representativeSignaturePad.current;
        
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
    return () => window.removeEventListener('resize', handleResize);
  }, [formData.participant_signature, formData.representative_signature]);

  const handleClear = (type: 'participant' | 'representative') => {
    const pad = type === 'participant' ? participantSignaturePad.current : representativeSignaturePad.current;
    if (!pad) return;
    
    pad.clear();
    handleChange({ 
      target: { 
        name: `${type}_signature`, 
        value: '' 
      } 
    });
  };

  const handleSave = (type: 'participant' | 'representative') => {
    const pad = type === 'participant' ? participantSignaturePad.current : representativeSignaturePad.current;
    if (!pad) return;
    
    const data = pad.isEmpty() ? '' : pad.toDataURL();
    handleChange({ 
      target: { 
        name: `${type}_signature`, 
        value: data 
      } 
    });

    if (type === 'participant') {
      setParticipantSaveStatus(true);
      setTimeout(() => setParticipantSaveStatus(false), 2000);
    } else {
      setRepresentativeSaveStatus(true);
      setTimeout(() => setRepresentativeSaveStatus(false), 2000);
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
                placeholder="Enter participant name"
                value={formData.agreement_participant_name || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
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
                className="w-full h-32 border rounded mb-2 touch-none"
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
                <button
                  type="button"
                  onClick={() => handleSave('participant')}
                  className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${
                    participantSaveStatus ? 'bg-green-600' : ''
                  }`}
                >
                  {participantSaveStatus ? 'Saved!' : 'Save Signature'}
                </button>
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
                placeholder="Enter representative name"
                value={formData.representative_name || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
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
                <button
                  type="button"
                  onClick={() => handleSave('representative')}
                  className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${
                    representativeSaveStatus ? 'bg-green-600' : ''
                  }`}
                >
                  {representativeSaveStatus ? 'Saved!' : 'Save Signature'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="agreement_signature"
        field={selectedField}
        url="schedule-of-supports/logs"
      />
    </div>
  );
}