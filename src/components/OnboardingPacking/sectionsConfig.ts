import OnboardingPackingSignoffsForm from '@/src/components/OnboardingPacking/Accordians/OnboardingSignoff';
import DisabilityActDiscussionsForm from '@/src/components/OnboardingPacking/Accordians/DisabilityActDiscussions';
import ParticipantDeclarations from '@/src/components/OnboardingPacking/Accordians/ParticipantDeclaration';

export const sectionsConfig = [
    {
        key: 'OnboardingPackingSignoffs',
        title: '1. ONBOARDING & PACKING SIGN-OFFS',
        Component: OnboardingPackingSignoffsForm,
    },
    {
        key: 'DisabilityActDiscussion',
        title: '2. DISABILITY ACT DISCUSSION',
        Component: DisabilityActDiscussionsForm,
    },
    {
        key: 'ParticipantDeclaration',
        title: '3. PARTICIPANT DECLARATION',
        Component: ParticipantDeclarations, // Replace null with the actual component when available
    },
];
