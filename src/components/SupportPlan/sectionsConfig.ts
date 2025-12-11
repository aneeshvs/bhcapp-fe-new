import SupportPlanForm from '@/src/components/SupportPlan/Accordians/SupportPlan';
import SupportPlanApproval from '@/src/components/SupportPlan/Accordians/SupportPlanApproval';
import SupportPlanRepresentatives from '@/src/components/SupportPlan/Accordians/SupportPlanRepresentatives';
import CarePartner from '@/src/components/SupportPlan/Accordians/CarePartner';
import KeepInTouch from '@/src/components/SupportPlan/Accordians/KeepInTouch';
import NonResponsive from '@/src/components/SupportPlan/Accordians/NonResponsive';
import ParticipantDetail from '@/src/components/SupportPlan/Accordians/ParticipantDetail';
import ContactDetail from '@/src/components/SupportPlan/Accordians/ContactDetail';
import ContactDetailsSecondary from '@/src/components/SupportPlan/Accordians/SecondaryContactDetails';
import FundingsForm from '@/src/components/SupportPlan/Accordians/SupportFunding';
import SupportPlanServices from '@/src/components/SupportPlan/Accordians/SupportPlanServices';
import EmployeeMatchingNeedsForm from './Accordians/EmployeeMatchingNeeds';
import SupportPlanMyGoals from './Accordians/SupportPlanMyGoals';
import LivingArrangementsForm from './Accordians/LivingArrangementsForm';
import CulturalDiversitiesForm from './Accordians/CulturalDiversitiesForm';
import GeneralHealthForm from './Accordians/GeneralHealthForm.tsx';
import MedicationManagementForm from './Accordians/MedicationManagementForm';
import MobilityTransfersForm from './Accordians/MobilityTransfersForm';
import FallsRisksForm from './Accordians/FallsRisksForm';
import CognitionsForm from './Accordians/CognitionsForm';
import BehaviourSupportsForm from './Accordians/BehaviourSupportsForm';
import PersonalCaresForm from './Accordians/PersonalCaresForm';
import ContinencesForm from './Accordians/Continences';
import VisionsForm from './Accordians/VisionsForm';
import HearingsForm from './Accordians/HearingsForm';
import SkinConditionsForm from './Accordians/SkinConditionsForm';
import DietariesForm from './Accordians/DietariesForm';
import PainManagementForm from './Accordians/PainManagementForm';
import HomeMaintenancesForm from './Accordians/HomeMaintenancesForm';
import SocialConnectionsForm from './Accordians/SocialConnectionsForm';
import FinancialSupportForm from './Accordians/FinancialSupport';
import InformalSupportsForm from './Accordians/InformalSupportsForm';
import EmergencyReadinessForm from './Accordians/EmergencyReadinessForm';
import FireHeatReadinessForm from './Accordians/FireHeatReadinessForm';
import StormFloodingForm from './Accordians/StormFloodingForm';
import TelecommunicationOutagesForm from './Accordians/TelecommunicationOutagesForm';
import SupportPlanPowerOutages from './Accordians/PowerOutagesForm';
import EndOfLifeAdvancedCareForm from './Accordians/EndOfLifeAdvancedCareForm';

export const sectionsConfig = [
  {
    key: 'SupportPlan',
    title: '1. SUPPORT PLAN DETAILS',
    Component: SupportPlanForm
  },
  {
    key: 'Approval',
    title: '2. SUPPORT PLAN APPROVAL',
    Component: SupportPlanApproval
  },
  {
    key: 'Representatives',
    title: '3. SUPPORT PLAN REPRESENTATIVES',
    Component: SupportPlanRepresentatives
  },
  {
    key: 'CarePartner',
    title: '4. CARE PARTNER DETAILS',
    Component: CarePartner
  },
  {
    key: 'KeepInTouch',
    title: '5. KEEP IN TOUCH',
    Component: KeepInTouch
  },
  {
    key: 'NonResponsive',
    title: '6. NON RESPONSIVE',
    Component: NonResponsive
  },
  {
    key: 'ParticipantDetail',
    title: '7. PARTICIPANT DETAIL',
    Component: ParticipantDetail
  },
  {
    key: 'ContactDetail',
    title: '8. CONTACT DETAIL',
    Component: ContactDetail
  },

  {
    key: 'SecondaryContactDetail',
    title: '9. SECONDARY CONTACT DETAIL',
    Component: ContactDetailsSecondary
  },

  {
    key: 'Funding',
    title: '10. FUNDING DETAILS',
    Component: FundingsForm
  },

  {
    key: 'SupportPlanServices',
    title: '11. SUPPORT PLAN SERVICES',
    Component: SupportPlanServices
  },
  {
    key: 'EmployeeMatchingNeeds',
    title: '12. EMPLOYEE MATCHING NEEDS',
    Component: EmployeeMatchingNeedsForm
  },
  {
    key: 'SupportPlanMyGoals',
    title: '13. MY GOALS',
    Component: SupportPlanMyGoals
  },
  {
    key: 'LivingArrangements',
    title: '14. LIVING ARRANGEMENTS',
    Component: LivingArrangementsForm
  },
  {
    key: 'CulturalDiversities',
    title: '15. CULTURAL DIVERSITIES',
    Component: CulturalDiversitiesForm
  },
  {
    key: 'GeneralHealth',
    title: '16. GENERAL HEALTH',
    Component: GeneralHealthForm
  },
  {
    key: 'MedicationManagement',
    title: '17. MEDICATION MANAGEMENT',
    Component: MedicationManagementForm
  },
  {
    key: 'MobilityTransfers',
    title: '18. MOBILITY TRANSFERS',
    Component: MobilityTransfersForm
  },
  {
    key: 'FallsRisks',
    title: '19. FALLS RISKS',
    Component: FallsRisksForm 
  },
  {
    key: 'Cognitions',
    title: '20. COGNITIONS',
    Component: CognitionsForm
  },
  {
    key: 'BehaviourSupports',
    title: '21. BEHAVIOUR SUPPORTS',
    Component: BehaviourSupportsForm
  },
  {
    key: 'PersonalCare',
    title: '22. PERSONAL CARE',
    Component: PersonalCaresForm
  },
  {
    key: 'Continences',
    title: '23. CONTINENCES',
    Component: ContinencesForm
  },
  {
    key: 'Visions',
    title: '24. VISIONS',
    Component: VisionsForm
  },
  {
    key: 'Hearings',
    title: '25. HEARINGS',
    Component: HearingsForm
  },
  {
    key: 'SkinConditions',
    title: '26. SKIN CONDITIONS',
    Component: SkinConditionsForm
  },
  {
    key: 'Dietaries',
    title: '27. DIETARIES',
    Component: DietariesForm
  },
  {
    key: 'PainManagement',
    title: '28. PAIN MANAGEMENT',
    Component: PainManagementForm
  },
  {
    key: 'SocialConnections',
    title: '29. SOCIAL CONNECTIONS',
    Component: SocialConnectionsForm
  },
  {
    key: 'HomeMaintenances',
    title: '30. HOME MAINTENANCES',
    Component: HomeMaintenancesForm
  },
  {
    key: 'FinancialSupport',
    title: '31. FINANCIAL SUPPORT',
    Component: FinancialSupportForm
  },
  {
    key: 'InformalSupports',
    title: '32. INFORMAL SUPPORTS',
    Component: InformalSupportsForm
  },
  {
    key: 'EmergencyReadiness',
    title: '33. EMERGENCY READINESS',
    Component: EmergencyReadinessForm
  },
  {
    key: 'FireHeatReadiness',
    title: '34. FIRE & HEAT READINESS',
    Component: FireHeatReadinessForm
  },
  {
    key: 'StormFlooding',
    title: '35. STORM & FLOODING READINESS',
    Component: StormFloodingForm
  },
  {
    key: 'TelecommunicationOutages',
    title: '36. TELECOMMUNICATION OUTAGES READINESS',
    Component: TelecommunicationOutagesForm
  },
  {
    key: 'PowerOutages',
    title: '37. POWER OUTAGES READINESS',
    Component: SupportPlanPowerOutages
  },
  {
    key: 'EndOfLifeAdvancedCare',
    title: '38. END OF LIFE ADVANCED CARE',
    Component: EndOfLifeAdvancedCareForm
  }


] as const;
