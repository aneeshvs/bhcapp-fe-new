"use client";

import React, { useRef, useEffect } from "react";
import SignaturePad from "signature_pad";

interface SingleSignaturePadProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  elementId?: string;
}

const SingleSignaturePad: React.FC<SingleSignaturePadProps> = ({
  label,
  value,
  onChange,
  disabled,
  elementId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);

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
        const pad = new SignaturePad(canvas, { backgroundColor: "rgba(255,255,255,0)" });
        padRef.current = pad;

        pad.addEventListener("endStroke", () => {
          if (!pad.isEmpty()) {
            onChange(pad.toDataURL());
          }
        });
      } else {
        if (canvas.width !== width || canvas.height !== height) {
          const pad = padRef.current;
          const data = pad.toData();
          canvas.width = width;
          canvas.height = height;
          pad.clear();
          pad.fromData(data);
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

  useEffect(() => {
    const pad = padRef.current;
    if (!pad) return;
    if (value && value.startsWith("data:image")) {
      if (pad.isEmpty() || pad.toDataURL() !== value) {
        pad.clear();
        pad.fromDataURL(value, { ratio: 1, width: (pad as any).canvas.width, height: (pad as any).canvas.height });
      }
    } else if (!value) {
      pad.clear();
    }
  }, [value]);

  const handleClear = () => {
    if (padRef.current) {
      padRef.current.clear();
    }
    onChange("");
  };

  const handleSave = () => {
    if (padRef.current && !padRef.current.isEmpty()) {
      onChange(padRef.current.toDataURL());
      window.alert("Signature saved to form!");
    }
  };

  return (
    <div className="md:col-span-2 relative my-3" id={elementId}>
      <label className="block font-semibold text-sm mb-2 text-gray-800">{label}</label>
      <canvas
        ref={canvasRef}
        className={`w-full h-32 border-4 border-yellow-400 bg-yellow-50 rounded-lg mb-2 touch-none shadow-md ${
          disabled ? "pointer-events-none opacity-75" : "cursor-default"
        }`}
        style={{ cursor: disabled ? "default" : "default" }}
      />
      {value?.startsWith("data:image") && (
        <div className="mt-2 mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-1">Saved Signature Preview:</p>
          <img
            src={value}
            alt={label}
            className="w-48 h-20 border rounded shadow bg-white object-contain"
          />
        </div>
      )}
      {!disabled && (
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-semibold rounded-lg transition"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white text-xs font-semibold transition"
          >
            Save Signature
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleSignaturePad;
