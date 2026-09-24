import api from "@/src/utils/api";

export const saveFoodPreferenceConsent = async (data: any) => {
  try {
    const isClientView = !!data.isClientView;
    const endpoint = isClientView
      ? "/client/food-preference-consent/update"
      : "/food-preference-consent/save";

    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error saving Food Preference Consent Form:", error);
    throw error;
  }
};

export const fetchFoodPreferenceConsent = async (uuid: string, userId: string) => {
  try {
    const response = await api.get(`/food-preference-consent/${uuid}`, {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Food Preference Consent Form:", error);
    throw error;
  }
};

export const fetchFoodPreferenceConsentUuid = async (userId: string, clientType: string) => {
  try {
    const response = await api.get("/get-food-preference-consent-uuid", {
      params: { userid: userId, client_type: clientType },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Food Preference Consent Form UUID:", error);
    throw error;
  }
};

export const generateFoodPreferenceConsentPdf = async (uuid: string) => {
  try {
    const response = await api.get(`/food-preference-consent/export-pdf/${uuid}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Food_Preference_Consent_${uuid}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
