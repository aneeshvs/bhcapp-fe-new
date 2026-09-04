import GeneralDetailsSection from "./Accordians/GeneralDetailsSection";
import SignatureSection from "./Accordians/SignatureSection";

export const sectionsConfig = [
  {
    key: "GeneralDetailsSection",
    title: "1. GENERAL DETAILS",
    Component: GeneralDetailsSection,
  },
  {
    key: "SignatureSection",
    title: "2. SIGNATURES",
    Component: SignatureSection,
  },
];
