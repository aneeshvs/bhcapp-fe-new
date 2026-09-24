import FormDetailsSection from "./Accordians/FormDetailsSection";
import SignatureSection from "./Accordians/SignatureSection";

export const sectionsConfig = [
  {
    key: "form_details",
    title: "1. Consent Details & Actions Required",
    Component: FormDetailsSection,
  },
  {
    key: "signatures",
    title: "2. Agreement & Signatures",
    Component: SignatureSection,
  },
];
