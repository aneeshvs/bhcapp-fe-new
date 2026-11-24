"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { getFormSession } from "@/src/services/crud";
import { update, show, index } from "@/src/services/crud";
import { me } from "@/src/services/auth";
import { HomeSafetyChecklistFormData } from "@/src/components/HomeSafety/ApiResponse";
import HomeSafety from "@/src/components/HomeSafety/FormData";
import { mapApiResponseToFormData } from "@/src/components/HomeSafety/MapApiResponseToFormData";
import { sectionsConfig } from "@/src/components/HomeSafety/SectionsConfig";
import Tracker from "@/src/components/Tracker";
import AccordianPlanSection from "@/src/components/AccordianSection";
import { HomeSafetyResponse } from "@/src/components/HomeSafety/types";
import { HomeSafetyFormTracker } from "@/src/components/HomeSafety/FormTracker";
import Image from "next/image";
import LoginModal from "@/src/components/ConfidentialInformation/LoginModal";
import api from "@/src/utils/api";
import { IconLoader, IconFileText } from "@tabler/icons-react";
import PdfExtractionModal from "@/src/components/PdfExtractionModal";
import { useIsAdmin } from "@/src/utils/adminCheck";

const SECTION_NAMES = [
  "HomeSafetyDetails", "HomeSafetyOutside", "InsideResidences", "HallwaysChecks", "KitchenAssessments", "OutsideAssessments", "HomeMiscellaneous", "HomeResidenceTypes",
] as const;



type SectionKey = (typeof SECTION_NAMES)[number];

type SupportFormaDataType = typeof HomeSafety;

type ValidationErrors = Record<string, string[]>;

// Utility functions
const createInitialOpenSections = (): Record<SectionKey, boolean> => {
  return SECTION_NAMES.reduce((acc, section) => {
    acc[section] = false;
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
    useState<SupportFormaDataType>(HomeSafety);
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

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const isAdmin = useIsAdmin();
  const [autofilling, setAutofilling] = useState(false);

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
          participant_name: "string",
          address: "string",
          phone: "string",
          email: "string",
          is_new_participant: "number (1 if new participant, 0 otherwise)",
          is_review_existing: "number (1 if review of existing participant, 0 otherwise)",
          does_participant_agree: "number (1 if participant/rep agrees with assessment, 0 otherwise)",
          entry_door: "string (MUST BE STRICTLY LOWERCASE: 'front', 'side', 'rear', or 'other')",
          entry_door_other: "string",

          parking_adequate: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          parking_adequate_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          pathway_surface: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          pathway_surface_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          gates_entry_easy: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          gates_entry_easy_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          lighting_adequate: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          lighting_adequate_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          outdoor_fire_hazards: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          outdoor_fire_hazards_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",

          exit_doors_unobstructed: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          exit_doors_unobstructed_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          heaters_suitable: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          heaters_suitable_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          aids_equipment_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          aids_equipment_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          evidence_of_pests: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          evidence_of_pests_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          participant_open_door: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          participant_open_door_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          fire_hazards: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          fire_hazards_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          vacuum_cleaner_ok: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          vacuum_cleaner_ok_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          mop_bucket_ok: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          mop_bucket_ok_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          step_ladder_ok: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          step_ladder_ok_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          cleaning_substances_ok: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          cleaning_substances_ok_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",

          hallways_lounge_dining_bedroom: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          hallways_lounge_dining_bedroom_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          pests_evidence: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          pests_evidence_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          lighting_workspace: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          lighting_workspace_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          furniture_stable: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          furniture_stable_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          bed_adjustable: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          bed_adjustable_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          electrical_switches: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          electrical_switches_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          private_sleep_space: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          private_sleep_space_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          hallways_fire_hazards: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          hallways_fire_hazards_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",

          floor_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          floor_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          electrical_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          electrical_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          ventilation_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          ventilation_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          bench_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          bench_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          stove_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          stove_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          fridge_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          fridge_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          bath_access: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          bath_access_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          toilet_access: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          toilet_access_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          privacy_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          privacy_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          laundry_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          laundry_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          ironing_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          ironing_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          manual_handling_risks: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          manual_handling_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          kitchen_fire_hazards: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          kitchen_fire_hazards_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",

          outside_paths_veranda_steps: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          outside_paths_veranda_steps_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          outside_pets_restrained: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          outside_pets_restrained_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          outside_lighting_adequate: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          outside_lighting_adequate_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          outside_door_easy_open: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          outside_door_easy_open_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          outside_lawn_mower_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          outside_lawn_mower_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          outside_electrical_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          outside_electrical_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          outside_fire_hazards: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          outside_fire_hazards_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",

          misc_children_living_at_home: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          misc_children_living_at_home_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          misc_weapons_stored_appropriately: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          misc_weapons_stored_appropriately_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          misc_smoking_outside_only: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          misc_smoking_outside_only_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          misc_mobility_issues: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          misc_mobility_issues_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          misc_equipment_good_condition: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          misc_equipment_good_condition_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          misc_ppe_requirements: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          misc_ppe_requirements_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          misc_personal_threats: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          misc_personal_threats_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          misc_safe_neighbourhood: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          misc_safe_neighbourhood_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",
          misc_aggression_in_home: "string ('Yes', 'No', 'N/A', or 'Unsure'. If unmarked or no data in document, default 'No')",
          misc_aggression_in_home_strategy: "string (Extract verbatim ANY text or notes from the management strategy column for this question, regardless of whether Yes, No, or N/A; empty string if none)",

          residence_house_type: "string ('Single / Double Storey', 'Private Rental', or 'Care Facility')",
          residence_other_type: "string ('Unit', 'Caravan Park', or 'Office Housing')",
          assessment_completed_with: "string (e.g. Participant, Carer, Family Member, Support Coordinator)",
          name: "string (Staff assessor name)",
          position: "string (Staff assessor position)",
          review_date: "string (Review date YYYY-MM-DD)",
          care_facility: "string"
        }
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

        const ALL_ASSESSMENT_QUESTION_KEYS = [
          'parking_adequate', 'pathway_surface', 'gates_entry_easy', 'lighting_adequate', 'outdoor_fire_hazards',
          'exit_doors_unobstructed', 'heaters_suitable', 'aids_equipment_condition', 'evidence_of_pests', 'participant_open_door',
          'fire_hazards', 'vacuum_cleaner_ok', 'mop_bucket_ok', 'step_ladder_ok', 'cleaning_substances_ok',
          'hallways_lounge_dining_bedroom', 'pests_evidence', 'lighting_workspace', 'furniture_stable', 'bed_adjustable',
          'electrical_switches', 'private_sleep_space', 'hallways_fire_hazards',
          'floor_condition', 'electrical_condition', 'ventilation_condition', 'bench_condition', 'stove_condition',
          'fridge_condition', 'bath_access', 'toilet_access', 'privacy_condition', 'laundry_condition',
          'ironing_condition', 'manual_handling_risks', 'kitchen_fire_hazards',
          'outside_paths_veranda_steps', 'outside_pets_restrained', 'outside_lighting_adequate', 'outside_door_easy_open',
          'outside_lawn_mower_condition', 'outside_electrical_condition', 'outside_fire_hazards',
          'misc_children_living_at_home', 'misc_weapons_stored_appropriately', 'misc_smoking_outside_only', 'misc_mobility_issues',
          'misc_equipment_good_condition', 'misc_ppe_requirements', 'misc_personal_threats', 'misc_safe_neighbourhood',
          'misc_aggression_in_home'
        ];

        const isAssessmentQuestionKey = (key: string) => {
          return ALL_ASSESSMENT_QUESTION_KEYS.includes(key);
        };

        const normalizeAssessmentValue = (val: string) => {
          if (!val) return "";
          const lower = val.trim().toLowerCase();
          if (lower === "yes" || lower === "y" || lower.startsWith("yes") || lower === "true") return "Yes";
          if (lower === "no" || lower === "n" || lower.startsWith("no") || lower === "false") return "No";
          if (lower === "n/a" || lower === "na" || lower === "not applicable" || lower.includes("n/a")) return "N/A";
          if (lower === "unsure" || lower === "not sure" || lower.includes("unsure")) return "Unsure";
          return val;
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
                } else {
                  (sanitized as any)[key] = 0;
                }
              } else if (typeof val === 'string') {
                if (key === 'entry_door') {
                  const lower = val.trim().toLowerCase();
                  if (lower.includes('front')) {
                    (sanitized as any)[key] = 'front';
                  } else if (lower.includes('side')) {
                    (sanitized as any)[key] = 'side';
                  } else if (lower.includes('rear') || lower.includes('back')) {
                    (sanitized as any)[key] = 'rear';
                  } else if (lower.includes('other')) {
                    (sanitized as any)[key] = 'other';
                  } else if (['front', 'side', 'rear', 'other'].includes(lower)) {
                    (sanitized as any)[key] = lower;
                  } else if (lower === '') {
                    (sanitized as any)[key] = '';
                  } else {
                    (sanitized as any)[key] = 'other';
                    if (!(sanitized as any)['entry_door_other']) {
                      (sanitized as any)['entry_door_other'] = val;
                    }
                  }
                } else if (isAssessmentQuestionKey(key)) {
                  // Normalize assessment question ('Yes', 'No', 'N/A', or 'Unsure'; default 'No' if empty)
                  const norm = normalizeAssessmentValue(val);
                  (sanitized as any)[key] = norm || "No";
                } else if (isDummy(val)) {
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

            // Guarantee every single assessment question has a valid value (default to 'No' if unmarked in PDF)
            ALL_ASSESSMENT_QUESTION_KEYS.forEach(qKey => {
              const currentVal = (sanitized as any)[qKey];
              if (!currentVal || !['Yes', 'No', 'N/A', 'Unsure'].includes(currentVal)) {
                (sanitized as any)[qKey] = 'No';
              }
            });

            return sanitized;
          });
        }

        window.alert("Home Safety Checklist Assessment form auto-filled successfully using AI!");
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



  // Session bootstrap (token, userid, client_type, optional uuid)
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const form = "home-safety";
        const formUuid = searchParams.get("form-uuid");
        const sessionUserId = searchParams.get("userid") || "";
        const sessionClientType = searchParams.get("client_type") || "";


        if (sessionUserId) setSessionUserId(sessionUserId);
        if (sessionClientType) setSessionClientType(sessionClientType);
        if (formUuid) setSessionUuid(formUuid);

        // Fetch session data but ignore token
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
              participant_name: res.data.participant_name || '',
              address: res.data.address || '',
              phone: res.data.contact || '',
              email: res.data.email || '',
            }));
          }
        } catch (err) {
          console.error("Failed to load basic details:", err);
        }
        return;
      }

      const response = await show<HomeSafetyChecklistFormData>(
        "home-safety-assessment",
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
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
            if (key === 'entry_door') {
              const valStr = String(value).trim().toLowerCase();
              if (valStr.includes('front')) {
                data.append(key, 'front');
              } else if (valStr.includes('side')) {
                data.append(key, 'side');
              } else if (valStr.includes('rear') || valStr.includes('back')) {
                data.append(key, 'rear');
              } else if (valStr.includes('other')) {
                data.append(key, 'other');
              } else if (['front', 'side', 'rear', 'other'].includes(valStr)) {
                data.append(key, valStr);
              } else if (valStr !== '') {
                data.append(key, 'other');
                if (!formData.entry_door_other) {
                  data.append('entry_door_other', valStr);
                }
              }
            } else {
              data.append(key, String(value));
            }
          }
        });

        data.append("user_id", sessionUserId || "");
        data.append("client_type", sessionClientType || "");

        // Include UUID if it exists
        const effectiveUuid = sessionUuid;
        if (effectiveUuid) {
          data.append("uuid", effectiveUuid);
        }

        const apiResponse = await update("home-safety-assessment/update", data);
        let response: HomeSafetyResponse;
        if (apiResponse.success) {
          response = {
            success: true,
            data: apiResponse.data as {
              homeSafetyChecklistAssessment: { uuid: string; id: number };
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
          response.data?.homeSafetyChecklistAssessment?.uuid
        ) {
          const newUuid = response.data.homeSafetyChecklistAssessment.uuid;
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
    return HomeSafetyFormTracker.map((step) => step);
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
              Form - F5 Home Safety <br />Checklist Assessment
            </h1>
          </div>

          <form
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto"
          >
            <div className="flex justify-end gap-3 mb-4">
              {isAdmin && (<button
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
              </button>)}
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

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">HOW TO USE THIS FORM</h2>
              <p className="text-gray-700 leading-relaxed">
                You are to ensure onsite completion of the Home Safety Check prior to the commencement
                of service delivery. Only complete those areas related to the services to be provided
                and ensure you address potential risks with the Participant and put in place risk controls.
                This safety checklist is to be completed each time changes to the supports or their
                delivery are required, and/or any changes made to the Participant’s Service Agreement
                and/or Support Care Plan.
              </p>
            </div>

            {sectionsConfig.map(({ key, title, Component }) => (
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
                  uuid={sessionUuid || undefined}
                />
              </AccordianPlanSection>
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



            <div className="flex items-center mt-4">
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
          </form>
        </div>
      ) : (
        // Loader when flag is false
        <div className="flex justify-center items-center min-h-[200px]">
          <span>Loading...</span>
        </div>
      )}
      {isAdmin && <PdfExtractionModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        userId={sessionUserId || searchParams.get("userid") || ""}
        clientType={sessionClientType || searchParams.get("client_type") || ""}
        onExtractionComplete={handleAutofill}
      />}
    </>
  );
}
