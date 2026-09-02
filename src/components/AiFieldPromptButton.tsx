"use client";
import React, { useState } from "react";
import api from "@/src/utils/api";
import { IconSparkles, IconLoader2, IconX, IconCheck } from "@tabler/icons-react";

interface AiFieldPromptButtonProps {
  fieldLabel: string;
  currentValue?: string;
  onUpdate: (newValue: string) => void;
  userId?: string;
  clientType?: string;
  buttonText?: string;
  className?: string;
}

export default function AiFieldPromptButton({
  fieldLabel,
  currentValue = "",
  onUpdate,
  userId,
  clientType,
  buttonText = "AI Prompt",
  className = "",
}: AiFieldPromptButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpen = () => {
    setIsOpen(true);
    setPreviewText(null);
    setErrorMsg("");
  };

  const getEffectiveSession = () => {
    let uId = userId;
    let cType = clientType;

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (!uId) uId = searchParams.get("userid") || "";
      if (!cType) cType = searchParams.get("client_type") || "";
    }
    return { uId, cType };
  };

  const handleRefine = async (promptToUse?: string) => {
    const activePrompt = promptToUse || customPrompt;
    if (!activePrompt.trim()) {
      alert("Please enter prompt instructions or select a quick prompt.");
      return;
    }

    const { uId, cType } = getEffectiveSession();

    if (!uId || !cType) {
      alert("Client session missing (userid / client_type). Please ensure client session is active.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/ai/refine-field", {
        user_id: uId,
        client_type: cType,
        field_label: fieldLabel,
        current_value: currentValue,
        prompt: activePrompt,
      });

      if (res.data.success && res.data.refined_text) {
        setPreviewText(res.data.refined_text);
      } else {
        setErrorMsg(res.data.message || "Failed to refine field.");
      }
    } catch (err: any) {
      console.error("AI Refinement Error:", err);
      setErrorMsg(err.response?.data?.message || err.message || "Error connecting to AI service.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (previewText !== null) {
      onUpdate(previewText);
      setIsOpen(false);
      setPreviewText(null);
      setCustomPrompt("");
    }
  };

  const presets = [
    "Make this text more detailed & person-centered",
    "Shorten & summarize key points",
    "Rephrase professionally for NDIS compliance",
    "Include specific staff support steps and safety controls",
  ];

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition shadow-xs ${className}`}
        title={`Prompt AI to refine ${fieldLabel}`}
      >
        <IconSparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
        <span>{buttonText}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-indigo-600 text-white">
              <div className="flex items-center gap-2 font-semibold">
                <IconSparkles className="w-5 h-5 text-yellow-300" />
                <span>AI Prompt — {fieldLabel}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-indigo-200 hover:text-white transition p-1 rounded"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Presets */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Quick Prompts
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomPrompt(preset);
                        handleRefine(preset);
                      }}
                      disabled={loading}
                      className="text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200 rounded-full px-3 py-1 transition font-medium text-gray-700 disabled:opacity-50"
                    >
                      ✨ {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Custom AI Instruction:
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                  placeholder="e.g. Expand on communication strategies for Lewy Body Dementia..."
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Preview Area */}
              {previewText !== null && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="block text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Generated Preview Result:
                  </label>
                  <textarea
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    rows={5}
                    className="w-full border border-emerald-300 bg-emerald-50/50 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden text-gray-800"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>

              {previewText === null ? (
                <button
                  type="button"
                  onClick={() => handleRefine()}
                  disabled={loading || !customPrompt.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition shadow-xs"
                >
                  {loading ? (
                    <>
                      <IconLoader2 className="w-4 h-4 animate-spin" />
                      <span>Refining...</span>
                    </>
                  ) : (
                    <>
                      <IconSparkles className="w-4 h-4 text-yellow-300" />
                      <span>Generate with AI</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-xs"
                >
                  <IconCheck className="w-4 h-4" />
                  <span>Apply to Text Field</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
