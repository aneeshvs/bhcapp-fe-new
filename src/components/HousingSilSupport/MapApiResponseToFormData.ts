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
    submit_final: data.submit_final ?? (data.form_status === 'completed' ? 1 : 0),
  };
};
