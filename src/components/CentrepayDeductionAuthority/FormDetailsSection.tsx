import React from "react";
import { SectionProps } from "./types";
import FormFieldWrapper from "@/src/components/SilStaServiceAgreement/FormFieldWrapper";

const FormDetailsSection: React.FC<SectionProps> = ({ formData, handleChange, uuid }) => {
  const apiEndpoint = "/centrepay-deduction-authority/logs";

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200">
      {/* Header Info */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Best of Home Care</h2>
        <p className="text-sm text-gray-600">1/43, Rainier Crescent, Clyde North. VIC 3978</p>
        <p className="text-sm text-gray-600">L 03 8751 8460 | admin@bestofhomecare.com.au</p>
        <p className="text-sm text-gray-600 font-semibold">ABN: 63691624877</p>
      </div>

      {/* Date Top Row */}
      <div className="flex justify-start items-center mb-6">
        <div className="w-full sm:w-64">
          <FormFieldWrapper
            label="Date"
            fieldName="form_date"
            type="date"
            value={formData.form_date}
            onChange={handleChange}
            uuid={uuid}
            apiEndpoint={apiEndpoint}
          />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 text-center mb-8 border-b pb-4">
        Centrepay Deduction Authority
      </h3>

      {/* Inline Fillable Document Body */}
      <div className="space-y-6 text-gray-800 text-base leading-relaxed">
        {/* Paragraph 1 with Inline Fields */}
        <div className="leading-loose">
          I{" "}
          <FormFieldWrapper
            label="Customer's CRN"
            hideLabel={true}
            fieldName="customer_crn"
            value={formData.customer_crn}
            onChange={handleChange}
            uuid={uuid}
            apiEndpoint={apiEndpoint}
            wrapperClassName="inline-block relative mx-1 align-baseline w-48 sm:w-56"
            classNameOverride="w-full border-b-2 border-blue-600 bg-blue-50/60 px-2 py-1 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-800 focus:bg-white rounded-t transition"
          />{" "}
          (Customer’s CRN) authorise Services Australia to make a Deduction of $
          <FormFieldWrapper
            label="Deduction Amount"
            hideLabel={true}
            fieldName="deduction_amount"
            value={formData.deduction_amount}
            onChange={handleChange}
            uuid={uuid}
            apiEndpoint={apiEndpoint}
            wrapperClassName="inline-block relative mx-1 align-baseline w-28 sm:w-32"
            classNameOverride="w-full border-b-2 border-blue-600 bg-blue-50/60 px-2 py-1 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-800 focus:bg-white rounded-t transition"
          />{" "}
          each fortnight from my{" "}
          <FormFieldWrapper
            label="Name of Centrelink Payment"
            hideLabel={true}
            fieldName="centrelink_payment_name"
            value={formData.centrelink_payment_name}
            onChange={handleChange}
            uuid={uuid}
            apiEndpoint={apiEndpoint}
            wrapperClassName="inline-block relative mx-1 align-baseline w-48 sm:w-56"
            classNameOverride="w-full border-b-2 border-blue-600 bg-blue-50/60 px-2 py-1 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-800 focus:bg-white rounded-t transition"
          />{" "}
          (name of Centrelink payment) and pay this amount to{" "}
          <strong className="font-bold text-gray-900">
            TOM TOM BROTHERS PTY LTD ATF TOM TOM FAMILY TRUST TRADING AS: BEST OF HOMECARE CRN 555 134 851 K
          </strong>{" "}
          for <strong className="font-bold text-gray-900">Disability Community Services</strong> commencing from{" "}
          <FormFieldWrapper
            label="Commencing Date"
            hideLabel={true}
            type="date"
            fieldName="commencing_date"
            value={formData.commencing_date}
            onChange={handleChange}
            uuid={uuid}
            apiEndpoint={apiEndpoint}
            wrapperClassName="inline-block relative mx-1 align-baseline w-40 sm:w-48"
            classNameOverride="w-full border-b-2 border-blue-600 bg-blue-50/60 px-2 py-1 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-800 focus:bg-white rounded-t transition"
          />
          .
        </div>

        {/* Paragraph 2 */}
        <p className="text-gray-800">
          I confirm that this deduction has no target amount and no end date.
        </p>

        {/* Paragraph 3 */}
        <p className="text-gray-800">
          Australian Privacy legislation protects your personal information. I give permission for{" "}
          <strong className="font-bold text-gray-900">
            TOM TOM BROTHERS PTY LTD ATF TOM TOM FAMILY TRUST TRADING AS: BEST OF HOMECARE
          </strong>{" "}
          to disclose my information to Services Australia for the purposes of checking my account number, billing number and amount I want to pay, and reconciling my payment Deduction details.
        </p>

        {/* Paragraph 4 */}
        <p className="text-gray-800">
          I understand that I can change or cancel my Deduction at any time, and further information about Centre pay can be found online at{" "}
          <a
            href="https://servicesaustralia.gov.au/Centrepay"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline font-medium"
          >
            servicesaustralia.gov.au/Centrepay
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default FormDetailsSection;
