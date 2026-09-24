import api from "@/src/utils/api";

export const saveCentrepayDeductionAuthority = async (data: any) => {
  try {
    const isClientView = !!data.isClientView;
    const endpoint = isClientView
      ? "/client/centrepay-deduction-authority/update"
      : "/centrepay-deduction-authority/save";

    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error saving Centrepay Deduction Authority Form:", error);
    throw error;
  }
};

export const fetchCentrepayDeductionAuthority = async (uuid: string, userId: string) => {
  try {
    const response = await api.get(`/centrepay-deduction-authority/${uuid}`, {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Centrepay Deduction Authority Form:", error);
    throw error;
  }
};

export const fetchCentrepayDeductionAuthorityUuid = async (userId: string, clientType: string) => {
  try {
    const response = await api.get("/get-centrepay-deduction-authority-uuid", {
      params: { userid: userId, client_type: clientType },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Centrepay Deduction Authority Form UUID:", error);
    throw error;
  }
};

export const generateCentrepayDeductionAuthorityPdf = async (uuid: string) => {
  try {
    const response = await api.get(`/centrepay-deduction-authority/export-pdf/${uuid}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Centrepay_Deduction_Authority_${uuid}.pdf`;
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
