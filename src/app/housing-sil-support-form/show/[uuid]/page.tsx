"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { verifyFormOtp, VerifyOtpResponse, update, show } from "@/src/services/crud";
import Tracker from "@/src/components/Tracker";
import { mapApiResponseToFormData } from "@/src/components/HousingSilSupport/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/HousingSilSupport/sectionsConfig";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { HousingSilSupportResponse } from "@/src/components/HousingSilSupport/ApiResponse";
import AgreementFormaData from "@/src/components/HousingSilSupport/AgreementFormData";

import Image from "next/image";
import phpApi from "@/src/utils/PhpApi";

const SECTION_NAMES = [
  "HousingSilSupport"
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

export default function ShowHousingSilSupportPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const searchParams = useSearchParams();
  const sessionUserId = searchParams.get("userid") || "";
  const sessionClientType = searchParams.get("client_type") || "";
  const mode = searchParams.get("mode") || "";
  
  const [isSignatureOnly, setIsSignatureOnly] = useState(mode === "signature_only");
  const [loading, setLoading] = useState(false);
  const isReadOnly = isSignatureOnly;

  const [authenticated, setAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [clientName, setClientName] = useState("");

  const [formData, setFormData] = useState(AgreementFormaData);
  const [formSubmissionError, setFormSubmissionError] = useState("");

  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(initialOpenSections);

  const fetchSignatureMode = useCallback(async () => {
    try {
      const modeResponse = await phpApi.get('/php/check-signature-mode.php', {
        params: {
          uuid,
          form_name: 'housing-sil-support'
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
      const response = await show<HousingSilSupportResponse>("housing-sil-support", uuid as string);
      if (!response?.data) return;
      setFormData(mapApiResponseToFormData(response.data));
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setFormSubmissionError("");

      try {
        const data = new FormData();
        if (formData.submit_final === 1) {
          data.append('submit_final', '1');
        }

        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && key !== 'submit_final') {
            data.append(key, String(value));
          }
        });

        data.append("user_id", sessionUserId);
        data.append("client_type", sessionClientType);
        if (uuid) data.append("uuid", uuid as string);
        if (isSignatureOnly) data.append("signature_only", "1");

        const apiResponse = await update("housing-sil-support/update", data);

        if (apiResponse.success) {
          window.alert("submitted successfully.");
          await fetchFormData();
        } else {
          setFormSubmissionError(apiResponse.message || "An error occurred");
          window.alert(`Submission failed: ${apiResponse.message}`);
        }
      } catch (err: unknown) {
        console.error("Submission error:", err);
        setFormSubmissionError("An error occurred while submitting the form.");
      } finally {
        setLoading(false);
      }
    },
    [formData, sessionUserId, sessionClientType, uuid, isSignatureOnly, fetchFormData]
  );

  const validatePassword = async (password: string): Promise<VerifyOtpResponse | null> => {
    try {
      const response = await verifyFormOtp(uuid as string, password);
      if (response.success) {
        if (response.client_name) setClientName(response.client_name);
        return response;
      } else {
        setPasswordError("Incorrect password");
        return null;
      }
    } catch (error) {
      console.error("Error validating password:", error);
      setPasswordError("Error validating password. Please try again.");
      return null;
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setLoading(true);

    if (!enteredPassword) {
      setPasswordError("Please enter a password");
      return;
    }

    const data = await validatePassword(enteredPassword);
    if (data) {
      setAuthenticated(true);
    }
    setLoading(false);
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
            className="border px-4 py-2 rounded mb-2 w-full"
          />
          {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    );
  }

  const trackerSteps = [{ key: "HousingSilSupport", label: "Housing & SIL Supports" }];

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
      <div className="flex justify-end gap-4 items-start">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center w-48">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
            {clientName || "N/A"}
          </h1>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <Image
          src="/assets/images/BHC LOGO_SMALL.png"
          alt="Company Logo"
          width={180}
          height={80}
          className="h-auto"
        />
      </div>

      <div className="flex justify-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-800 text-center">
          Review: Your Housing and Your SIL Supports
        </h1>
      </div>

      <form
        method="POST"
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
      >
        <Tracker
          steps={trackerSteps}
          onStepClick={(key) => handleTrackerClick(key as SectionKey)}
        />

        {sectionsConfig.map(({ key, title, Component }) => (
          <React.Fragment key={key}>
            <AccordianPlanSection
              sectionRef={sectionRefs[key as SectionKey]}
              title={title}
              isOpen={openSections[key as SectionKey]}
              onToggle={() => handleTrackerClick(key as SectionKey)}
            >
              <fieldset disabled={isReadOnly && key !== "HousingSilSupport"} className={isReadOnly && key !== "HousingSilSupport" ? "opacity-75 pointer-events-none" : ""}>
                <Component
                  formData={formData}
                  handleChange={handleChange}
                  uuid={uuid as string}
                  // @ts-ignore
                  hideSaveButton={true}
                  // @ts-ignore
                  isSignatureOnly={isSignatureOnly}
                />
              </fieldset>
            </AccordianPlanSection>
          </React.Fragment>
        ))}

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-primary:hover text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="submit_final"
            name="submit_final"
            checked={formData.submit_final === 1 || formData.form_status === 'completed'}
            onChange={e =>
              handleChange({
                target: {
                  name: 'submit_final',
                  value: e.target.checked ? 1 : 0,
                },
              })
            }
            className="mr-2"
          />
          <label className="font-medium text-gray-700">
            Final Submit (Tick to confirm all information is correct)
          </label>
        </div>

        {formSubmissionError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
            {formSubmissionError}
          </div>
        )}
      </form>
    </div>
  );
}
