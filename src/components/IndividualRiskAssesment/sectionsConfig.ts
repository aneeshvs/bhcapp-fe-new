import RiskAssessmentForm from '@/src/components/IndividualRiskAssesment/Accordians/IndividualRiskAssessment';
import AssessmentDetailsForm  from '@/src/components/IndividualRiskAssesment/Accordians/AssessmentDetailsForm';
import AssessmentCommunicationsForm from '@/src/components/IndividualRiskAssesment/Accordians/AssessmentCommunicationsForm';
import AssessmentCognitionsForm from '@/src/components/IndividualRiskAssesment/Accordians/AssessmentCongnition';
import AssessmentMobilitiesForm from '@/src/components/IndividualRiskAssesment/Accordians/AssessmentMobilities';
import AssessmentPersonalCareForm from '@/src/components/IndividualRiskAssesment/Accordians/AssessmentPersonalCare';
import PlanManualHandlingsForm from '@/src/components/IndividualRiskAssesment/Accordians/PlanManualHandlings'
import AssessmentViolenceRisksForm from '@/src/components/IndividualRiskAssesment/Accordians/AssessmentViolenceRisks';

export const sectionsConfig = [
    {
        key: 'RiskAssessmentDetails',
        title: '1. CLIENT DETAILS',
        Component: RiskAssessmentForm,
    },
    {
        key: 'AssessmentDetails',
        title: '2. VULNERABILITY',
        Component: AssessmentDetailsForm,
    },
    {
        key: 'AssessmentCommunications',
        title: '3. COMMUNICATION',
        Component: AssessmentCommunicationsForm,
    },
    {
        key: 'AssessmentCognitions', // Add this
        title: '4. COGNITIONS',
        Component: AssessmentCognitionsForm,
    },
    {
        key: 'AssesmentMobility',
        title: '5. MOBILITIES',
        Component: AssessmentMobilitiesForm,
    },
    {
        key: 'AssessmentPersonalCare', // Add this
        title: '6. PERSONAL CARE AND SUPPORT',
        Component: AssessmentPersonalCareForm,
    },
    {
        key: 'PlanManualHandlings', // Add this
        title: '7. MANUAL HANDLING (Refer to Manual Handling Handbook)',
        Component: PlanManualHandlingsForm,
    },
    {
        key: 'AssessmentViolenceRisks', // Add this
        title: '8. VIOLENCE RISKS',
        Component: AssessmentViolenceRisksForm,
    },
];
