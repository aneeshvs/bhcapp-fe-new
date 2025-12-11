'use client';
import React, { useState, useRef, useEffect } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import SignaturePad from 'signature_pad';
import DatePickerSaveMany from '@/src/components/DatePickerSaveMany';

interface ServiceAgreementConsentProps {
  formData: {
    accepted_name?: string;
    accepted_position?: string;
    accepted_signature?: string;
    accepted_date?: string;
    consents_participant_name?: string;
    participant_role?: string;
    participant_signature?: string;
    participant_date?: string;
    witness_name?: string;
    witness_signature?: string;
    witness_date?: string;
    verbal_staff_name?: string;
    verbal_staff_signature?: string;
    verbal_staff_position?: string;
    verbal_date?: string;
    other_notes?: string;
    received_signed_copy?: string;
    agreed_verbally?: string;
    cms_comments_entered?: string;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string | null;
}

export default function ServiceAgreementConsent({ formData, handleChange, uuid }: ServiceAgreementConsentProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Signature pad refs and state
  const acceptedSignaturePad = useRef<SignaturePad | null>(null);
  const participantSignaturePad = useRef<SignaturePad | null>(null);
  const witnessSignaturePad = useRef<SignaturePad | null>(null);
  const verbalStaffSignaturePad = useRef<SignaturePad | null>(null);
  
  const acceptedCanvasRef = useRef<HTMLCanvasElement>(null);
  const participantCanvasRef = useRef<HTMLCanvasElement>(null);
  const witnessCanvasRef = useRef<HTMLCanvasElement>(null);
  const verbalStaffCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [acceptedSaveStatus, setAcceptedSaveStatus] = useState(false);
  const [participantSaveStatus, setParticipantSaveStatus] = useState(false);
  const [witnessSaveStatus, setWitnessSaveStatus] = useState(false);
  const [verbalStaffSaveStatus, setVerbalStaffSaveStatus] = useState(false);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  // Initialize signature pads
  useEffect(() => {
    const initializePad = (padRef: React.MutableRefObject<SignaturePad | null>, canvasRef: React.MutableRefObject<HTMLCanvasElement | null>, signature: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const pad = new SignaturePad(canvas, { backgroundColor: 'rgba(255,255,255,0)' });
      padRef.current = pad;

      if (signature && signature.startsWith('data:image')) {
        pad.fromDataURL(signature);
      }
    };

    initializePad(acceptedSignaturePad, acceptedCanvasRef, formData.accepted_signature || '');
    initializePad(participantSignaturePad, participantCanvasRef, formData.participant_signature || '');
    initializePad(witnessSignaturePad, witnessCanvasRef, formData.witness_signature || '');
    initializePad(verbalStaffSignaturePad, verbalStaffCanvasRef, formData.verbal_staff_signature || '');

    // Resize handling
    const handleResize = () => {
      [acceptedSignaturePad, participantSignaturePad, witnessSignaturePad, verbalStaffSignaturePad].forEach((padRef, index) => {
        const canvasRefs = [acceptedCanvasRef, participantCanvasRef, witnessCanvasRef, verbalStaffCanvasRef];
        const canvas = canvasRefs[index].current;
        const pad = padRef.current;

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
  }, [formData.accepted_signature, formData.participant_signature, formData.witness_signature, formData.verbal_staff_signature]);

  // Signature handlers
  const handleClear = (padRef: React.MutableRefObject<SignaturePad | null>, fieldName: string) => {
    if (!padRef.current) return;
    padRef.current.clear();
    handleChange({ target: { name: fieldName, value: '' } });
  };

  const handleSave = (padRef: React.MutableRefObject<SignaturePad | null>, fieldName: string, setSaveStatus: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!padRef.current) return;
    const data = padRef.current.isEmpty() ? '' : padRef.current.toDataURL();
    handleChange({ target: { name: fieldName, value: data } });

    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
    }, 2000);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Card Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">SERVICE AGREEMENT CONSENT</h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Accepted By Section */}
          <div className="md:col-span-2 border-b border-gray-200 pb-4 mb-4">
            <h5 className="font-medium text-gray-700 mb-3">Accepted By (Organization Representative)</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Accepted Name */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('accepted_name')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Name</label>
                  {hoveredField === 'accepted_name' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('accepted_name')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="accepted_name"
                  placeholder="Enter name"
                  value={formData.accepted_name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Accepted Position */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('accepted_position')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Position</label>
                  {hoveredField === 'accepted_position' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('accepted_position')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="accepted_position"
                  placeholder="Enter position"
                  value={formData.accepted_position || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Accepted Signature */}
              <div 
                className="relative md:col-span-2"
                onMouseEnter={() => setHoveredField('accepted_signature')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Signature</label>
                  {hoveredField === 'accepted_signature' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('accepted_signature')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                
                <canvas
                  ref={acceptedCanvasRef}
                  className="w-full h-32 border rounded mb-2 touch-none"
                />

                {/* Show saved image if available */}
                {formData.accepted_signature?.startsWith('data:image') && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
                    <img
                      src={formData.accepted_signature}
                      alt="accepted signature"
                      className="w-48 h-20 border rounded shadow"
                    />
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleClear(acceptedSignaturePad, 'accepted_signature')}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(acceptedSignaturePad, 'accepted_signature', setAcceptedSaveStatus)}
                    className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${
                      acceptedSaveStatus ? 'bg-green-600' : ''
                    }`}
                  >
                    {acceptedSaveStatus ? 'Saved!' : 'Save Signature'}
                  </button>
                </div>
              </div>

              {/* Accepted Date */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('accepted_date')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Date</label>
                  {hoveredField === 'accepted_date' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('accepted_date')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <DatePickerSaveMany
                  name="accepted_date"
                  value={formData.accepted_date || null}
                  onChange={handleChange}
                />
                {/* <input
                  type="date"
                  name="accepted_date"
                  value={formData.accepted_date || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                /> */}
              </div>
            </div>
          </div>
          <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
            <div className="text-gray-700 space-y-3 w-full">
              <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                Written Participant Consent
              </h2>
              <p className="text-gray-600 mb-4">
                Participant’s Signature confirming the support arrangement and service agreement with Best of Homecare: I, understand, accept, and agree to the information outlined in this Agreement and Schedule.
              </p>
            </div>
          </div>


          {/* Participant Section */}
          <div className="md:col-span-2 border-b border-gray-200 pb-4 mb-4">
            <h5 className="font-medium text-gray-700 mb-3">Participant</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Participant Name */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('consents_participant_name')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Name</label>
                  {hoveredField === 'consents_participant_name' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('consents_participant_name')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="consents_participant_name"
                  placeholder="Enter participant name"
                  value={formData.consents_participant_name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Participant Role */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('participant_role')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Role</label>
                  {hoveredField === 'participant_role' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('participant_role')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                {['participant', 'representative'].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="participant_role"
                      value={type}
                      checked={formData.participant_role === type}
                      onChange={handleChange}
                    />
                    {type}
                  </label>
                ))}
              </div>
              </div>

              {/* Participant Signature */}
              <div 
                className="relative md:col-span-2"
                onMouseEnter={() => setHoveredField('participant_signature')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Signature</label>
                  {hoveredField === 'participant_signature' && (
                    <button
                      type='button'
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

                {/* Show saved image if available */}
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
                    onClick={() => handleClear(participantSignaturePad, 'participant_signature')}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(participantSignaturePad, 'participant_signature', setParticipantSaveStatus)}
                    className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${
                      participantSaveStatus ? 'bg-green-600' : ''
                    }`}
                  >
                    {participantSaveStatus ? 'Saved!' : 'Save Signature'}
                  </button>
                </div>
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
                      type='button'
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
            </div>
          </div>
          {/* Witness Section */}
          <div className="md:col-span-2 border-b border-gray-200 pb-4 mb-4">
            <h5 className="font-medium text-gray-700 mb-3">Witness</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Witness Name */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('witness_name')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Witness Name</label>
                  {hoveredField === 'witness_name' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('witness_name')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="witness_name"
                  placeholder="Enter witness name"
                  value={formData.witness_name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Witness Signature */}
              <div 
                className="relative md:col-span-2"
                onMouseEnter={() => setHoveredField('witness_signature')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Signature</label>
                  {hoveredField === 'witness_signature' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('witness_signature')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                
                <canvas
                  ref={witnessCanvasRef}
                  className="w-full h-32 border rounded mb-2 touch-none"
                />

                {/* Show saved image if available */}
                {formData.witness_signature?.startsWith('data:image') && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
                    <img
                      src={formData.witness_signature}
                      alt="witness signature"
                      className="w-48 h-20 border rounded shadow"
                    />
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleClear(witnessSignaturePad, 'witness_signature')}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(witnessSignaturePad, 'witness_signature', setWitnessSaveStatus)}
                    className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${
                      witnessSaveStatus ? 'bg-green-600' : ''
                    }`}
                  >
                    {witnessSaveStatus ? 'Saved!' : 'Save Signature'}
                  </button>
                </div>
              </div>

              {/* Witness Date */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('witness_date')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Date</label>
                  {hoveredField === 'witness_date' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('witness_date')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <DatePickerSaveMany
                  name="witness_date"
                  value={formData.witness_date || null}
                  onChange={handleChange}
                />
                {/* <input
                  type="date"
                  name="witness_date"
                  value={formData.witness_date || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                /> */}
              </div>
            </div>
          </div>
          <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
            <div className="text-gray-700 space-y-3 w-full">
              <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                Verbal Participant Consent
              </h2>
              <p className="text-gray-600 mb-4">
                Verbal consent should only be used where it is not practicable to obtain written consent. I have discussed the proposed Service Agreement with the Participant or authorised representative, and I am satisfied that they understand the proposed Service Agreement and Schedule.
              </p>
            </div>
          </div>

          

          {/* Verbal Agreement Section */}
          <div className="md:col-span-2 border-b border-gray-200 pb-4 mb-4">
            <h5 className="font-medium text-gray-700 mb-3">Verbal Agreement</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Verbal Staff Name */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('verbal_staff_name')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Staff Name</label>
                  {hoveredField === 'verbal_staff_name' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('verbal_staff_name')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="verbal_staff_name"
                  placeholder="Enter staff name"
                  value={formData.verbal_staff_name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Verbal Staff Position */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('verbal_staff_position')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Staff Position</label>
                  {hoveredField === 'verbal_staff_position' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('verbal_staff_position')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="verbal_staff_position"
                  placeholder="Enter position"
                  value={formData.verbal_staff_position || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Verbal Staff Signature */}
              <div 
                className="relative md:col-span-2"
                onMouseEnter={() => setHoveredField('verbal_staff_signature')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Staff Signature</label>
                  {hoveredField === 'verbal_staff_signature' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('verbal_staff_signature')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                
                <canvas
                  ref={verbalStaffCanvasRef}
                  className="w-full h-32 border rounded mb-2 touch-none"
                />

                {/* Show saved image if available */}
                {formData.verbal_staff_signature?.startsWith('data:image') && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
                    <img
                      src={formData.verbal_staff_signature}
                      alt="verbal staff signature"
                      className="w-48 h-20 border rounded shadow"
                    />
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleClear(verbalStaffSignaturePad, 'verbal_staff_signature')}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(verbalStaffSignaturePad, 'verbal_staff_signature', setVerbalStaffSaveStatus)}
                    className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${
                      verbalStaffSaveStatus ? 'bg-green-600' : ''
                    }`}
                  >
                    {verbalStaffSaveStatus ? 'Saved!' : 'Save Signature'}
                  </button>
                </div>
              </div>

              {/* Verbal Date */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('verbal_date')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Date</label>
                  {hoveredField === 'verbal_date' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('verbal_date')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <DatePickerSaveMany
                  name="verbal_date"
                  value={formData.verbal_date || null}
                  onChange={handleChange}
                />
                {/* <input
                  type="date"
                  name="verbal_date"
                  value={formData.verbal_date || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                /> */}
              </div>
            </div>
          </div>
          {/* Other Notes */}
          <div 
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField('other_notes')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Other Notes</label>
              {hoveredField === 'other_notes' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('other_notes')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="other_notes"
              placeholder="Enter additional notes"
              value={formData.other_notes || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
            <div className="text-gray-700 space-y-3 w-full">
              <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                SA-01b Schedule of Supports– Attached 
              </h2>
              <p className="text-gray-600 mb-4">
                <strong>Please also note, our schedule of fees is subject to change by direction of the National Disability Insurance Scheme. Office use only:</strong>
              </p>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="md:col-span-2">
            <h5 className="font-medium text-gray-700 mb-3">Additional Information</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Received Signed Copy */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('received_signed_copy')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Received Signed Copy</label>
                  {hoveredField === 'received_signed_copy' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('received_signed_copy')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  {['Yes', 'No'].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="received_signed_copy"
                        value={option}
                        checked={formData.received_signed_copy === option}
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              {/* Agreed Verbally */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredField('agreed_verbally')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Agreed Verbally</label>
                  {hoveredField === 'agreed_verbally' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('agreed_verbally')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  {['Yes', 'No'].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="agreed_verbally"
                        value={option}
                        checked={formData.agreed_verbally === option}
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              {/* CMS Comments */}
              <div 
                className="relative md:col-span-2"
                onMouseEnter={() => setHoveredField('cms_comments_entered')}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">CMS Comments</label>
                  {hoveredField === 'cms_comments_entered' && (
                    <button
                      type='button'
                      onClick={() => handleViewLogs('cms_comments_entered')}
                      className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  {['Yes', 'No'].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cms_comments_entered"
                        value={option}
                        checked={formData.cms_comments_entered === option}
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="service_agreement_consent"
        field={selectedField}
        url="service-agreement/logs"
      />
    </div>
  );
}