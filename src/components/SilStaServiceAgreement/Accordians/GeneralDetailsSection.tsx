import React from "react";
import { SectionProps } from "../types";
import FormFieldWrapper from "../FormFieldWrapper";

const GeneralDetailsSection: React.FC<SectionProps> = ({ formData, handleChange, uuid }) => {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 text-sm leading-relaxed mb-6">
        This service agreement is for the provision of support (as listed in the schedule of supports) for the period stated below, or for as long as the individual listed above chooses to access the service.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* NDIS Plan Dates */}
        <div>
          <h3 className="text-[#92d050] text-xl font-normal mb-4">NDIS Plan Dates</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormFieldWrapper
              label="Start Date"
              fieldName="ndis_plan_start_date"
              type="date"
              value={formData.ndis_plan_start_date}
              onChange={handleChange}
              uuid={uuid}
              apiEndpoint="/sil-sta-service-agreement/logs"
            />
            <FormFieldWrapper
              label="End Date"
              fieldName="ndis_plan_end_date"
              type="date"
              value={formData.ndis_plan_end_date}
              onChange={handleChange}
              uuid={uuid}
              apiEndpoint="/sil-sta-service-agreement/logs"
            />
          </div>
        </div>

        {/* Service Agreement Dates */}
        <div>
          <h3 className="text-[#92d050] text-xl font-normal mb-4">Service Agreement Dates</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormFieldWrapper
              label="Start Date"
              fieldName="service_agreement_start_date"
              type="date"
              value={formData.service_agreement_start_date}
              onChange={handleChange}
              uuid={uuid}
              apiEndpoint="/sil-sta-service-agreement/logs"
            />
            <FormFieldWrapper
              label="End Date"
              fieldName="service_agreement_end_date"
              type="date"
              value={formData.service_agreement_end_date}
              onChange={handleChange}
              uuid={uuid}
              apiEndpoint="/sil-sta-service-agreement/logs"
            />
          </div>
        </div>
      </div>

      {/* Parties Section (Hardcoded layout per design) */}
      <div className="mb-8 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-[#0070c0] text-2xl font-bold mb-4">Parties</h2>
        <p className="text-sm text-gray-700 mb-6 leading-relaxed">
          This Service Agreement is for a client in the National Disability Insurance Scheme (client), and is made between Best of Homecare and the client, and their representative, as detailed below:
        </p>
        
        <h3 className="text-[#808080] text-lg font-bold mb-1">Best of Homecare Services</h3>
        <p className="text-gray-700 font-medium mb-4">(ABN 63 691 624 877)</p>
        
        <table className="w-full border-collapse border border-gray-300 max-w-2xl">
          <tbody>
            <tr>
              <td className="w-1/3 border border-gray-300 p-2 text-sm font-medium text-gray-700">Address:</td>
              <td className="w-2/3 border border-gray-300 p-0 text-sm h-[40px]">
                <FormFieldWrapper
                  label=""
                  hideLabel={true}
                  fieldName="parties.address"
                  value={formData.parties?.address || ""}
                  onChange={handleChange}
                  uuid={uuid}
                  apiEndpoint="/sil-sta-service-agreement/logs"
                  wrapperClassName="w-full h-full relative"
                  classNameOverride="w-full h-full border-none focus:ring-0 p-2 text-sm bg-transparent"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-sm font-medium text-gray-700">Email:</td>
              <td className="border border-gray-300 p-0 text-sm h-[40px]">
                <FormFieldWrapper
                  label=""
                  hideLabel={true}
                  type="email"
                  fieldName="parties.email"
                  value={formData.parties?.email || ""}
                  onChange={handleChange}
                  uuid={uuid}
                  apiEndpoint="/sil-sta-service-agreement/logs"
                  wrapperClassName="w-full h-full relative"
                  classNameOverride="w-full h-full border-none focus:ring-0 p-2 text-sm bg-transparent"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-sm font-medium text-gray-700">Phone:</td>
              <td className="border border-gray-300 p-0 text-sm h-[40px]">
                <FormFieldWrapper
                  label=""
                  hideLabel={true}
                  fieldName="parties.phone"
                  value={formData.parties?.phone || ""}
                  onChange={handleChange}
                  uuid={uuid}
                  apiEndpoint="/sil-sta-service-agreement/logs"
                  wrapperClassName="w-full h-full relative"
                  classNameOverride="w-full h-full border-none focus:ring-0 p-2 text-sm bg-transparent"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-8">Client Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldWrapper
          label="Name"
          fieldName="client_name"
          value={formData.client_name}
          onChange={handleChange}
          uuid={uuid}
          apiEndpoint="/sil-sta-service-agreement/logs"
        />
        <FormFieldWrapper
          label="NDIS Number"
          fieldName="client_ndis_number"
          value={formData.client_ndis_number}
          onChange={handleChange}
          uuid={uuid}
          apiEndpoint="/sil-sta-service-agreement/logs"
        />
        <FormFieldWrapper
          label="Email"
          fieldName="client_email"
          type="email"
          value={formData.client_email}
          onChange={handleChange}
          uuid={uuid}
          apiEndpoint="/sil-sta-service-agreement/logs"
        />
        <FormFieldWrapper
          label="Phone"
          fieldName="client_phone"
          value={formData.client_phone}
          onChange={handleChange}
          uuid={uuid}
          apiEndpoint="/sil-sta-service-agreement/logs"
        />
        <FormFieldWrapper
          label="Address"
          fieldName="client_address"
          value={formData.client_address}
          onChange={handleChange}
          uuid={uuid}
          apiEndpoint="/sil-sta-service-agreement/logs"
        />
        <FormFieldWrapper
          label="Funding Type"
          fieldName="client_funding_type"
          value={formData.client_funding_type}
          onChange={handleChange}
          uuid={uuid}
          apiEndpoint="/sil-sta-service-agreement/logs"
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-8">Representatives Details (if applicable)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldWrapper
          label="Name"
          fieldName="rep_name"
          value={formData.rep_name}
          onChange={handleChange}
          uuid={uuid}
          apiEndpoint="/sil-sta-service-agreement/logs"
        />
        <FormFieldWrapper
          label="Nature of Legal Authority to sign"
          fieldName="rep_legal_authority"
          value={formData.rep_legal_authority}
          onChange={handleChange}
          uuid={uuid}
          apiEndpoint="/sil-sta-service-agreement/logs"
        />
        <FormFieldWrapper
          label="Email"
          fieldName="rep_email"
          type="email"
          value={formData.rep_email}
          onChange={handleChange}
          uuid={uuid}
          apiEndpoint="/sil-sta-service-agreement/logs"
        />
        <FormFieldWrapper
          label="Phone"
          fieldName="rep_phone"
          value={formData.rep_phone}
          onChange={handleChange}
          uuid={uuid}
          apiEndpoint="/sil-sta-service-agreement/logs"
        />
        <div className="md:col-span-2">
            <FormFieldWrapper
            label="Address"
            fieldName="rep_address"
            value={formData.rep_address}
            onChange={handleChange}
            uuid={uuid}
            apiEndpoint="/sil-sta-service-agreement/logs"
            />
        </div>
      </div>
    </div>
  );
};

export default GeneralDetailsSection;
