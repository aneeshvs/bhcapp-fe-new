"use client";

import React, { useState } from "react";
import ReviewSignaturesSection from "../ReviewSignaturesSection";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { HousingSilSupportData } from "./types";

interface Props {
  formData: HousingSilSupportData;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: any } }
  ) => void;
  uuid?: string;
  readOnly?: boolean;
}

const ReviewSignaturesHousingWrapper: React.FC<Props> = ({
  formData,
  handleChange,
  uuid,
  readOnly = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleReviewChange = (field: string, value: string) => {
    handleChange({
      target: { name: field, value },
    });
  };

  return (
    <>
      <ReviewSignaturesSection
        data={formData}
        onChange={handleReviewChange}
        readOnly={readOnly}
        onViewLogs={handleViewLogs}
      />
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? ""}
        table="housing_sil_support"
        field={
          selectedField?.startsWith("rev_sig_")
            ? selectedField.replace("rev_sig_", "")
            : selectedField
        }
        url="housing-sil-support/logs"
      />
    </>
  );
};

export default ReviewSignaturesHousingWrapper;
