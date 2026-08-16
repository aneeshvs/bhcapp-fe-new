import { SilResidencyHandbookData } from "./types";
import { SilResidencyHandbookResponse } from "./ApiResponse";

export function mapApiResponseToFormData(response: SilResidencyHandbookResponse): SilResidencyHandbookData {
  const data = response || {};
  return {
    uuid: data.uuid || "",
    user_id: data.user_id || "",
    client_type: data.client_type || "",
    support_provider: data.support_provider || "Best of Homecare",
    tenancy_contact: data.tenancy_contact || "",
    after_hours_support: data.after_hours_support || "",
    local_advocacy_contact: data.local_advocacy_contact || "",
    acknowledgement: data.acknowledgement || "No",
    signing_as: data.signing_as || data.signer_type || "Participant",
    participant_name: data.participant_name || "",
    relation_to_participant: data.relation_to_participant || data.representative_relation || "",
    date: data.date ? data.date.split("T")[0] : "",
    participant_signature: data.participant_signature || "",
    signer_type: data.signer_type || (data.signing_as ? data.signing_as.toLowerCase() : "participant"),
    participant_date: data.participant_date ? data.participant_date.split("T")[0] : "",
    representative_name: data.representative_name || "",
    representative_relation: data.representative_relation || data.relation_to_participant || "",
    representative_date: data.representative_date ? data.representative_date.split("T")[0] : "",
    representative_signature: data.representative_signature || "",
    guardian_nominee_name: data.guardian_nominee_name || "",
    guardian_nominee_date: data.guardian_nominee_date ? data.guardian_nominee_date.split("T")[0] : "",
    guardian_nominee_signature: data.guardian_nominee_signature || "",
    key_team_member_name: data.key_team_member_name || "",
    key_team_member_date: data.key_team_member_date ? data.key_team_member_date.split("T")[0] : "",
    key_team_member_signature: data.key_team_member_signature || "",
  };
}
