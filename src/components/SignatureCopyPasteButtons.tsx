"use client";

import React, { useState, useEffect } from "react";
import SignaturePad from "signature_pad";
import {
  isUserAdmin,
  checkIsUserAdminAsync,
  copySignatureToClipboard,
  getCopiedSignatureFromClipboard,
} from "@/src/utils/signatureClipboard";

interface SignatureCopyPasteButtonsProps {
  padRef?: React.MutableRefObject<SignaturePad | null>;
  currentValue?: string;
  onPaste: (dataUrl: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function SignatureCopyPasteButtons({
  padRef,
  currentValue,
  onPaste,
  label = "Signature",
  disabled = false,
}: SignatureCopyPasteButtonsProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [pastedStatus, setPastedStatus] = useState(false);
  const [hasCopiedSig, setHasCopiedSig] = useState(false);
  const [copiedSource, setCopiedSource] = useState("");

  useEffect(() => {
    setIsAdmin(isUserAdmin());

    let isMounted = true;
    checkIsUserAdminAsync().then((admin) => {
      if (isMounted) {
        setIsAdmin(admin);
      }
    });

    const checkCopied = () => {
      if (!isMounted) return;
      const { dataUrl, sourceLabel } = getCopiedSignatureFromClipboard();
      setHasCopiedSig(!!dataUrl);
      setCopiedSource(sourceLabel || "");
    };

    checkCopied();

    // 1. Same-window custom event
    const handleCopiedEvent = () => checkCopied();
    window.addEventListener("bhc_signature_copied", handleCopiedEvent);

    // 2. Cross-tab storage event (fires in other tabs when localStorage changes)
    const handleStorageEvent = (e: StorageEvent) => {
      if (!e.key || e.key === "bhc_copied_signature" || e.key === "bhc_copied_signature_source") {
        checkCopied();
      }
    };
    window.addEventListener("storage", handleStorageEvent);

    // 3. Tab focus event (fires when switching back to this tab)
    const handleFocus = () => checkCopied();
    window.addEventListener("focus", handleFocus);

    // 4. Polling interval fallback (ensures cross-tab sync within 1s)
    const interval = setInterval(checkCopied, 1000);

    return () => {
      isMounted = false;
      window.removeEventListener("bhc_signature_copied", handleCopiedEvent);
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Only render for admin users
  if (!isAdmin) return null;

  const handleCopy = () => {
    let sig = "";

    // 1. Try padRef if drawn
    if (padRef?.current && !padRef.current.isEmpty()) {
      try {
        sig = padRef.current.toDataURL();
      } catch (err) {
        console.warn("pad.toDataURL error", err);
      }
    }

    // 2. Try currentValue (saved dataUrl or url)
    if (!sig && currentValue && typeof currentValue === "string" && currentValue.trim() !== "") {
      sig = currentValue;
    }

    // 3. Fallback: pad might have an image loaded where isEmpty() was true, but canvas has content
    if (!sig && padRef?.current) {
      try {
        const potential = padRef.current.toDataURL();
        if (potential && potential.length > 500) {
          sig = potential;
        }
      } catch {
        // ignore
      }
    }

    if (!sig) {
      window.alert("Please provide or draw a signature first before copying.");
      return;
    }

    copySignatureToClipboard(sig, label);
    setCopiedStatus(true);
    setHasCopiedSig(true);
    setCopiedSource(label);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const handlePaste = () => {
    const { dataUrl } = getCopiedSignatureFromClipboard();
    if (!dataUrl) {
      window.alert("No signature copied yet. Please click 'Copy' on any signature box first.");
      return;
    }

    if (padRef?.current) {
      const pad = padRef.current;
      pad.clear();
      try {
        const canvas = (pad as any).canvas as HTMLCanvasElement | undefined;
        const width = canvas?.offsetWidth || canvas?.width || 300;
        const height = canvas?.offsetHeight || canvas?.height || 128;
        if (canvas && (canvas.width === 0 || canvas.height === 0)) {
          canvas.width = width;
          canvas.height = height;
        }
        pad.fromDataURL(dataUrl, {
          ratio: 1,
          width: width,
          height: height,
        });
      } catch (err) {
        console.warn("pad.fromDataURL ratio load fallback", err);
        pad.fromDataURL(dataUrl);
      }
    }

    onPaste(dataUrl);
    setPastedStatus(true);
    setTimeout(() => setPastedStatus(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-1.5 ml-1">
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        title="Admin: Copy this signature to place into another signature box"
        className={`px-2.5 py-1 text-xs font-medium rounded border transition inline-flex items-center gap-1 ${
          copiedStatus
            ? "bg-green-600 text-white border-green-600 shadow"
            : "bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span>{copiedStatus ? "✓" : "📋"}</span>
        <span>{copiedStatus ? "Copied!" : "Copy"}</span>
      </button>

      <button
        type="button"
        onClick={handlePaste}
        disabled={disabled || !hasCopiedSig}
        title={
          hasCopiedSig
            ? `Admin: Place copied signature (${copiedSource || "Signature"}) into this box`
            : "Admin: Copy a signature from any signature box first"
        }
        className={`px-2.5 py-1 text-xs font-medium rounded border transition inline-flex items-center gap-1 ${
          pastedStatus
            ? "bg-green-600 text-white border-green-600 shadow"
            : hasCopiedSig
            ? "bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100 font-semibold shadow-sm"
            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        } ${disabled || !hasCopiedSig ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span>{pastedStatus ? "✓" : "📥"}</span>
        <span>{pastedStatus ? "Pasted!" : "Paste Signature"}</span>
      </button>
    </div>
  );
}
