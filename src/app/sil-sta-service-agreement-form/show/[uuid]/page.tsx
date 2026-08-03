"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { verifyFormOtp } from "@/src/services/crud";
import phpApi from "@/src/utils/PhpApi";

import SilStaServiceAgreementForm from "@/src/components/SilStaServiceAgreement";

export default function ClientSilStaServiceAgreementPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const searchParams = useSearchParams();
  const userid = searchParams.get("userid") || "";
  const client_type = searchParams.get("client_type") || "";

  const [authenticated, setAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignatureOnly, setIsSignatureOnly] = useState(false);

  const fetchSignatureMode = useCallback(async () => {
    try {
      const modeResponse = await phpApi.get('/php/check-signature-mode.php', {
        params: {
          uuid,
          form_name: 'sil_sta_service_agreement'
        }
      });
      if (modeResponse.data.success) {
        const isSigOnly = modeResponse.data.signature_only === 1;
        setIsSignatureOnly(isSigOnly);
      }
    } catch (err) {
      console.error("Error checking signature mode:", err);
    }
  }, [uuid]);

  useEffect(() => {
    fetchSignatureMode();
  }, [fetchSignatureMode]);

  useEffect(() => {
    document.title = "BHC - SIL/STA Service Agreement";
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await verifyFormOtp(uuid as string, enteredPassword);
      if (res.success) {
        setAuthenticated(true);
        setClientName(res.client_name || "Client");
      } else {
        setPasswordError("Incorrect Password. Please try again.");
      }
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="p-10 max-w-md mx-auto mt-20 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Enter Password to Continue</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            placeholder="Enter password"
            className="border border-blue-500 px-4 py-2 rounded mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-white font-medium py-2 px-6 rounded transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SilStaServiceAgreementForm
        uuid={uuid as string}
        userid={userid}
        client_type={client_type}
        isClientView={true}
        clientName={clientName}
        isSignatureOnly={isSignatureOnly}
      />
    </div>
  );
}
