import { HousingSilSupportData } from "./types";

export const mapApiResponseToFormData = (
  data: HousingSilSupportData
): HousingSilSupportData => {
  return {
    uuid: data.uuid || undefined,
    user_id: data.user_id || "",
    client_type: data.client_type || "",
    form_status: data.form_status || "in_progress",
    completion_percentage: data.completion_percentage || 0,
    
    housing_separate: data.housing_separate || "",
    change_sil_without_losing_home: data.change_sil_without_losing_home || "",
    tenancy_separate: data.tenancy_separate || "",
    explained_to_me: data.explained_to_me || "",
    
    participant_name: data.participant_name || "",
    date: data.date || "",
    support_person: data.support_person || "",
    participant_signature: data.participant_signature || "",
    signer_type: data.signer_type || "participant",
    participant_date: data.participant_date || "",
    representative_name: data.representative_name || "",
    representative_relation: data.representative_relation || "",
    representative_date: data.representative_date || "",
    representative_signature: data.representative_signature || "",
    guardian_nominee_name: data.guardian_nominee_name || "",
    guardian_nominee_date: data.guardian_nominee_date || "",
    guardian_nominee_signature: data.guardian_nominee_signature || "",
    key_team_member_name: data.key_team_member_name || "",
    key_team_member_date: data.key_team_member_date || "",
    key_team_member_signature: data.key_team_member_signature || "",
    submit_final: data.submit_final ?? (data.form_status === 'completed' ? 1 : 0),
  };
};
