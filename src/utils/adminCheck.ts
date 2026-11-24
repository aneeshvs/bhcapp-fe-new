"use client";
import { useState, useEffect } from "react";

/**
 * Checks if the currently authenticated user in Laravel backend (bhc-be) is an Admin.
 * In bhc-be users table: user_type_id === 1 is Admin.
 * 
 * NOTE: We strictly check user_type_id === 1 from the authenticated Laravel session/localStorage,
 * and DO NOT rely on the URL ?admin=1 query parameter (which is passed from Core PHP for token signature permissions).
 */
export function isUserAdmin(
  // Optional parameter for backwards compatibility with any calls passing searchParams
  _searchParams?: any
): boolean {
  if (typeof window === "undefined") return false;

  try {
    const utId = localStorage.getItem("user_type_id");
    if (utId === "1" || utId === 1 as any) {
      return true;
    }

    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const id = user?.user_type_id ?? user?.user_type?.id;
      if (id === 1 || id === "1") {
        return true;
      }
    }
  } catch {
    // ignore json error
  }

  return false;
}

/**
 * React hook that dynamically returns whether the current user is Admin (user_type_id == 1 in bhc-be).
 * Automatically updates when login completes or when me() refreshes the user session.
 */
export function useIsAdmin(_searchParams?: any): boolean {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    setIsAdmin(isUserAdmin());

    const handleAuthChange = () => {
      setIsAdmin(isUserAdmin());
    };

    window.addEventListener("auth_state_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth_state_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return isAdmin;
}
