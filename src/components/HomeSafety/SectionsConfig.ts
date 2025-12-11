import HomeSafetyChecklistForm from '@/src/components/HomeSafety/Accordians/HomeSafetyAssessment';
import HomeSafetyOutsideEntriesForm from '@/src/components/HomeSafety/Accordians/HomeSafetyOutside';
import InsideResidencesForm from '@/src/components/HomeSafety/Accordians/InsideResidences';
import HallwaysChecksForm from '@/src/components/HomeSafety/Accordians/HallwaySafety';
import KitchenAssessmentsForm from '@/src/components/HomeSafety/Accordians/KitchenAssessments';
import OutsideAssessmentsForm from '@/src/components/HomeSafety/Accordians/OutsideAssessments';
import HomeMiscellaneousForm from '@/src/components/HomeSafety/Accordians/HomeMiscellaneous';
import HomeResidenceTypesForm from '@/src/components/HomeSafety/Accordians/HomeResidence';
export const sectionsConfig = [
    {
        key: 'HomeSafetyDetails',
        title: '1. HOME SAFETY  PARTICIPANT DETAILS',
        Component: HomeSafetyChecklistForm,
    },
    {
        key: 'HomeSafetyOutside',
        title: '2. HOME SAFETY OUTSIDE ENTRIES (DETAILS)',
        Component: HomeSafetyOutsideEntriesForm,
    },
    {
        key: 'InsideResidences',
        title: '3. INSIDE RESIDENCES',
        Component: InsideResidencesForm,
    },
    {
        key: 'HallwaysChecks',
        title: '4. HALLWAY CHECKS',
        Component: HallwaysChecksForm,
    },
    {
        key: 'KitchenAssessments',
        title: '5. KITCHEN ASSESSMENT',
        Component: KitchenAssessmentsForm,
    },
    {
        key: 'OutsideAssessments',
        title: '6. OUTSIDE ASSESSMENT',
        Component: OutsideAssessmentsForm,
    },
    {
        key: 'HomeMiscellaneous',
        title: '7. MISCELLANEOUS',
        Component: HomeMiscellaneousForm,
    },
    {
        key: 'HomeResidenceTypes',
        title: '8. RESIDENCE TYPES',
        Component: HomeResidenceTypesForm,
    }
]
    
