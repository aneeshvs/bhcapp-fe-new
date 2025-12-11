import ParticipantRepresentativeForm from "@/src/components/ServiceAgreement/Accordians/ParticipantRepresentative";
import ServiceAgreementConsent from "@/src/components/ServiceAgreement/Accordians/ServiceAgreementConsent";

export const sectionsConfig = [
    {
        key: 'ParticipantRepresentative',
        title: '1. PARTICIPANT & REPRESENTATIVE DETAILS',
        Component: ParticipantRepresentativeForm,
    },
    {
        key: 'ServiceAgreementConsent',
        title: '2. SERVICE AGREEMENT',
        Component: ServiceAgreementConsent,
    },
];