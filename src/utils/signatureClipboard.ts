"use client";

import api from "@/src/utils/api";

// Check if current user has user_type_id = 1 (Admin)
// ONLY user_type_id = 1 is allowed to copy and paste signatures
export function isUserAdmin(): boolean {
  if (typeof window === "undefined") return false;

  const searchParams = new URLSearchParams(window.location.search);

  // 1. Explicit user_type_id in URL query takes highest priority
  const urlUserTypeId =
    searchParams.get("user_type_id") ||
    searchParams.get("usertype_id") ||
    searchParams.get("user_type");

  if (urlUserTypeId !== null) {
    return String(urlUserTypeId) === "1";
  }

  // 2. Explicit admin=0 in URL means not admin
  const adminParam = searchParams.get("admin") || searchParams.get("is_admin");
  if (adminParam === "0" || adminParam === "false") {
    return false;
  }

  // 3. Check stored user_type_id in localStorage / sessionStorage
  const storedUserTypeId =
    localStorage.getItem("user_type_id") ||
    sessionStorage.getItem("user_type_id");
  if (storedUserTypeId !== null && storedUserTypeId !== undefined && storedUserTypeId !== "") {
    return String(storedUserTypeId) === "1";
  }

  // 4. Check user object in localStorage / sessionStorage
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      if (typeof u === "object" && u !== null) {
        if (u.type === "client") return false;
        const utId = u.user_type_id ?? u.user_type?.id ?? u.usertype_id;
        if (utId !== undefined && utId !== null) {
          return Number(utId) === 1;
        }
      }
    } catch {
      // Ignored
    }
  }

  // 5. If admin=1 was passed without conflicting non-admin user_type_id
  if (adminParam === "1" || adminParam === "true") {
    return true;
  }

  return false;
}

// Asynchronous verification against backend /me endpoint if token is present
export async function checkIsUserAdminAsync(): Promise<boolean> {
  const syncResult = isUserAdmin();

  if (typeof window === "undefined") return syncResult;

  const searchParams = new URLSearchParams(window.location.search);
  const urlUserTypeId =
    searchParams.get("user_type_id") ||
    searchParams.get("usertype_id") ||
    searchParams.get("user_type");

  // If URL explicitly specified user_type_id, trust that parameter
  if (urlUserTypeId !== null) {
    return String(urlUserTypeId) === "1";
  }

  const token = localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined") {
    return syncResult;
  }

  try {
    const res = await api.get("me");
    if (res?.data) {
      const utId = res.data.user_type_id ?? res.data.user_type?.id;
      if (utId !== undefined && utId !== null) {
        const isAdmin = Number(utId) === 1;
        localStorage.setItem("user_type_id", String(utId));
        localStorage.setItem("user", JSON.stringify(res.data));
        return isAdmin;
      }
    }
  } catch {
    // Fall back to synchronous check
  }

  return syncResult;
}

// Global signature clipboard keys
const SIGNATURE_CLIPBOARD_KEY = "bhc_copied_signature";
const SIGNATURE_SOURCE_KEY = "bhc_copied_signature_source";

export function copySignatureToClipboard(dataUrl: string, sourceLabel: string = "Signature"): void {
  if (!dataUrl) return;
  try {
    sessionStorage.setItem(SIGNATURE_CLIPBOARD_KEY, dataUrl);
    sessionStorage.setItem(SIGNATURE_SOURCE_KEY, sourceLabel);
  } catch (e) {
    console.error("Failed to write signature to sessionStorage", e);
  }

  if (typeof window !== "undefined") {
    (window as any).__BHC_COPIED_SIGNATURE__ = dataUrl;
    (window as any).__BHC_COPIED_SIGNATURE_SOURCE__ = sourceLabel;
    window.dispatchEvent(
      new CustomEvent("bhc_signature_copied", {
        detail: { dataUrl, sourceLabel },
      })
    );
  }
}

export function getCopiedSignatureFromClipboard(): { dataUrl: string | null; sourceLabel: string } {
  let dataUrl: string | null = null;
  let sourceLabel = "Signature";

  if (typeof window !== "undefined") {
    dataUrl = (window as any).__BHC_COPIED_SIGNATURE__ || null;
    sourceLabel = (window as any).__BHC_COPIED_SIGNATURE_SOURCE__ || "Signature";
  }

  if (!dataUrl && typeof window !== "undefined") {
    try {
      dataUrl = sessionStorage.getItem(SIGNATURE_CLIPBOARD_KEY);
      sourceLabel = sessionStorage.getItem(SIGNATURE_SOURCE_KEY) || "Signature";
    } catch {
      // Ignored
    }
  }

  return { dataUrl, sourceLabel };
}
