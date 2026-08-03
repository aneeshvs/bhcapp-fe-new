import React, { useRef, useEffect } from "react";
import { SectionProps } from "../types";
import FormFieldWrapper from "../FormFieldWrapper";
import SignaturePad from "signature_pad";

const SignatureSection: React.FC<SectionProps> = ({ formData, handleChange, uuid }) => {
  const providerCanvasRef = useRef<HTMLCanvasElement>(null);
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const witnessCanvasRef = useRef<HTMLCanvasElement>(null);

  const providerPadRef = useRef<SignaturePad | null>(null);
  const clientPadRef = useRef<SignaturePad | null>(null);
  const witnessPadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    const initPad = (canvasRef: React.RefObject<HTMLCanvasElement | null>, padRef: React.MutableRefObject<SignaturePad | null>, fieldName: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      if (padRef.current) return; // Prevent double initialization

      const pad = new SignaturePad(canvas, { backgroundColor: 'rgba(255,255,255,0)' });
      padRef.current = pad;

      pad.addEventListener("endStroke", () => {
        if (!pad.isEmpty()) {
          handleChange({ target: { name: fieldName, value: pad.toDataURL() } });
        }
      });
    };

    // Initialize all pads
    initPad(providerCanvasRef, providerPadRef, "provider_signature");
    initPad(clientCanvasRef, clientPadRef, "client_signature");
    initPad(witnessCanvasRef, witnessPadRef, "witness_signature");

    const timer = setTimeout(() => {
        // give the layout a moment to render before resizing the canvas correctly
        handleResize();
    }, 200);

    // Handle window resize logic for all canvas elements to prevent stretching
    const handleResize = () => {
      [
        { canvasRef: providerCanvasRef, padRef: providerPadRef },
        { canvasRef: clientCanvasRef, padRef: clientPadRef },
        { canvasRef: witnessCanvasRef, padRef: witnessPadRef }
      ].forEach(({ canvasRef, padRef }) => {
        const canvas = canvasRef.current;
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
    return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync existing data from API payload down to SignaturePads
  useEffect(() => {
    const syncPad = (padRef: React.MutableRefObject<SignaturePad | null>, signature?: string) => {
      const pad = padRef.current;
      if (pad) {
        if (signature && signature.startsWith('data:image')) {
          if (pad.isEmpty() || pad.toDataURL() !== signature) {
            pad.clear();
            pad.fromDataURL(signature, { ratio: 1, width: pad.canvas.width, height: pad.canvas.height });
          }
        } else if (!signature) {
          pad.clear();
        }
      }
    };

    syncPad(providerPadRef, formData.provider_signature);
    syncPad(clientPadRef, formData.client_signature);
    syncPad(witnessPadRef, formData.witness_signature);
  }, [formData.provider_signature, formData.client_signature, formData.witness_signature]);

  const handleClear = (fieldName: string, padRef: React.MutableRefObject<SignaturePad | null>) => {
    if (padRef.current) {
      padRef.current.clear();
      handleChange({ target: { name: fieldName, value: '' } });
    }
  };

  const handleSave = (fieldName: string, padRef: React.MutableRefObject<SignaturePad | null>) => {
    if (padRef.current && !padRef.current.isEmpty()) {
      handleChange({ target: { name: fieldName, value: padRef.current.toDataURL() } });
      window.alert("Signature temporarily saved to form! Click 'Save Progress' to save it permanently.");
    }
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold text-heading">
          By signing this Agreement, you agree to all of the information included.
        </h4>
      </div>

      <div className="p-4 bg-white">
        
        {/* Provider Signature */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <p className="font-semibold text-sm mb-4">Executed as an agreement for and on behalf of Best of Homecare Services Pty Ltd by its duly authorised representative:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWrapper
              label="Provider Representative Name"
              fieldName="provider_signature_name"
              value={formData.provider_signature_name}
              onChange={handleChange}
              uuid={uuid}
              apiEndpoint="/sil-sta-service-agreement/logs"
            />
            <FormFieldWrapper
              label="Date"
              fieldName="provider_signature_date"
              type="date"
              value={formData.provider_signature_date}
              onChange={handleChange}
              uuid={uuid}
              apiEndpoint="/sil-sta-service-agreement/logs"
            />
            <div className="md:col-span-2 relative">
              <label className="block font-medium mb-1">Provider Signature</label>
              <canvas
                ref={providerCanvasRef}
                className="w-full h-32 border-4 border-yellow-400 bg-yellow-50 rounded mb-2 touch-none shadow-md"
              />
              
              {formData.provider_signature?.startsWith('data:image') && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
                  <img
                    src={formData.provider_signature}
                    alt="provider signature"
                    className="w-48 h-20 border rounded shadow"
                  />
                </div>
              )}
              
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleClear("provider_signature", providerPadRef)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("provider_signature", providerPadRef)}
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition"
                >
                  Save Signature
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Client Signature */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <p className="font-semibold text-sm mb-4">Executed as an agreement by the client, or by the client’s guardian/representative:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWrapper
              label="Client/Representative Name"
              fieldName="client_signature_name"
              value={formData.client_signature_name}
              onChange={handleChange}
              uuid={uuid}
              apiEndpoint="/sil-sta-service-agreement/logs"
            />
            <FormFieldWrapper
              label="Date"
              fieldName="client_signature_date"
              type="date"
              value={formData.client_signature_date}
              onChange={handleChange}
              uuid={uuid}
              apiEndpoint="/sil-sta-service-agreement/logs"
            />
            <div className="md:col-span-2 relative">
              <label className="block font-medium mb-1">Client Signature</label>
              <canvas
                ref={clientCanvasRef}
                className="w-full h-32 border-4 border-yellow-400 bg-yellow-50 rounded mb-2 touch-none shadow-md"
              />
              
              {formData.client_signature?.startsWith('data:image') && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Saved Signature:</p>
                  <img
                    src={formData.client_signature}
                    alt="client signature"
                    className="w-48 h-20 border rounded shadow"
                  />
                </div>
              )}
              
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleClear("client_signature", clientPadRef)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("client_signature", clientPadRef)}
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition"
                >
                  Save Signature
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Witness Signature */}
        <div className="mb-4">
          <h5 className="text-md font-semibold mb-4 text-gray-700">Witness Signature</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWrapper
              label="Witness Name"
              fieldName="witness_name"
              value={formData.witness_name}
              onChange={handleChange}
              uuid={uuid}
              apiEndpoint="/sil-sta-service-agreement/logs"
            />
            <FormFieldWrapper
              label="Date"
              fieldName="witness_signature_date"
              type="date"
              value={formData.witness_signature_date}
              onChange={handleChange}
              uuid={uuid}
              apiEndpoint="/sil-sta-service-agreement/logs"
            />
            <div className="md:col-span-2 relative">
              <label className="block font-medium mb-1">Witness Signature</label>
              <canvas
                ref={witnessCanvasRef}
                className="w-full h-32 border-4 border-yellow-400 bg-yellow-50 rounded mb-2 touch-none shadow-md"
              />
              
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
                  onClick={() => handleClear("witness_signature", witnessPadRef)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("witness_signature", witnessPadRef)}
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition"
                >
                  Save Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureSection;
