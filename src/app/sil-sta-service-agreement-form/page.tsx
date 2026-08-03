"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { IconLoader } from "@tabler/icons-react";
import SilStaServiceAgreementForm from "@/src/components/SilStaServiceAgreement";
import { me } from "@/src/services/auth";
import LoginModal from "@/src/components/ConfidentialInformation/LoginModal";
import { getFormSession } from "@/src/services/crud";

function AdminSilStaServiceAgreementPageContent() {
  const searchParams = useSearchParams();
  const formUuid = searchParams.get("form-uuid") || searchParams.get("uuid") || "";
  const sessionUserId = searchParams.get("userid") || "";
  const sessionClientType = searchParams.get("client_type") || "";

  const [uuid, setUuid] = useState<string>(formUuid);
  const [flag, setFlag] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const form = "sil-sta-service-agreement";

        if (formUuid || sessionUserId) {
          try {
            const session = await getFormSession(form, formUuid, sessionUserId, sessionClientType);
            if (session?.uuid) setUuid(session.uuid);
          } catch (e) {
            console.error("getFormSession failed", e);
          }
        }

        if (token) {
          try {
            await me();
            setFlag(true);
          } catch (e) {
            console.error("Token verification failed", e);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setShowLoginModal(true);
          }
        } else {
          setShowLoginModal(true);
        }
      } catch (e) {
        console.error("Failed to check session", e);
      }
    })();
  }, [searchParams, formUuid, sessionUserId, sessionClientType]);

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          setFlag(true);
        }}
      />
      {flag ? (
        <SilStaServiceAgreementForm
          uuid={uuid || formUuid}
          userid={sessionUserId}
          client_type={sessionClientType}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Checking session...</p>
        </div>
      )}
    </>
  );
}

export default function AdminSilStaServiceAgreementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><IconLoader className="animate-spin mx-auto" size={32} /></div>}>
      <AdminSilStaServiceAgreementPageContent />
    </Suspense>
  );
}
