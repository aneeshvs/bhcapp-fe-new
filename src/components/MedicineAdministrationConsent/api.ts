import api from "@/src/utils/api";

export const saveMedicineAdministrationConsent = async (data: any) => {
  try {
    const isClientView = !!data.isClientView;
    const endpoint = isClientView
      ? "/client/medicine-administration-consent/update"
      : "/medicine-administration-consent/save";

    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error saving Medicine Administration Consent Form:", error);
    throw error;
  }
};

export const fetchMedicineAdministrationConsent = async (uuid: string, userId: string) => {
  try {
    const response = await api.get(`/medicine-administration-consent/${uuid}`, {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Medicine Administration Consent Form:", error);
    throw error;
  }
};

export const fetchMedicineAdministrationConsentUuid = async (userId: string, clientType: string) => {
  try {
    const response = await api.get("/get-medicine-administration-consent-uuid", {
      params: { userid: userId, client_type: clientType },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Medicine Administration Consent Form UUID:", error);
    throw error;
  }
};

export const generateMedicineAdministrationConsentPdf = async (uuid: string) => {
  try {
    const response = await api.get(`/medicine-administration-consent/export-pdf/${uuid}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Medicine_Administration_Consent_${uuid}.pdf`;
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
