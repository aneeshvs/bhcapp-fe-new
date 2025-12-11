import ConsentsForm from '@/src/components/SupportCarePlan/Accordian/SupportCarePlans';
import AlternativeDecisionMakerForm from '@/src/components/SupportCarePlan/Accordian/AlternativeDecisionMaker';
import SilGoals from '@/src/components/SupportCarePlan/Accordian/SilGoals';
import HomeCareGoals from '@/src/components/SupportCarePlan/Accordian/HomeCare';
import SupportCoordinationGoals from '@/src/components/SupportCarePlan/Accordian/SupportCoordination';
import CommunicationPlan from '@/src/components/SupportCarePlan/Accordian/CommunicationPlan';
import EmergencyForm from '@/src/components/SupportCarePlan/Accordian/Emergency';
import EmergencyContactsForm from '@/src/components/SupportCarePlan/Accordian/EmergencyContact';
import ImportantContactsForm from '@/src/components/SupportCarePlan/Accordian/ImportantContact';
import LocalServicesContactsForm from '@/src/components/SupportCarePlan/Accordian/LocalServiceContacts';
import PlanEmergencyScenariosForm from '@/src/components/SupportCarePlan/Accordian/EmergencyScenarios';


export const sectionsConfig = [
  {
    key: 'SupportCarePlan',
    title: '1. SUPPORT CARE PLAN DETAILS',
    Component: ConsentsForm,
  },
  {
    key: 'AlternativeDecisionMaker',
    title: '2. ALTERNATIVE DECISION MAKER DETAILS',
    Component: AlternativeDecisionMakerForm,
  },
  {
    key: 'SilGoals',
    title: '3. SIL GOALS',
    Component: SilGoals,
  },
  {
    key: 'HomeCares',
    title: '4. HOME CARE',
    Component: HomeCareGoals
  },
  {
    key: 'SupportCoordinations',
    title: '5. SUPPORT COORDINATION',
    Component: SupportCoordinationGoals
  },
  {
    key: 'CommunicationPlan',
    title: '6. COMMUNICATION PLAN',
    Component: CommunicationPlan
  },
  {
    key: 'Emergency',
    title: '7. EMERGENCY DISASTER PLAN',
    Component: EmergencyForm
  },
  {
    key:'EmergencyContact',
    title: '8. EMERGENCY CONTACT',
    Component: EmergencyContactsForm
  },
  {
    key: 'ImportantContact',
    title: '9. IMPORTANT CONTACT',
    Component: ImportantContactsForm
  },
  {
    key: 'LocalServiceContact',
    title: '10. LOCAL SERVICE CONTACT',
    Component: LocalServicesContactsForm
  },{
    key: 'EmergencyScenario',
    title: '11. EMERGENCY SCENARIO',
    Component: PlanEmergencyScenariosForm
  }
]

