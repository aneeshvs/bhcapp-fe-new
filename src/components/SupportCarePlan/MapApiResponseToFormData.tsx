import { CarePlanResponse } from "@/src/components/SupportCarePlan/ApiResponse";

export function mapApiResponseToFormData(responseData: CarePlanResponse) {
  return {
    form_status: responseData.form_status || '',
    submit_final: responseData.submit_final ?? 0,
    consents_participant_first_name:
      responseData.consents_participant_first_name || "",
    consents_participant_surname:
      responseData.consents_participant_surname || "",
    consents_participant_dob: responseData.consents_participant_dob || "",
    consents_goal_plan_start_date:
      responseData.consents_goal_plan_start_date || "",
    consents_goal_plan_review_date:
      responseData.consents_goal_plan_review_date || "",

    type: responseData.alternate_decision_maker?.type || "",
    first_name: responseData.alternate_decision_maker?.first_name || "",
    surname: responseData.alternate_decision_maker?.surname || "",
    notes: responseData.alternate_decision_maker?.notes || "",

    sil_goals:
      responseData.sil_goals?.map((goal) => ({
        category: goal.category || "",
        goal_title: goal.goal_title || "",
        goals_of_support: goal.goals_of_support || "",
        steps: goal.steps || "",
        organisation_steps: goal.organisation_steps || "",
        risk: goal.risk || "",
        risk_management_strategies: goal.risk_management_strategies || "",
      })) || [],


    helps_me_talk: responseData.communication_plans?.flatMap(plan => plan.helps_me_talk || []) || [],
    helps_me_understand: responseData.communication_plans?.flatMap(plan => plan.helps_me_understand || []) || [],
    please_communicate_by: responseData.communication_plans?.flatMap(plan => plan.please_communicate_by || []) || [],
    emergency_communication: responseData.communication_plans?.map(plan => plan.emergency_communication || "").join(", ") || "",


    participant_name: responseData.emergency_disaster_plan?.participant_name || "",
    date: responseData.emergency_disaster_plan?.date || "",
    review_date: responseData.emergency_disaster_plan?.review_date || "",


    advocate: responseData.important_contacts?.advocate || "",
    childcare_school_contact: responseData.important_contacts?.childcare_school_contact || "",
    power_of_attorney_guardian: responseData.important_contacts?.power_of_attorney_guardian || "",
    workplace_volunteer_contact: responseData.important_contacts?.workplace_volunteer_contact || "",
    landlord_sda_provider: responseData.important_contacts?.landlord_sda_provider || "",
    doctor: responseData.important_contacts?.doctor || "",
    specialist_practitioner: responseData.important_contacts?.specialist_practitioner || "",
    solicitor: responseData.important_contacts?.solicitor || "",
    insurer_home_contents: responseData.important_contacts?.insurer_home_contents || "",
    private_health_cover: responseData.important_contacts?.private_health_cover || "",
    insurer_vehicle: responseData.important_contacts?.insurer_vehicle || "",


    council: responseData.local_services_contact?.council || "",
    hospital: responseData.local_services_contact?.hospital || "",
    electricity: responseData.local_services_contact?.electricity || "",
    water: responseData.local_services_contact?.water || "",

    // ✅ Emergency Scenarios Mapping
    admitted_to_hospital: responseData.emergency_scenario?.admitted_to_hospital ?? 0,
    admitted_to_hospital_action: responseData.emergency_scenario?.admitted_to_hospital_action || "",
    medical_emergencies: responseData.emergency_scenario?.medical_emergencies ?? 0,
    medical_emergencies_action: responseData.emergency_scenario?.medical_emergencies_action || "",
    other_likely_medical_emergency: responseData.emergency_scenario?.other_likely_medical_emergency ?? 0,
    other_likely_medical_emergency_action: responseData.emergency_scenario?.other_likely_medical_emergency_action || "",
    natural_disaster: responseData.emergency_scenario?.natural_disaster ?? 0,
    natural_disaster_action: responseData.emergency_scenario?.natural_disaster_action || "",


  };
}
