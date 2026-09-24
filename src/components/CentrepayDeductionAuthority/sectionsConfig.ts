import FormDetailsSection from "./FormDetailsSection";
import SignatureSection from "./SignatureSection";

export const sectionsConfig = [
  {
    key: "form_details",
    title: "1. Centrepay Deduction Details",
    Component: FormDetailsSection,
  },
  {
    key: "signatures",
    title: "2. Agreement & Signatures",
    Component: SignatureSection,
  },
];
