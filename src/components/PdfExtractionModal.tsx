"use client";

import React, { useState } from "react";
import api from "@/src/utils/api";
import { IconCloudUpload, IconFileText, IconX, IconLoader, IconCheck, IconAlertTriangle } from "@tabler/icons-react";

interface PdfExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  clientType: string;
  onExtractionComplete?: () => Promise<void> | void;
}

export default function PdfExtractionModal({
  isOpen,
  onClose,
  userId,
  clientType,
  onExtractionComplete,
}: PdfExtractionModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [instructions, setInstructions] = useState("");
  const [staffNotes, setStaffNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
      setError(null);
      setSuccessMsg(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadAndExtract = async () => {
    if (files.length === 0) {
      setError("Please select at least one PDF or document file.");
      return;
    }

    setLoading(true);
    setProgress(15);
    setError(null);
    setSuccessMsg(null);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 1200);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files[]", file);
      });
      formData.append("user_id", userId || "176");
      formData.append("client_type", clientType || "1");
      if (instructions.trim()) {
        formData.append("instructions", instructions.trim());
      }
      if (staffNotes.trim()) {
        formData.append("staff_notes", staffNotes.trim());
      }

      const response = await api.post("/ai/analyze-document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(interval);
      setProgress(100);

      if (response.data.success) {
        setSuccessMsg("PDF extracted successfully and saved to client profile! Click 'AI Autofill' button anytime to populate form fields.");
        
        if (onExtractionComplete) {
          await onExtractionComplete();
        }

        setTimeout(() => {
          setLoading(false);
          setFiles([]);
          setSuccessMsg(null);
          onClose();
        }, 1800);
      } else {
        clearInterval(interval);
        setLoading(false);
        setError(response.data.message || "Failed to extract PDF document.");
      }
    } catch (err: any) {
      clearInterval(interval);
      setLoading(false);
      setError(err.response?.data?.message || err.message || "An error occurred during PDF extraction.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <IconFileText size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">PDF Document Extraction</h3>
              <p className="text-xs text-blue-100">Upload PDF / Document to auto-fill this form</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* File Upload Zone */}
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/80 transition-all rounded-xl p-6 text-center">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileChange}
                disabled={loading}
              />
              <IconCloudUpload size={36} className="text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                Click to select PDF / Document
              </p>
              <p className="text-xs text-gray-400 mt-1">Supports PDF, PNG, JPG (max 10MB)</p>
            </div>
          </label>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2 max-h-36 overflow-y-auto pr-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Selected Files ({files.length}):
              </p>
              {files.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2 truncate">
                    <IconFileText size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="truncate text-gray-700 font-medium">{f.name}</span>
                    <span className="text-xs text-gray-400">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  {!loading && (
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <IconX size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Staff Instructions / Custom Guidance */}
          <div className="mt-4 space-y-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Extraction Instructions & Guidance (Optional)
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={loading}
              placeholder="e.g. Focus on medical history, NDIS goals, emergency contacts, dietary preferences..."
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 resize-none text-gray-800"
            />
          </div>

          {/* Additional Staff Fields & Extracted Notes */}
          <div className="mt-3 space-y-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Staff Notes & Extra Fields (Optional)
            </label>
            <textarea
              rows={2}
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
              disabled={loading}
              placeholder="e.g. Participant prefers afternoon visits; check wheelchair mobility details..."
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 resize-none text-gray-800"
            />
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-medium text-blue-600">
                <span className="flex items-center gap-1">
                  <IconLoader size={14} className="animate-spin" />
                  Extracting PDF text & processing AI...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-xs font-medium">
              <IconAlertTriangle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-xs font-medium">
              <IconCheck size={18} className="flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUploadAndExtract}
            disabled={files.length === 0 || loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-sm px-5 py-2 rounded-lg shadow transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <IconLoader size={16} className="animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <IconFileText size={16} />
                Extract PDF Content
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
