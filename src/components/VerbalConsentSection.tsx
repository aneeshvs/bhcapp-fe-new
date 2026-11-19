"use client";

import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import SignatureCopyPasteButtons from "@/src/components/SignatureCopyPasteButtons";

export interface VerbalConsentData {
  verbal_staff_name?: string;
  verbal_staff_position?: string;
  verbal_staff_signature?: string;
  verbal_date?: string;
  other_notes?: string;
  [key: string]: any;
}

interface VerbalConsentSectionProps {
  data: VerbalConsentData;
  onChange?: (field: string, value: any) => void;
  handleChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: any } }
  ) => void;
  disabled?: boolean;
  readOnly?: boolean;
  isSignatureOnly?: boolean;
  onViewLogs?: (fieldName: string) => void;
  title?: string;
  description?: string;
  hideSaveButton?: boolean;
}

function formatDateForInput(val?: string | null): string {
  if (!val) return "";
  const str = String(val).trim();
  if (!str) return "";

  // 1. If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // 2. If ISO string (e.g. 2026-11-19T00:00:00.000Z or 2026-11-19 00:00:00)
  if (str.includes("T")) {
    const part = str.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(part)) return part;
  }
  if (str.includes(" ")) {
    const part = str.split(" ")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(part)) return part;
  }

  // 3. If DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (dmyMatch) {
    const day = String(dmyMatch[1]).padStart(2, "0");
    const month = String(dmyMatch[2]).padStart(2, "0");
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  return "";
}

const VerbalConsentSection: React.FC<VerbalConsentSectionProps> = ({
  data,
  onChange,
  handleChange,
  disabled = false,
  readOnly = false,
  isSignatureOnly = false,
  onViewLogs,
  title = "Verbal Participant Consent",
  description = "Verbal consent should only be used where it is not practicable to obtain written consent. I have discussed the proposed Service Agreement with the Participant or authorised representative, and I am satisfied that they understand the proposed Service Agreement and Schedule.",
  hideSaveButton = false,
}) => {
  const isFieldDisabled = disabled || readOnly;

  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);

  const updateField = (field: string, value: any) => {
    if (onChange) {
      onChange(field, value);
    }
    if (handleChange) {
      handleChange({ target: { name: field, value } });
    }
  };

  // Initialize and handle resize on canvas
  useEffect(() => {
    const initOrResizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = canvas.offsetWidth || rect.width || 300;
      const height = canvas.offsetHeight || rect.height || 128;

      if (width === 0 || height === 0) return;

      if (!padRef.current) {
        canvas.width = width;
        canvas.height = height;
        const pad = new SignaturePad(canvas, {
          backgroundColor: "rgba(255,255,255,0)",
        });
        padRef.current = pad;

        pad.addEventListener("endStroke", () => {
          if (!pad.isEmpty()) {
            updateField("verbal_staff_signature", pad.toDataURL());
          }
        });
      } else {
        if (canvas.width !== width || canvas.height !== height) {
          const pad = padRef.current;
          const padData = pad.toData();
          canvas.width = width;
          canvas.height = height;
          pad.clear();
          pad.fromData(padData);
        }
      }
    };

    initOrResizeCanvas();
    const timer = setTimeout(initOrResizeCanvas, 200);

    const resizeObserver = new ResizeObserver(() => {
      initOrResizeCanvas();
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    const handleResize = () => initOrResizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Sync external signature value to canvas
  useEffect(() => {
    const pad = padRef.current;
    if (!pad) return;

    const signature = data.verbal_staff_signature;
    if (signature && signature.startsWith("data:image")) {
      if (pad.isEmpty() || pad.toDataURL() !== signature) {
        pad.clear();
        pad.fromDataURL(signature, {
          ratio: 1,
          width: (pad as any).canvas.width,
          height: (pad as any).canvas.height,
        });
      }
    } else if (!signature) {
      pad.clear();
    }
  }, [data.verbal_staff_signature]);

  const handleClearSignature = () => {
    if (padRef.current) {
      padRef.current.clear();
    }
    updateField("verbal_staff_signature", "");
  };

  const handleSaveSignature = () => {
    if (padRef.current && !padRef.current.isEmpty()) {
      const dataUrl = padRef.current.toDataURL();
      updateField("verbal_staff_signature", dataUrl);
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 2000);
      window.alert("Signature saved to form!");
    }
  };

  return (
    <div className="bg-white p-6 border rounded-lg shadow-sm space-y-4 my-6">
      {/* Header and note banner */}
      <div className="border-l-4 border-blue-500 pl-4 mb-4">
        <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Staff Name */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("verbal_staff_name")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium text-gray-700 text-sm">
              Staff Name
            </label>
            {hoveredField === "verbal_staff_name" && onViewLogs && (
              <button
                type="button"
                onClick={() => onViewLogs("verbal_staff_name")}
                className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="verbal_staff_name"
            placeholder="Enter staff name"
            disabled={isFieldDisabled}
            value={data.verbal_staff_name || ""}
            onChange={(e) => updateField("verbal_staff_name", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Staff Position */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField("verbal_staff_position")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium text-gray-700 text-sm">
              Staff Position
            </label>
            {hoveredField === "verbal_staff_position" && onViewLogs && (
              <button
                type="button"
                onClick={() => onViewLogs("verbal_staff_position")}
                className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="verbal_staff_position"
            placeholder="Enter position"
            disabled={isFieldDisabled}
            value={data.verbal_staff_position || ""}
            onChange={(e) =>
              updateField("verbal_staff_position", e.target.value)
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Staff Signature */}
        <div
          className="relative md:col-span-2 mt-2"
          onMouseEnter={() => setHoveredField("verbal_staff_signature")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium text-gray-700 text-sm">
              Staff Signature
            </label>
            {hoveredField === "verbal_staff_signature" && onViewLogs && (
              <button
                type="button"
                onClick={() => onViewLogs("verbal_staff_signature")}
                className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm"
              >
                View Logs
              </button>
            )}
          </div>

          <canvas
            ref={canvasRef}
            className={`w-full h-32 border border-gray-300 rounded mb-2 touch-none bg-white ${
              isFieldDisabled ? "pointer-events-none opacity-75" : ""
            }`}
          />

          {data.verbal_staff_signature?.startsWith("data:image") && (
            <div className="mt-2 mb-2">
              <p className="text-xs font-semibold text-gray-600 mb-1">
                Saved Signature:
              </p>
              <img
                src={data.verbal_staff_signature}
                alt="verbal staff signature"
                className="w-48 h-20 border rounded shadow bg-white object-contain"
              />
            </div>
          )}

          {!isFieldDisabled && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleClearSignature}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm font-medium transition"
              >
                Clear
              </button>
              {!hideSaveButton && (
                <button
                  type="button"
                  onClick={handleSaveSignature}
                  className={`btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white text-sm font-medium transition ${
                    saveStatus ? "bg-green-600" : ""
                  }`}
                >
                  {saveStatus ? "Saved!" : "Save Signature"}
                </button>
              )}
              <SignatureCopyPasteButtons
                padRef={padRef}
                currentValue={data.verbal_staff_signature}
                onPaste={(dataUrl) =>
                  updateField("verbal_staff_signature", dataUrl)
                }
                label="Staff Signature"
                disabled={isFieldDisabled}
              />
            </div>
          )}
        </div>

        {/* Date */}
        <div
          className="relative mt-2"
          onMouseEnter={() => setHoveredField("verbal_date")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium text-gray-700 text-sm">
              Date
            </label>
            {hoveredField === "verbal_date" && onViewLogs && (
              <button
                type="button"
                onClick={() => onViewLogs("verbal_date")}
                className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="date"
            name="verbal_date"
            value={formatDateForInput(data.verbal_date)}
            disabled={isFieldDisabled}
            onClick={(e) => {
              try {
                if (!isFieldDisabled && typeof (e.currentTarget as any).showPicker === "function") {
                  (e.currentTarget as any).showPicker();
                }
              } catch (err) {}
            }}
            onChange={(e) => updateField("verbal_date", e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
          />
        </div>

        {/* Other Notes */}
        <div
          className="relative md:col-span-2 mt-2"
          onMouseEnter={() => setHoveredField("other_notes")}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium text-gray-700 text-sm">
              Other Notes
            </label>
            {hoveredField === "other_notes" && onViewLogs && (
              <button
                type="button"
                onClick={() => onViewLogs("other_notes")}
                className="text-xs btn-primary text-white px-2 py-1 rounded shadow-sm"
              >
                View Logs
              </button>
            )}
          </div>
          <textarea
            name="other_notes"
            placeholder="Enter any additional notes"
            value={data.other_notes || ""}
            disabled={isFieldDisabled}
            onChange={(e) => updateField("other_notes", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default VerbalConsentSection;
