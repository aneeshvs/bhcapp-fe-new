import InformationForm from '@/src/components/ConfidentialInformation/Accordians/InformationForm';
import ConfidentialAgenciesForm from '@/src/components/ConfidentialInformation/Accordians/ConfidentialAgency';
import ConfidentialConsents from '@/src/components/ConfidentialInformation/Accordians/ConfidentialConsents';
import VerbalConsents from '@/src/components/ConfidentialInformation/Accordians/VerbalConsents';
import PreConsentDisclosures from '@/src/components/ConfidentialInformation/Accordians/PreConsentDisclosures';

export const sectionsConfig = [
    {
        key: 'ConfidentialInformation',
        title: '1. PARTICIPANT DETAILS',
        Component: InformationForm,
    },
    {
        key: 'ConfidentialAgency',
        title: '2. CONFIDENTIAL AGENCY DETAILS',
        Component: ConfidentialAgenciesForm,
    },
    {
        key: 'ConfidentialConsent',
        title: '3. WRITTEN PARTICIPANT CONSENT',
        Component: ConfidentialConsents,
    },
    {
        key: 'VerbalConsent',
        title: '4. VERBAL CONSENT',
        Component: VerbalConsents,
    },
    {
        key: 'PreConsentDisclosures',
        title: '5. PRE CONSENT DISCLOSURES',
        Component: PreConsentDisclosures,
    }
]