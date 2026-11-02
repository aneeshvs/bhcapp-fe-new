"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { getFormSession } from "@/src/services/crud";
import { update, show, index } from "@/src/services/crud";
import { me } from "@/src/services/auth";
import { ScheduleOfSupportsFormData } from "@/src/components/SupportSchedule/ApiResponse";
import SupportScheduleFormData from "@/src/components/SupportSchedule/FormData";
import { mapApiResponseToFormData } from "@/src/components/SupportSchedule/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/SupportSchedule/sectionsConfig";
import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { ScheduleResponse } from "@/src/components/SupportSchedule/types";
import { SupportScheduleTracker } from "@/src/components/SupportSchedule/SupportScheduleTracker";
import { FundedSupportsFormData, UnfundedSupportsFormData } from "@/src/components/SupportSchedule/ApiResponse";

import Image from "next/image";
import Link from "next/link";
import LoginModal from "@/src/components/ConfidentialInformation/LoginModal";
import FieldLogsModal from '@/src/components/FieldLogsModal';
import api from "@/src/utils/api";
import { IconLoader, IconFileText } from "@tabler/icons-react";
import PdfExtractionModal from "@/src/components/PdfExtractionModal";

const SECTION_NAMES = [
  "ScheduleOfSupports", "FundedSupports", "UnfundedSupports", "AgreementSignatures"
] as const;

const FundedSupport: FundedSupportsFormData[] =
  [{
    support_name: "",
    description: "",
    price: null,
    unit: null,
    payment_information: "",
    delivery_details: "",
    invoicing_details: "",
    grand_total: null,
    goal_key: "",
  }];


const UnfundedSupport: UnfundedSupportsFormData[] = [];

type SectionKey = (typeof SECTION_NAMES)[number];

type SupportFormaDataType = typeof SupportScheduleFormData;

type ValidationErrors = Record<string, string[]>;

// Utility functions
const createInitialOpenSections = (): Record<SectionKey, boolean> => {
  return SECTION_NAMES.reduce((acc, section) => {
    if (section === "ScheduleOfSupports") {
      acc[section] = true;
    } else {
      acc[section] = false;
    }
    return acc;
  }, {} as Record<SectionKey, boolean>);
};

const createSectionRefs = () => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = React.createRef<HTMLDivElement | null>();
    return acc;
  }, {} as Record<SectionKey, React.RefObject<HTMLDivElement | null>>);
};

export default function SupportCarePlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [sessionClientType, setSessionClientType] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");


  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [formData, setFormData] =
    useState<SupportFormaDataType>(SupportScheduleFormData);
  const [isSilLogsModalOpen, setIsSilLogsModalOpen] = useState(false);
  const [fundedSupportData, setFundedSupportData] =
    useState<FundedSupportsFormData[]>(FundedSupport);
  const [unfundedSupportData, setUnfundedSupportData] =
    useState<UnfundedSupportsFormData[]>(UnfundedSupport);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formSubmissionError, setFormSubmissionError] = useState<string>("");

  // Memoized values
  const sectionRefs = useMemo(() => createSectionRefs(), []);
  const initialOpenSections = useMemo(() => createInitialOpenSections(), []);
  const [openSections, setOpenSections] =
    useState<Record<SectionKey, boolean>>(initialOpenSections);
  const [isExpandedAll, setIsExpandedAll] = useState(false);

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [autofilling, setAutofilling] = useState(false);

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

  const handleAutofill = async () => {
    setAutofilling(true);
    setFormSubmissionError("");
    try {
      const targetUserId = sessionUserId || searchParams.get("userid") || "";
      const targetClientType = sessionClientType || searchParams.get("client_type") || "";

      if (!targetUserId || !targetClientType) {
        alert("Client session identifiers missing. Please ensure userid and client_type are present in the URL.");
        setAutofilling(false);
        return;
      }

      const schema = {
        formData: {
          client_name: "string (Participant full name, e.g. Deborah Turner)",
          participant_name: "string (Participant full name, e.g. Deborah Turner)",
          creation_date: "string (Plan/schedule creation date YYYY-MM-DD)",
          funding_review_date: "string (Funding/plan review date YYYY-MM-DD)",
          support_on_public_holiday: "number (1 if support on public holidays is agreed/requested, 0 otherwise)",
          sil_section_flag: "number (1 if SIL/SDA supported independent living accommodation applies, 0 otherwise)",
          sil_rent_charges: "number (Fortnightly rent charges, default 390.20 if SIL applies)",
          sil_utilities: "number (Fortnightly utilities, default 204.80 if SIL applies)",
          sil_food_groceries: "number (Fortnightly food & groceries, default 200.00 if SIL applies)",
          sil_total_cost: "number (Total fortnightly SIL cost, default 795.00 if SIL applies)",
          agreement_participant_name: "string (Participant full name for signature)",
          participant_date: "string (Date signed YYYY-MM-DD)",
          representative_name: "string (Representative/Nominee/Carer full name, if any)",
          representative_date: "string (Date signed YYYY-MM-DD)"
        },
        fundedSupports: [
          {
            support_name: "string (NDIS support item name or category, e.g. Assistance with Daily Personal Activities, Assistance with Social and Community Participation, Support Coordination, SIL Core Support)",
            description: "string (Comprehensive description of support delivered, schedule, and participant goals addressed)",
            price: "number (Hourly or unit price in AUD, e.g. 67.56)",
            unit: "number (Number of units/hours allocated, e.g. 52 or 104)",
            payment_information: "string (e.g. NDIA Managed, Plan Managed, Self Managed, or Invoiced to Plan Manager)",
            delivery_details: "string (Days, times, and delivery mode, e.g. Monday to Friday 9:00 AM - 1:00 PM in-home and community)",
            invoicing_details: "string (Billing frequency and details, e.g. Fortnightly in arrears to plan manager)",
            grand_total: "number (Calculated total price * unit, e.g. 7026.24)",
            goal_key: "string (Related goal or outcome, optional)"
          }
        ],
        unfundedSupports: [
          {
            unfunded_support_name: "string (Name of unfunded or informal support, e.g. Family and Informal Community Network)",
            unfunded_description: "string (Description of non-funded or community supports assisting participant)",
            unfunded_price_information: "string (e.g. Nil / Provided informally by family)",
            unfunded_delivery_details: "string (e.g. Weekends and as required)",
            unfunded_price: "number (0)",
            unfunded_unit: "number (0)",
            unfunded_grand_total: "number (0)",
            goal_key: "string (Related goal or outcome, optional)"
          }
        ]
      };

      const response = await api.post("/ai/autofill-form", {
        user_id: targetUserId,
        client_type: targetClientType,
        schema: schema
      });

      if (response.data.success) {
        const d = response.data.data;
        const isDummy = (str: string) => {
          const lower = str.trim().toLowerCase();
          return (
            lower === "" ||
            lower === "n/a" ||
            lower === "none" ||
            lower === "unknown" ||
            lower === "undefined" ||
            lower === "not available" ||
            lower === "no information" ||
            lower.includes("not mentioned") ||
            lower.includes("not applicable") ||
            lower.includes("not found") ||
            lower.includes("not specified") ||
            lower.includes("none specified") ||
            lower.includes("not explicitly")
          );
        };

        const parseDateToIso = (rawStr: string) => {
          if (!rawStr) return "";
          const str = rawStr.trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

          const dmyMatch = str.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
          if (dmyMatch) {
            const p1 = parseInt(dmyMatch[1], 10);
            const p2 = parseInt(dmyMatch[2], 10);
            const year = dmyMatch[3];
            if (p1 > 12) {
              return `${year}-${String(p2).padStart(2, "0")}-${String(p1).padStart(2, "0")}`;
            }
            if (p2 > 12) {
              return `${year}-${String(p1).padStart(2, "0")}-${String(p2).padStart(2, "0")}`;
            }
            return `${year}-${String(p2).padStart(2, "0")}-${String(p1).padStart(2, "0")}`;
          }

          const dt = new Date(str);
          if (!isNaN(dt.getTime())) {
            return dt.toISOString().split("T")[0];
          }
          return str;
        };

        if (d.formData) {
          setFormData(prev => {
            const sanitized = { ...prev };
            Object.keys(d.formData).forEach(key => {
              const val = d.formData[key];
              const prevVal = (prev as any)[key];

              if (typeof prevVal === 'number') {
                if (val === 1 || val === "1" || val === true || val === "true" || (typeof val === 'string' && val.trim().toLowerCase() === "yes")) {
                  (sanitized as any)[key] = 1;
                } else if (typeof val === 'number') {
                  (sanitized as any)[key] = val;
                } else if (typeof val === 'string' && !isNaN(parseFloat(val))) {
                  (sanitized as any)[key] = parseFloat(val);
                } else {
                  (sanitized as any)[key] = 0;
                }
              } else if (typeof val === 'string') {
                if (isDummy(val)) {
                  (sanitized as any)[key] = "";
                } else if (key.includes('date')) {
                  (sanitized as any)[key] = parseDateToIso(val);
                } else {
                  (sanitized as any)[key] = val;
                }
              } else if (val !== undefined && val !== null) {
                (sanitized as any)[key] = val;
              }
            });

            // Sync client_name and participant_name
            if (sanitized.participant_name && !sanitized.client_name) {
              sanitized.client_name = sanitized.participant_name;
            } else if (sanitized.client_name && !sanitized.participant_name) {
              sanitized.participant_name = sanitized.client_name;
            }

            if (!sanitized.agreement_participant_name && (sanitized.participant_name || sanitized.client_name)) {
              sanitized.agreement_participant_name = sanitized.participant_name || sanitized.client_name;
            }

            // Recalculate SIL total cost if SIL section flag is active or SIL costs are provided
            if (sanitized.sil_rent_charges || sanitized.sil_utilities || sanitized.sil_food_groceries) {
              const rent = parseFloat(String(sanitized.sil_rent_charges)) || 0;
              const utils = parseFloat(String(sanitized.sil_utilities)) || 0;
              const food = parseFloat(String(sanitized.sil_food_groceries)) || 0;
              sanitized.sil_total_cost = parseFloat((rent + utils + food).toFixed(2));
            }

            return sanitized;
          });
        }

        // Merge funded supports
        const extractedFunded = d.fundedSupports || d.funded_supports;
        if (Array.isArray(extractedFunded) && extractedFunded.length > 0) {
          const mappedFunded: FundedSupportsFormData[] = extractedFunded.map((item: any) => {
            const price = item.price !== null && item.price !== undefined ? parseFloat(String(item.price)) : null;
            const unit = item.unit !== null && item.unit !== undefined ? parseFloat(String(item.unit)) : null;
            let grand_total = item.grand_total !== null && item.grand_total !== undefined ? parseFloat(String(item.grand_total)) : null;
            if ((grand_total === null || isNaN(grand_total)) && price !== null && !isNaN(price) && unit !== null && !isNaN(unit)) {
              grand_total = Math.round(price * unit * 100) / 100;
            }

            return {
              support_name: item.support_name || "",
              description: item.description || "",
              price: price !== null && !isNaN(price) ? price : null,
              unit: unit !== null && !isNaN(unit) ? unit : null,
              payment_information: item.payment_information || "",
              delivery_details: item.delivery_details || "",
              invoicing_details: item.invoicing_details || "",
              grand_total: grand_total !== null && !isNaN(grand_total) ? grand_total : null,
              goal_key: item.goal_key || "",
            };
          });

          setFundedSupportData(mappedFunded);
        }

        // Merge unfunded supports
        const extractedUnfunded = d.unfundedSupports || d.unfunded_supports;
        if (Array.isArray(extractedUnfunded) && extractedUnfunded.length > 0) {
          const mappedUnfunded: UnfundedSupportsFormData[] = extractedUnfunded.map((item: any) => {
            const price = item.unfunded_price !== null && item.unfunded_price !== undefined ? parseFloat(String(item.unfunded_price)) : null;
            const unit = item.unfunded_unit !== null && item.unfunded_unit !== undefined ? parseFloat(String(item.unfunded_unit)) : null;
            let grand_total = item.unfunded_grand_total !== null && item.unfunded_grand_total !== undefined ? parseFloat(String(item.unfunded_grand_total)) : null;
            if ((grand_total === null || isNaN(grand_total)) && price !== null && !isNaN(price) && unit !== null && !isNaN(unit)) {
              grand_total = Math.round(price * unit * 100) / 100;
            }

            return {
              unfunded_support_name: item.unfunded_support_name || "",
              unfunded_description: item.unfunded_description || "",
              unfunded_price_information: item.unfunded_price_information || "",
              unfunded_delivery_details: item.unfunded_delivery_details || "",
              unfunded_price: price !== null && !isNaN(price) ? price : null,
              unfunded_unit: unit !== null && !isNaN(unit) ? unit : null,
              unfunded_grand_total: grand_total !== null && !isNaN(grand_total) ? grand_total : null,
              goal_key: item.goal_key || "",
            };
          });

          setUnfundedSupportData(mappedUnfunded);
        }

        window.alert("Schedule of Supports auto-filled successfully using AI!");
        setIsExpandedAll(true);
        setOpenSections(
          SECTION_NAMES.reduce((acc, sectionKey) => {
            acc[sectionKey] = true;
            return acc;
          }, {} as Record<SectionKey, boolean>)
        );
      } else {
        alert(response.data.message || "Failed to auto-fill form.");
      }
    } catch (e: any) {
      console.error("Autofill Error:", e);
      alert(e.response?.data?.message || e.message || "An error occurred during AI Autofill.");
    } finally {
      setAutofilling(false);
    }
  };


  const getComponentProps = useCallback(
    (key: string) => {
      switch (key) {
        case "FundedSupports":
          return { fundedSupports: fundedSupportData, setFundedSupports: setFundedSupportData };
        case "UnfundedSupports":
          return { unfundedSupports: unfundedSupportData, setUnfundedSupports: setUnfundedSupportData };
        default:
          return {};
      }
    },
    [fundedSupportData, unfundedSupportData]
  );



  // Session bootstrap (token, userid, client_type, optional uuid)
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const form = "schedule-of-support";
        const formUuid = searchParams.get("form-uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";


        if (sessionUserId) setSessionUserId(sessionUserId);
        if (sessionClientType) setSessionClientType(sessionClientType);
        if (formUuid) setSessionUuid(formUuid);

        try {
          const { client_name, uuid } = await getFormSession(form, formUuid, sessionUserId, sessionClientType);
          if (client_name) setClientName(client_name);
          if (uuid) setSessionUuid(uuid);
        } catch (e) {
          console.error("getFormSession failed", e);
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
  }, [searchParams]);

  // Memoized fetch function
  const fetchFormData = useCallback(async () => {
    try {
      const effectiveUuid = sessionUuid;
      if (!effectiveUuid) {
        console.log("No UUID - trying to fetch basic details for autofill");
        if (!sessionUserId) return; // Add early return to avoid 400 bad request
        try {
          const res = await index<any>("get-client-basic-details", { userid: sessionUserId, client_type: sessionClientType });
          if (res.success && res.data) {
            setFormData(prev => ({
              ...prev,
              client_name: res.data.participant_name || '',
              participant_name: res.data.participant_name || '',
            }));
          }
        } catch (err) {
          console.error("Failed to load basic details:", err);
        }
        return;
      }

      const response = await show<ScheduleOfSupportsFormData>(
        "schedule-of-supports",
        effectiveUuid || ""
      );
      console.log(response);

      if (response.data?.completion_percentage !== undefined) {
        setCompletionPercentage(response.data.completion_percentage);
      }

      if (!response?.data) {
        console.log("No service agreement data found");
        return;
      }

      // Set form data from API response
      setFormData(
        mapApiResponseToFormData(response.data) as SupportFormaDataType
      );

      // Map transport array to fundedSupportData
      if (response.data?.transport && Array.isArray(response.data.transport)) {
        setFundedSupportData(response.data.transport);
      }

      // Map unfunded_support array to unfundedSupportData
      if (response.data?.unfunded_support && Array.isArray(response.data.unfunded_support) && response.data.unfunded_support.length > 0) {
        setUnfundedSupportData(response.data.unfunded_support);
      } else {
        // If no unfunded supports from API, keep the initial state (one empty entry)
        // Don't reset to empty array
      }


    } catch (error) {
      console.error("Error fetching service agreement data:", error);
    }
  }, [sessionUuid, sessionUserId, sessionClientType]);

  // Fetch data effect
  useEffect(() => {
    if (sessionUserId && sessionClientType) {
      fetchFormData();
    }
  }, [sessionUuid, sessionUserId, sessionClientType, fetchFormData]);

  // Memoized change handler
  const handleChange = useCallback(
    (
      event:
        | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
        | { target: { name: string; value: string | number | boolean } }
    ) => {
      const { name, value } = event.target;
      setFormData((prev) => {
        const newData = {
          ...prev,
          [name]: value,
        };

        if (
          name === "sil_rent_charges" ||
          name === "sil_utilities" ||
          name === "sil_food_groceries"
        ) {
          const rent = parseFloat(String(newData.sil_rent_charges)) || 0;
          const utils = parseFloat(String(newData.sil_utilities)) || 0;
          const food = parseFloat(String(newData.sil_food_groceries)) || 0;
          newData.sil_total_cost = parseFloat((rent + utils + food).toFixed(2));
        }

        return newData;
      });
    },
    []
  );

  // Memoized tracker click handler
  const handleTrackerClick = useCallback(
    (key: SectionKey) => {
      setOpenSections((prev) => {
        if (prev[key]) {
          return { ...prev, [key]: false };
        }

        const newState = SECTION_NAMES.reduce(
          (acc, sectionKey) => ({
            ...acc,
            [sectionKey]: false,
          }),
          {} as Record<SectionKey, boolean>
        );

        return { ...newState, [key]: true };
      });

      // Delay scroll until after DOM updates
      setTimeout(() => {
        sectionRefs[key]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
    [sectionRefs]
  );

  const scrollToSignature = useCallback(() => {
    if (!openSections["AgreementSignatures"]) {
      handleTrackerClick("AgreementSignatures");
      setTimeout(() => {
        const sigElement = document.getElementById("participant-signature-pad");
        if (sigElement) {
          sigElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    } else {
      const sigElement = document.getElementById("participant-signature-pad");
      if (sigElement) {
        sigElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [openSections, handleTrackerClick]);

  // Function to format field names for display
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted");
      console.log("Current unfundedSupportData state:", unfundedSupportData);
      setLoading(true);
      setValidationErrors({});
      setFormSubmissionError("");


      // Check for token and refresh if missing
      // localStorage.removeItem("token");
      // Check for token and refresh if missing
      // localStorage.removeItem("token");
      if (!localStorage.getItem("token") || localStorage.getItem("token") === "null") {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }


      try {
        const data = new FormData();

        if (formData.submit_final === 1) {
          data.append('submit_final', '1');
        }

        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            data.append(key, String(value));
          }
        });

        data.append("user_id", sessionUserId || "");
        data.append("client_type", sessionClientType || "");

        // Filter out empty funded supports before submitting
        const validFundedSupports = fundedSupportData.filter(support =>
          support.support_name || support.description || support.price || support.unit || support.grand_total
        );
        data.append("funded_supports", JSON.stringify(validFundedSupports));

        // Filter out empty unfunded supports before submitting
        const validUnfundedSupports = unfundedSupportData.filter(support =>
          support.unfunded_support_name || support.unfunded_description ||
          support.unfunded_price || support.unfunded_unit || support.unfunded_grand_total ||
          support.unfunded_price_information || support.unfunded_delivery_details
        );
        console.log("Submitting unfunded supports:", validUnfundedSupports);
        console.log("Raw unfundedSupportData:", unfundedSupportData);
        data.append("unfunded_supports", JSON.stringify(validUnfundedSupports));

        // Include UUID if it exists
        const effectiveUuid = sessionUuid;
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update("schedule-of-support/update", data);
        let response: ScheduleResponse;
        if (apiResponse.success) {
          response = {
            success: true,
            data: apiResponse.data as {
              scheduleOfSupport: { uuid: string; id: number };
            },
          };
          window.alert("Form submitted successfully.");
          setValidationErrors({});
          setFormSubmissionError("");
        } else {
          response = {
            success: false,
            data: apiResponse.data as Record<string, string>,
            message: apiResponse.message,
          };
        }

        if (
          !sessionUuid &&
          response.success &&
          response.data?.scheduleOfSupport?.uuid
        ) {
          const newUuid = response.data.scheduleOfSupport.uuid;
          setSessionUuid(newUuid);
          // Push the UUID to the URL as a query parameter
          router.push(`?form-uuid=${newUuid}&userid=${sessionUserId}&client_type=${sessionClientType}`, { scroll: false });
          await fetchFormData();
        }
        await fetchFormData();

      } catch (err: unknown) {
        const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
        console.error("Submission error:", error);

        if (error.response && error.response.status === 422 && error.response.data?.errors) {
          const newErrors: ValidationErrors = {};
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            newErrors[field] = messages;
          });
          setValidationErrors(newErrors);
          setFormSubmissionError("Please correct the errors below.");
        } else {
          setFormSubmissionError("An error occurred while submitting the form. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      fundedSupportData,
      unfundedSupportData,
      sessionUserId,
      sessionClientType,
      sessionUuid,
      fetchFormData,
      router,
    ]
  );


  useEffect(() => {
    const userId = searchParams.get("userid");
    const clientType = searchParams.get("client_type");

    if (userId) setSessionUserId(userId);
    if (clientType) setSessionClientType(clientType);
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Memoized completion percentage style
  const completionBarStyle = { width: `${completionPercentage}%` };

  const trackerSteps = useMemo(() => {
    return SupportScheduleTracker.map((step) => step);
  }, []);

  return (
    <>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          setFlag(true);
          fetchFormData();
        }}
      />
      {flag ? (
        <div className="px-4 sm:px-8 md:px-12 lg:px-24 mt-6 mb-12">
          <div className="flex justify-end gap-4 items-start">
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition h-fit mt-2"
            >
              Logout
            </button>
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

          <div className="text-center mb-4 min-h-[56px]">
            {/* Reserve height */}
            {sessionUuid ? (
              <>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="btn-primary h-4 rounded-full transition-width duration-300"
                    style={completionBarStyle}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Form completion: {completionPercentage}%
                </p>
              </>
            ) : (
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2"></div>
            )}
          </div>

          <div className="flex justify-center mb-6">
            <h1 className="text-center text-2xl md:text-3xl font-bold mt-2 text-gray-800">
              Service Agreement <br />   Appendix B <br />Schedule of Supports
            </h1>
          </div>

          <form
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          >
            <div className="flex justify-end items-center gap-4 mb-4">
              <div 
                className="flex items-center text-red-600 font-bold bg-yellow-100 px-3 py-1 rounded-lg border border-yellow-400 animate-pulse cursor-pointer hover:bg-yellow-200 transition"
                onClick={scrollToSignature}
              >
                <span className="text-xl mr-2">👉</span>
                <span>Click here to participant signature</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                disabled={autofilling}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition shadow-sm text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {autofilling ? (
                  <>
                    <IconLoader size={18} className="animate-spin" />
                    Auto-filling...
                  </>
                ) : (
                  <>
                    <IconFileText size={18} />
                    PDF Extraction & AI Autofill
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={toggleExpandAll}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition border border-gray-300 shadow-sm text-sm"
              >
                {isExpandedAll ? "Collapse All" : "Expand All"}
              </button>
            </div>
            <Tracker
              steps={trackerSteps}
              onStepClick={(key) => handleTrackerClick(key as SectionKey)}
            />

            {sectionsConfig.map(({ key, title, Component }, index) => (
              <React.Fragment key={key}>
                <AccordianPlanSection
                  key={key}
                  sectionRef={sectionRefs[key as SectionKey]}
                  title={title}
                  isOpen={openSections[key as SectionKey]}
                  onToggle={() => handleTrackerClick(key as SectionKey)}
                >
                  <Component
                    formData={formData}
                    handleChange={handleChange}
                    {...getComponentProps(key)}
                    uuid={sessionUuid || undefined}
                  />
                </AccordianPlanSection>
                {index === 0 && (
                  <div className="section">
                    <div className="font-semibold text-lg mb-4">Transport</div>

                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                      <tbody>

                        <tr className="border-b border-gray-300">
                          <td className="p-3 w-10 text-center align-top">[ ]</td>
                          <td className="p-3 font-medium align-top">Fully funded for transport</td>
                          <td className="p-3 align-top">Funding meets participant transport needs</td>
                          <td className="p-3 align-top">
                            Participant only uses KM funded for $. This figure should be based on _____ cents per kilometre and does not include GST.
                          </td>
                        </tr>

                        <tr className="border-b border-gray-300">
                          <td className="p-3 w-10 text-center align-top">[ ]</td>
                          <td className="p-3 font-medium align-top">Partially funded for transport – converts support hours</td>
                          <td className="p-3 align-top">
                            Indicate core support $ to be converted. Funding does not meet transport needs. Participant converts support hours to pay for KM.
                          </td>
                          <td className="p-3 align-top">
                            Conversion of core support funding into transport must not negatively impact goals and outcomes.
                            Conversion of supports can only occur where participant has transport within their plan,
                            and Core Daily Activity & Transport are managed by Best of Homecare.
                          </td>
                        </tr>

                        <tr className="border-b border-gray-300">
                          <td className="p-3 w-10 text-center align-top">[ ]</td>
                          <td className="p-3 font-medium align-top">Partially funded for transport – converts support hours</td>
                          <td className="p-3 align-top">Indicate core support $ to be converted</td>
                          <td className="p-3 align-top">
                            *Funding does not meet transport needs. Participant converts support hours to pay for KM.<br />
                            *Conversion must not negatively impact goals and outcomes.<br />
                            *Supports can only be converted where the participant has transport within their plan and both Core Daily Activity & Transport are managed by Best of Homecare.
                          </td>
                        </tr>

                        <tr className="border-b border-gray-300">
                          <td className="p-3 w-10 text-center align-top">[ ]</td>
                          <td className="p-3 font-medium align-top">Not funded for transport within NDIS plan</td>
                          <td className="p-3 align-top">Participant is not funded for transport</td>
                          <td className="p-3 align-top">
                            Participant uses public transport or will be invoiced for KM at the rate of _____ cents per KM + GST
                          </td>
                        </tr>

                        <tr>
                          <td className="p-3 w-10 text-center align-top">[ ]</td>
                          <td className="p-3 font-medium align-top">No transport costs</td>
                          <td className="p-3 align-top">
                            Participant has not authorised Best of Homecare to charge for transport
                          </td>
                          <td className="p-3 align-top">
                            Participant uses public transport or does not require transport. If transport is required,
                            costs will be negotiated in advance.
                          </td>
                        </tr>

                      </tbody>
                    </table>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mt-6 mb-6">
                      <strong>Note:</strong><br />
                      Amounts will be listed in the funded and unfunded schedules.<br />
                      Additional transport costs will be invoiced at _____ cents per KM directly to the participant or family monthly. GST will be added where transport costs exceed the amount approved in the funding plan or where there is no transport funding in the plan.<br />
                      Transport may include the use of a staff member vehicle, Best of Homecare vehicle or via public transport.<br />
                      Participant or family to cover any out-of-pocket public transport costs, if required.<br />
                      Where a staff member travels from one participant appointment to another (providing personal care and community access), up to 20 minutes of time can be claimed against the next appointment at the hourly rate for the relevant support item. This will be discussed with you, if it is relevant to the services that you receive from Best of Homecare.
                    </div>
                  </div>
                )}
                {key === "UnfundedSupports" && (
                  <>
                    <div className="section mt-8">
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="sil_section_flag"
                          name="sil_section_flag"
                          checked={!!formData.sil_section_flag}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: "sil_section_flag",
                                value: e.target.checked ? 1 : 0,
                              },
                            })
                          }
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="sil_section_flag" className="font-medium text-gray-700">
                          Include Supported Independent Living Accommodation (SIL/SDA)
                        </label>
                      </div>
                    </div>
                    {!!formData.sil_section_flag && (
                      <div className="section mt-8">
                        <div className="flex justify-between items-center mb-4">
                          <div className="font-semibold text-lg">Supported Independent Living Accommodation - Fortnightly Participants Contribution (SIL/SDA Only)</div>
                          {sessionUuid && (
                            <button
                              type="button"
                              onClick={() => setIsSilLogsModalOpen(true)}
                              className="btn-primary text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                            >
                              View Logs
                            </button>
                          )}
                        </div>
                        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                          <thead className="bg-gray-50 border-b border-gray-300">
                            <tr>
                              <th className="p-3 text-left font-semibold" style={{ width: '70%' }}>Description</th>
                              <th className="p-3 text-left font-semibold" style={{ width: '30%' }}>Amount (Per Fortnight)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-300">
                              <td className="p-3">Rent Charges (Rental cost and Commonwealth rent assistance)</td>
                              <td className="p-3">
                                <div className="flex items-center">
                                  <span className="mr-1">$</span>
                                  <input
                                    type="number"
                                    name="sil_rent_charges"
                                    value={formData.sil_rent_charges ?? ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-1 w-full max-w-[150px]"
                                    step="0.01"
                                    min="0"
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                              <td className="p-3">
                                33% of the total cost of utilities such as electricity, gas, water, and internet
                                <br />
                                <small className="text-gray-500">(Above rates are based on the total cost of utilities for a Year)</small>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center">
                                  <span className="mr-1">$</span>
                                  <input
                                    type="number"
                                    name="sil_utilities"
                                    value={formData.sil_utilities ?? ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-1 w-full max-w-[150px]"
                                    step="0.01"
                                    min="0"
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                              <td className="p-3">
                                Food/Groceries
                                <br />
                                <small className="text-gray-500">(Based on the total cost of the food purchase currently in our SIL accommodation per person)</small>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center">
                                  <span className="mr-1">$</span>
                                  <input
                                    type="number"
                                    name="sil_food_groceries"
                                    value={formData.sil_food_groceries ?? ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-1 w-full max-w-[150px]"
                                    step="0.01"
                                    min="0"
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="p-3"><strong>Total Cost</strong></td>
                              <td className="p-3">
                                <div className="flex items-center font-bold">
                                  <span className="mr-1">$</span>
                                  <input
                                    type="number"
                                    name="sil_total_cost"
                                    value={formData.sil_total_cost ?? ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded p-1 w-full max-w-[150px] font-bold"
                                    step="0.01"
                                    min="0"
                                  />
                                  <span className="ml-2">/ Fortnight</span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}

            {/* Display validation errors */}
            {(Object.keys(validationErrors).length > 0 || formSubmissionError) && (
              <div className="mt-8 p-4 border border-red-300 bg-red-50 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  Please fix the following errors:
                </h3>

                {formSubmissionError && (
                  <p className="text-red-600 mb-3">{formSubmissionError}</p>
                )}

                <ul className="space-y-2">
                  {Object.entries(validationErrors).map(([field, errors]) => (
                    <li key={field} className="text-red-600">
                      <strong className="font-medium">{formatFieldName(field)}:</strong>{" "}
                      {errors.map((error, index) => (
                        <span key={index}>
                          {error}
                          {index < errors.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
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
                checked={formData.submit_final === 1}
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
          </form>

          <FieldLogsModal
            isOpen={isSilLogsModalOpen}
            onClose={() => setIsSilLogsModalOpen(false)}
            uuid={sessionUuid ?? null}
            table="schedule_of_support_sil_sdas"
            field="all"
            url="schedule-of-supports/logs"
          />
        </div>
      ) : (
        // Loader when flag is false
        <div className="flex justify-center items-center min-h-[200px]">
          <span>Loading...</span>
        </div>
      )}
      <PdfExtractionModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        userId={sessionUserId || searchParams.get("userid") || ""}
        clientType={sessionClientType || searchParams.get("client_type") || ""}
        onExtractionComplete={handleAutofill}
      />
    </>
  );
}
