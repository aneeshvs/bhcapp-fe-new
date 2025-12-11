'use client';
import React, { useRef, useEffect } from 'react';
import SignaturePad from 'signature_pad';

export interface FinalDeclarationProps {
  formData: {
    referrer_date?: string;
    referrer_name?: string;
    referrer_signature?: string;
    referrer_organisation?: string;
    client_date?: string;
    client_name?: string;
    client_signature?: string;
    guardian_date?: string;
    declaration_guardian_name?: string;  // Changed from guardian_name
    guardian_signature?: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => void;
}

export default function FinalDeclaration({ formData, handleChange }: FinalDeclarationProps) {
  const referrerPad = useRef<SignaturePad | null>(null);
  const clientPad = useRef<SignaturePad | null>(null);
  const guardianPad = useRef<SignaturePad | null>(null);

  const canvasRefs = {
    referrer: useRef<HTMLCanvasElement>(null),
    client: useRef<HTMLCanvasElement>(null),
    guardian: useRef<HTMLCanvasElement>(null),
  };

  const [saveStatus, setSaveStatus] = React.useState<{
    referrer: boolean;
    client: boolean;
    guardian: boolean;
  }>({
    referrer: false,
    client: false,
    guardian: false,
  });

  useEffect(() => {
    const initializePad = (key: 'referrer' | 'client' | 'guardian') => {
      const canvas = canvasRefs[key].current;
      if (!canvas) return;

      // Explicitly set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const pad = new SignaturePad(canvas, { backgroundColor: 'rgba(255,255,255,0)' });

      if (key === 'referrer') referrerPad.current = pad;
      if (key === 'client') clientPad.current = pad;
      if (key === 'guardian') guardianPad.current = pad;
    };

    ['referrer', 'client', 'guardian'].forEach((key) =>
      initializePad(key as 'referrer' | 'client' | 'guardian')
    );

    // Optional: Resize handling on window resize
    const handleResize = () => {
      ['referrer', 'client', 'guardian'].forEach((key) => {
        const pad = { referrer: referrerPad, client: clientPad, guardian: guardianPad }[
          key as keyof typeof canvasRefs
        ].current;
        const canvas = canvasRefs[key as keyof typeof canvasRefs].current;

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
  }, []);

  const handleClear = (type: 'referrer' | 'client' | 'guardian') => {
    const padRef = { referrer: referrerPad, client: clientPad, guardian: guardianPad }[type];
    if (!padRef.current) return;
    padRef.current.clear();
    handleChange({ target: { name: `${type}_signature`, value: '' } });
  };

  const handleSave = (type: 'referrer' | 'client' | 'guardian') => {
    const padRef = { referrer: referrerPad, client: clientPad, guardian: guardianPad }[type];
    if (!padRef.current) return;
    const data = padRef.current.isEmpty() ? '' : padRef.current.toDataURL();
    handleChange({ target: { name: `${type}_signature`, value: data } });

    setSaveStatus((prev) => ({ ...prev, [type]: true }));

    // Optional: Remove "Saved!" after 2 seconds
    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const copyToClipboard = (val: string) => navigator.clipboard.writeText(val);

  return (
    <section className="mb-4 mt-4 border border-gray-300 p-6 rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-4 text-heading">Final Declaration & Submission</h2>

      <p>Please send this completed referral form with relevant documentation to:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { label: 'Primary Email', key: 'enquiries@alignedcommunitycare.com.au' },
          { label: 'Secondary Email', key: 'admin@bestofhomecare.com.au' },
        ].map(({ label, key }) => (
          <div key={key} className="space-y-1">
            <label className="block font-semibold">{label}:</label>
            <div className="flex">
              <input
                type="text"
                className="flex-grow border rounded-l px-3 py-2"
                readOnly
                value={key}
              />
              <button
                type="button"
                onClick={() => copyToClipboard(key)}
                className="px-3 border border-l-0 rounded-r bg-gray-200 hover:bg-gray-300"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="font-semibold mb-4">
        Completing this form is not a guarantee the service can or will be provided. A service
        agreement is required before all services.
      </p>

      {[
        { title: 'Referrer', prefix: 'referrer' },
        { title: 'Client', prefix: 'client' },
        { title: 'Legal Guardian (if applicable)', prefix: 'guardian' },
      ].map(({ title, prefix }) => (
        <div key={prefix} className="mb-6">
          <hr className="my-4" />
          <h3 className="font-semibold text-lg mb-2">{title}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Dated:</label>
              <input
                type="date"
                name={
                  prefix === 'referrer'
                    ? 'referrer_date'
                    : `${prefix}_date`
                }
                value={
                  prefix === 'referrer'
                    ? formData.referrer_date || ''
                    : formData[`${prefix}_date` as keyof typeof formData] || ''
                }
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Full Name:</label>
              <input
                type="text"
                name={
                  prefix === 'guardian' 
                    ? 'declaration_guardian_name' 
                    : `${prefix}_name`
                }
                value={
                  prefix === 'guardian'
                    ? formData.declaration_guardian_name || ''
                    : formData[`${prefix}_name` as keyof typeof formData] || ''
                }
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            {prefix === 'referrer' && (
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">Organisation:</label>
                <input
                  type="text"
                  name="referrer_organisation"
                  value={formData.referrer_organisation || ''}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Signature:</label>

              <canvas
                ref={canvasRefs[prefix as keyof typeof canvasRefs]}
                className="w-full h-32 border rounded mb-2 touch-none"
              />

              {/* Show saved image if available */}
              {formData[`${prefix}_signature` as keyof typeof formData]?.startsWith('data:image') && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
                  <img
                    src={formData[`${prefix}_signature` as keyof typeof formData] as string}
                    alt={`${prefix} signature`}
                    className="w-48 h-20 border rounded shadow"
                  />
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleClear(prefix as 'referrer' | 'client' | 'guardian')}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(prefix as 'referrer' | 'client' | 'guardian')}
                  className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition ${
                    saveStatus[prefix as keyof typeof saveStatus] ? 'bg-green-600' : ''
                  }`}
                >
                  {saveStatus[prefix as keyof typeof saveStatus] ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}