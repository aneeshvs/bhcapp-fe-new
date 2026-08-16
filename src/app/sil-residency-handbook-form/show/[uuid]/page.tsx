"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";
import { verifyFormOtp, VerifyOtpResponse, update, show } from "@/src/services/crud";
import Tracker from "@/src/components/Tracker";
import { mapApiResponseToFormData } from "@/src/components/SilResidencyHandbook/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/SilResidencyHandbook/sectionsConfig";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { SilResidencyHandbookResponse } from "@/src/components/SilResidencyHandbook/ApiResponse";
import AgreementFormData from "@/src/components/SilResidencyHandbook/AgreementFormData";
import SilResidencyHandbookSection from "@/src/components/SilResidencyHandbook/SilResidencyHandbookSection";
import phpApi from "@/src/utils/PhpApi";
import api from "@/src/utils/api";

const SECTION_NAMES = [
  "SilResidencyHandbook",
  "ReviewSignatures"
] as const;

type SectionKey = (typeof SECTION_NAMES)[number];

const createInitialOpenSections = (): Record<SectionKey, boolean> => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = true;
    return acc;
  }, {} as Record<SectionKey, boolean>);
};

const createSectionRefs = () => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = React.createRef<HTMLDivElement | null>();
    return acc;
  }, {} as Record<SectionKey, React.RefObject<HTMLDivElement | null>>);
};

export default function ShowSilResidencyHandbookPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const searchParams = useSearchParams();
  const sessionUserId = searchParams.get("userid") || "";
  const sessionClientType = searchParams.get("client_type") || "";
  const mode = searchParams.get("mode") || "";
  
  const [isSignatureOnly, setIsSignatureOnly] = useState(mode === "signature_only");
  const [loading, setLoading] = useState(false);
  const isReadOnly = false;

  const [authenticated, setAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [clientName, setClientName] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  const [formData, setFormData] = useState(AgreementFormData);
  const [formSubmissionError, setFormSubmissionError] = useState("");

  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(initialOpenSections);
  const [isExpandedAll, setIsExpandedAll] = useState(true);

  const toggleExpandAll = () => {
    const nextState = !isExpandedAll;
    setIsExpandedAll(nextState);
    setOpenSections(
      SECTION_NAMES.reduce((acc, sectionKey) => {
        acc[sectionKey] = nextState;
        return acc;
      }, {} as Record<SectionKey, boolean>)
    );
  };

  const scrollToSignature = () => {
    setOpenSections((prev) => ({ ...prev, ReviewSignatures: true }));
    setTimeout(() => {
      const el =
        document.getElementById("participant-signature-pad") ||
        document.getElementById("representative-signature-pad") ||
        document.getElementById("review-signatures-section") ||
        document.getElementById("participant-signature-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  };

  const fetchSignatureMode = useCallback(async () => {
    try {
      const modeResponse = await phpApi.get('/php/check-signature-mode.php', {
        params: {
          uuid,
          form_name: 'sil_residency_handbook'
        }
      });
      if (modeResponse.data.success) {
        setIsSignatureOnly(modeResponse.data.signature_only === 1);
      }
    } catch (err) {
      console.error("Error checking signature mode:", err);
    }
  }, [uuid]);

  const fetchFormData = useCallback(async () => {
    try {
      const response = await show<any>("sil-residency-handbook", uuid as string);
      if (!response?.data) return;
      const handbookData = (response.data as any)?.silResidencyHandbook || response.data;
      if (handbookData?.completion_percentage !== undefined) {
        setCompletionPercentage(handbookData.completion_percentage);
      }
      setFormData(mapApiResponseToFormData(handbookData));
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  }, [uuid]);

  useEffect(() => {
    fetchSignatureMode();
    if (authenticated) {
      fetchFormData();
    }
  }, [fetchSignatureMode, authenticated, fetchFormData]);

  const handleChange = useCallback(
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
        | { target: { name: string; value: string | number | boolean | string[] } }
    ) => {
      const { name, value } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleTrackerClick = useCallback(
    (key: SectionKey) => {
      setOpenSections((prev) => {
        if (prev[key]) {
          return { ...prev, [key]: true };
        }

        const newState = SECTION_NAMES.reduce(
          (acc, sectionKey) => ({ ...acc, [sectionKey]: true }),
          {} as Record<SectionKey, boolean>
        );

        return { ...newState, [key]: true };
      });

      setTimeout(() => {
        sectionRefs[key]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
    [sectionRefs]
  );

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    try {
      const response = await verifyFormOtp(
        uuid as string,
        enteredPassword
      );

      if (response.success) {
        setAuthenticated(true);
        if (response.client_name) {
          setClientName(response.client_name);
        }
      } else {
        setPasswordError(response.message || "Invalid Password");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setPasswordError("Verification failed. Please try again.");
    }
  };

  const handleClientSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setFormSubmissionError("");

      try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            data.append(key, String(value));
          }
        });
        data.append("user_id", sessionUserId || String(formData.user_id || ""));
        data.append("client_type", sessionClientType || String(formData.client_type || "1"));
        if (uuid) data.append("uuid", uuid as string);
        if (isSignatureOnly) data.append("signature_only", "1");
        data.append("submit_final", "1");

        const apiResponse = await api.post(
          "/client/sil-residency-handbook/update",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (apiResponse.data?.success) {
          window.alert("Form submitted successfully!");
          const resData = apiResponse.data.data || {};
          const record = resData.silResidencyHandbook || resData;
          const returnedCompletion = apiResponse.data.completion_percentage ?? resData.completion_percentage ?? record?.completion_percentage;
          if (returnedCompletion !== undefined) {
            setCompletionPercentage(returnedCompletion);
          }
          await fetchFormData();
        } else {
          setFormSubmissionError(apiResponse.data?.message || "Failed to save form.");
        }
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Client submission error:", error);
        setFormSubmissionError(error.response?.data?.message || "An error occurred while submitting.");
      } finally {
        setLoading(false);
      }
    },
    [formData, uuid, sessionUserId, sessionClientType, isSignatureOnly, fetchFormData]
  );

  const completionBarStyle = { width: `${completionPercentage}%` };

  const trackerSteps = useMemo(() => {
    return [
      { key: "SilResidencyHandbook", label: "SIL Residency Handbook" },
      { key: "ReviewSignatures", label: "Review & Signatures" },
    ];
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-md space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">Authentication Required</h2>
            <p className="text-sm text-slate-600 mt-1">Please enter your password / OTP to view this SIL Residency Handbook.</p>
          </div>
          {passwordError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded text-xs">
              {passwordError}
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password / OTP</label>
              <input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                required
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm transition"
            >
              Verify & View Form
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
      {/* Client Info Top Right Box */}
      <div className="flex justify-end gap-4 items-start">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center w-48">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
            {clientName || "N/A"}
          </h1>
        </div>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/assets/images/BHC LOGO_SMALL.png"
          alt="Company Logo"
          width={180}
          height={80}
          className="h-auto"
        />
      </div>

      {/* Progress bar */}
      <div className="text-center mb-4 min-h-[56px]">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className="btn-primary h-4 rounded-full transition-width duration-300"
            style={completionBarStyle}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          Form completion: {completionPercentage}%
        </p>
      </div>

      {/* Title */}
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800 text-center">
          Best of Homecare SIL Residency Handbook
        </h1>
      </div>

      <form
        method="POST"
        onSubmit={handleClientSubmit}
        className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
      >
        {/* Top Action controls inside box */}
        <div className="flex flex-wrap justify-end items-center gap-4 mb-4">
          <div 
            className="flex items-center text-red-600 font-bold bg-yellow-100 px-3 py-1.5 rounded-lg border border-yellow-400 animate-pulse cursor-pointer hover:bg-yellow-200 transition text-sm"
            onClick={scrollToSignature}
          >
            <span className="text-xl mr-2">👉</span>
            <span>Click here to participant signature</span>
          </div>
          <button
            type="button"
            onClick={toggleExpandAll}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition border border-gray-300 shadow-sm text-sm"
          >
            {isExpandedAll ? "Collapse All" : "Expand All"}
          </button>
        </div>

        {/* Tracker */}
        <Tracker
          steps={trackerSteps}
          onStepClick={(key) => handleTrackerClick(key as SectionKey)}
        />

        {formSubmissionError && (
          <div className="p-4 mb-4 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
            {formSubmissionError}
          </div>
        )}

        {sectionsConfig.map(({ key, title, Component }) => (
          <React.Fragment key={key}>
            <AccordianPlanSection
              sectionRef={sectionRefs[key as SectionKey]}
              title={title}
              isOpen={openSections[key as SectionKey]}
              onToggle={() => handleTrackerClick(key as SectionKey)}
            >
              <Component
                formData={formData}
                handleChange={handleChange}
                uuid={uuid as string}
                readOnly={isReadOnly}
              />
            </AccordianPlanSection>
          </React.Fragment>
        ))}

        {/* Submit button */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-white font-medium py-2.5 px-8 rounded-lg transition disabled:opacity-50 shadow"
          >
            {loading ? "Submitting..." : "Submit Signature & Form"}
          </button>
        </div>
      </form>
    </div>
  );
}
