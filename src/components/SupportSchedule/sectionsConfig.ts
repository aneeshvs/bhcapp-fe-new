import ScheduleOfSupportsForm from "./Accordian/ScheduleOfSupport";
import FundedSupportsForm from "./Accordian/FundedSupport";
import UnfundedSupportsForm from "./Accordian/UnfundedSupport";
import AgreementSignatures from "./Accordian/AgreementSignature";


export const sectionsConfig = [
    {
        key: 'ScheduleOfSupports',
        title: '1. SCHEDULE OF SUPPORTS',
        Component: ScheduleOfSupportsForm,
    },
    {
        key: 'FundedSupports',
        title: '2. FUNDED SUPPORTS',
        Component: FundedSupportsForm,
    },
    {
        key: 'UnfundedSupports',
        title: '3. UNFUNDED SUPPORTS',
        Component: UnfundedSupportsForm,
    },
    {
        key: 'AgreementSignatures',
        title: '4. AGREEMENT & SIGNATURES',
        Component: AgreementSignatures,
    },
];  