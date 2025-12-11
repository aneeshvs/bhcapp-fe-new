import {RiskAssessmentResponse} from './ApiResponse';

export function mapApiResponseToFormData(responseData: RiskAssessmentResponse) {
    return {
        form_status: responseData.form_status || '',
        submit_final: responseData.submit_final ?? 0,
        client_name: responseData.client_name,
        site_address: responseData.site_address,
        assessment_date: responseData.assessment_date,
        planned_review_date: responseData.planned_review_date,


        vulnerability: responseData.details.vulnerability,
        review_frequency: responseData.details.review_frequency,
        dependent_on_homecare: responseData.details.dependent_on_homecare,


        hearing_impairment: responseData.communications.hearing_impairment,
        hearing_hazards: responseData.communications.hearing_hazards,
        hearing_management_plan: responseData.communications.hearing_management_plan,
        speech_impairment: responseData.communications.speech_impairment,
        speech_hazards: responseData.communications.speech_hazards,
        speech_management_plan: responseData.communications.speech_management_plan,


        oriented_in_time_place: responseData.cognitions?.oriented_in_time_place,
        oriented_hazards: responseData.cognitions?.oriented_hazards,
        oriented_management_plan: responseData.cognitions?.oriented_management_plan,
        accepts_direction: responseData.cognitions?.accepts_direction,
        direction_hazards: responseData.cognitions?.direction_hazards,
        direction_management_plan: responseData.cognitions?.direction_management_plan,
        short_term_memory_issues: responseData.cognitions?.short_term_memory_issues,
        memory_hazards: responseData.cognitions?.memory_hazards,
        memory_management_plan: responseData.cognitions?.memory_management_plan,


        walk_unaided: responseData.mobilities?.walk_unaided,
        accessibility_required: responseData.mobilities?.accessibility_required,
        walk_hazards: responseData.mobilities?.walk_hazards,
        walk_management_plan: responseData.mobilities?.walk_management_plan,

        manages_stairs: responseData.mobilities?.manages_stairs,
        stairs_hazards: responseData.mobilities?.stairs_hazards,
        stairs_management_plan: responseData.mobilities?.stairs_management_plan,

        uses_walking_aid: responseData.mobilities?.uses_walking_aid,
        walking_aid_hazards: responseData.mobilities?.walking_aid_hazards,
        walking_aid_management_plan: responseData.mobilities?.walking_aid_management_plan,

        uses_wheelchair: responseData.mobilities?.uses_wheelchair,
        wheelchair_hazards: responseData.mobilities?.wheelchair_hazards,
        wheelchair_management_plan: responseData.mobilities?.wheelchair_management_plan,

        bed_transfer: responseData.mobilities?.bed_transfer,
        bed_transfer_hazards: responseData.mobilities?.bed_transfer_hazards,
        bed_transfer_management_plan: responseData.mobilities?.bed_transfer_management_plan,

        vehicle_transfer: responseData.mobilities?.vehicle_transfer,
        vehicle_transfer_hazards: responseData.mobilities?.vehicle_transfer_hazards,
        vehicle_transfer_management_plan: responseData.mobilities?.vehicle_transfer_management_plan,

        toilet_transfer: responseData.mobilities?.toilet_transfer,
        toilet_transfer_hazards: responseData.mobilities?.toilet_transfer_hazards,
        toilet_transfer_management_plan: responseData.mobilities?.toilet_transfer_management_plan,



        showering: responseData.personal_care_support?.showering,
        showering_hazards: responseData.personal_care_support?.showering_hazards,
        showering_management_plan: responseData.personal_care_support?.showering_management_plan,

        meal: responseData.personal_care_support?.meal,
        meal_hazards: responseData.personal_care_support?.meal_hazards,
        meal_management_plan: responseData.personal_care_support?.meal_management_plan,

        toileting: responseData.personal_care_support?.toileting,
        toileting_hazards: responseData.personal_care_support?.toileting_hazards,
        toileting_management_plan: responseData.personal_care_support?.toileting_management_plan,

        grooming: responseData.personal_care_support?.grooming,
        grooming_hazards: responseData.personal_care_support?.grooming_hazards,
        grooming_management_plan: responseData.personal_care_support?.grooming_management_plan,

        repositioning_bed: responseData.personal_care_support?.repositioning_bed,
        repositioning_bed_hazards: responseData.personal_care_support?.repositioning_bed_hazards,
        repositioning_bed_management_plan: responseData.personal_care_support?.repositioning_bed_management_plan,

        repositioning_chair: responseData.personal_care_support?.repositioning_chair,
        repositioning_chair_hazards: responseData.personal_care_support?.repositioning_chair_hazards,
        repositioning_chair_management_plan: responseData.personal_care_support?.repositioning_chair_management_plan,

        mouthcare: responseData.personal_care_support?.mouthcare,
        mouthcare_hazards: responseData.personal_care_support?.mouthcare_hazards,
        mouthcare_management_plan: responseData.personal_care_support?.mouthcare_management_plan,

        skin_care: responseData.personal_care_support?.skin_care,
        skin_care_hazards: responseData.personal_care_support?.skin_care_hazards,
        skin_care_management_plan: responseData.personal_care_support?.skin_care_management_plan,



        // Physical Aggression
        physical_aggression: responseData.violence_risk?.physical_aggression,
        physical_hazards: responseData.violence_risk?.physical_hazards,
        physical_management_plan: responseData.violence_risk?.physical_management_plan,
        physical_bsp_plan: responseData.violence_risk?.physical_bsp_plan,

        // Verbal Aggression
        verbal_aggression: responseData.violence_risk?.verbal_aggression,
        verbal_hazards: responseData.violence_risk?.verbal_hazards,
        verbal_management_plan: responseData.violence_risk?.verbal_management_plan,
        verbal_bsp_plan: responseData.violence_risk?.verbal_bsp_plan,
        verbal_aggression_notes: responseData.violence_risk?.verbal_aggression_notes,


        // Client Aggression
        client_aggression: responseData.violence_risk?.client_aggression,
        client_hazards: responseData.violence_risk?.client_hazards,
        client_management_plan: responseData.violence_risk?.client_management_plan,
        client_bsp_plan: responseData.violence_risk?.client_bsp_plan,

        // Self Harm
        self_harm: responseData.violence_risk?.self_harm,
        self_harm_hazards: responseData.violence_risk?.self_harm_hazards,
        self_harm_management_plan: responseData.violence_risk?.self_harm_management_plan,
        self_harm_bsp_plan: responseData.violence_risk?.self_harm_bsp_plan,

        // Drug & Alcohol Use
        drug_alcohol_use: responseData.violence_risk?.drug_alcohol_use,
        drug_alcohol_hazards: responseData.violence_risk?.drug_alcohol_hazards,
        drug_alcohol_management_plan: responseData.violence_risk?.drug_alcohol_management_plan,
        drug_alcohol_bsp_plan: responseData.violence_risk?.drug_alcohol_bsp_plan,

        // Sexual Abuse History
        sexual_abuse_history: responseData.violence_risk?.sexual_abuse_history,
        sexual_abuse_hazards: responseData.violence_risk?.sexual_abuse_hazards,
        sexual_abuse_management_plan: responseData.violence_risk?.sexual_abuse_management_plan,
        sexual_abuse_bsp_plan: responseData.violence_risk?.sexual_abuse_bsp_plan,

        // Emotional Manipulation
        emotional_manipulation: responseData.violence_risk?.emotional_manipulation,
        emotional_hazards: responseData.violence_risk?.emotional_hazards,
        emotional_management_plan: responseData.violence_risk?.emotional_management_plan,
        emotional_bsp_plan: responseData.violence_risk?.emotional_bsp_plan,

        // Other Known Risks
        other_known_risks: responseData.violence_risk?.other_known_risks,
        other_risks_hazards: responseData.violence_risk?.other_risks_hazards,
        other_risks_management_plan: responseData.violence_risk?.other_risks_management_plan,
        other_risks_bsp_plan: responseData.violence_risk?.other_risks_bsp_plan,

        // Finance Management
        finance_management: responseData.violence_risk?.finance_management,
        finance_hazards: responseData.violence_risk?.finance_hazards,
        finance_management_plan: responseData.violence_risk?.finance_management_plan,
        finance_bsp_plan: responseData.violence_risk?.finance_bsp_plan,
        finance_management_notes: responseData.violence_risk?.finance_management_notes,
    };
}