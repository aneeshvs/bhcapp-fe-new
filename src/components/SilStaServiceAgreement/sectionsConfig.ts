import GeneralDetailsSection from "./Accordians/GeneralDetailsSection";
import ScheduleOfSupportSection from "./Accordians/ScheduleOfSupportSection";
import SignatureSection from "./Accordians/SignatureSection";

export const sectionsConfig = [
  {
    key: "GeneralDetailsSection",
    title: "1. GENERAL DETAILS",
    Component: GeneralDetailsSection,
  },
  {
    key: "ScheduleOfSupportSection",
    title: "2. SCHEDULE OF SUPPORT",
    Component: ScheduleOfSupportSection,
  },
  {
    key: "SignatureSection",
    title: "3. SIGNATURES",
    Component: SignatureSection,
  },
];
