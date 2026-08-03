import React from "react";
import { SilStaServiceAgreementData, SilStaScheduleOfSupport } from "../types";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import FormFieldWrapper from "../FormFieldWrapper";

const ScheduleOfSupportSection: React.FC<{
  formData: SilStaServiceAgreementData;
  handleChange?: (e: any) => void;
  handleScheduleChange: (index: number, field: keyof SilStaScheduleOfSupport, value: string) => void;
  addScheduleRow: () => void;
  removeScheduleRow: (index: number) => void;
}> = ({ 
  formData, 
  handleChange,
  handleScheduleChange, 
  addScheduleRow, 
  removeScheduleRow 
}) => {
  const getTimesData = (support_times?: string) => {
    try {
      if (support_times) {
        const parsed = JSON.parse(support_times);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // Ignore if it's legacy plain text
    }
    return [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
  };

  const handleSupportTimesChange = (index: number, rowIndex: number, colIndex: number, value: string) => {
    const timesData = getTimesData(formData.schedule_of_supports?.[index]?.support_times);
    timesData[rowIndex][colIndex] = value;
    handleScheduleChange(index, 'support_times', JSON.stringify(timesData));
  };

  return (
    <div className="space-y-8">
      {formData.schedule_of_supports?.length === 0 ? (
        <p className="text-center text-gray-500 py-4 border border-dashed border-gray-300 rounded-md bg-white">
          No schedule of supports added yet.
        </p>
      ) : (
        formData.schedule_of_supports?.map((row, index) => (
          <div key={index} className="relative mb-8 bg-white overflow-x-auto">
            <table className="w-full border-collapse border-2 border-black min-w-[800px]">
              <tbody>
                {/* Row 1 */}
                <tr>
                  <td rowSpan={4} className="w-[20%] bg-white border-r-2 border-b-2 border-black align-top p-2">
                    <div className="font-bold text-black">Support Services</div>
                    <FormFieldWrapper
                      type="textarea"
                      label=""
                      hideLabel={true}
                      fieldName="support_services"
                      value={row.support_services || ""}
                      onChange={(e: any) => handleScheduleChange(index, 'support_services', e.target.value)}
                      uuid={formData.uuid}
                      apiEndpoint="/sil-sta-service-agreement/logs"
                      wrapperClassName="w-full h-full relative"
                      classNameOverride="w-full bg-transparent border-none focus:ring-0 p-0 mt-2 text-black text-sm resize-none"
                      rows={10}
                    />
                  </td>
                  <td className="w-[25%] border-r-2 border-b-2 border-black align-top p-2 bg-white">
                    <div className="font-bold text-black text-sm">NDIS Funded<br/>Support</div>
                  </td>
                  <td className="w-[55%] border-b-2 border-black align-top p-0 bg-white">
                    <FormFieldWrapper
                      type="textarea"
                      label=""
                      hideLabel={true}
                      fieldName="ndis_funded_support"
                      value={row.ndis_funded_support || ""}
                      onChange={(e: any) => handleScheduleChange(index, 'ndis_funded_support', e.target.value)}
                      uuid={formData.uuid}
                      apiEndpoint="/sil-sta-service-agreement/logs"
                      wrapperClassName="w-full h-full relative"
                      classNameOverride="w-full h-full min-h-[100px] border-none focus:ring-0 p-2 text-sm resize-none"
                    />
                  </td>
                </tr>
                {/* Row 2 */}
                <tr>
                  <td className="border-r-2 border-b-2 border-black align-top p-2 bg-white">
                    <div className="font-bold text-black text-sm">How the support is<br/>provided</div>
                  </td>
                  <td className="border-b-2 border-black align-top p-0 bg-white">
                    <FormFieldWrapper
                      type="textarea"
                      label=""
                      hideLabel={true}
                      fieldName="how_support_provided"
                      value={row.how_support_provided || ""}
                      onChange={(e: any) => handleScheduleChange(index, 'how_support_provided', e.target.value)}
                      uuid={formData.uuid}
                      apiEndpoint="/sil-sta-service-agreement/logs"
                      wrapperClassName="w-full h-full relative"
                      classNameOverride="w-full h-full min-h-[100px] border-none focus:ring-0 p-2 text-sm resize-none"
                    />
                  </td>
                </tr>
                {/* Row 3 */}
                <tr>
                  <td className="border-r-2 border-b-2 border-black align-top p-2 bg-white">
                    <div className="font-bold text-black text-sm">Non funded NDIS<br/>Support paid<br/>directly by the<br/>Client</div>
                  </td>
                  <td className="border-b-2 border-black align-top p-0 bg-white">
                    <FormFieldWrapper
                      type="textarea"
                      label=""
                      hideLabel={true}
                      fieldName="non_funded_support"
                      value={row.non_funded_support || ""}
                      onChange={(e: any) => handleScheduleChange(index, 'non_funded_support', e.target.value)}
                      uuid={formData.uuid}
                      apiEndpoint="/sil-sta-service-agreement/logs"
                      wrapperClassName="w-full h-full relative"
                      classNameOverride="w-full h-full min-h-[100px] border-none focus:ring-0 p-2 text-sm resize-none"
                    />
                  </td>
                </tr>
                {/* Row 4 */}
                <tr>
                  <td className="border-r-2 border-b-2 border-black align-top p-2 bg-white">
                    <div className="font-bold text-black text-sm">Travel</div>
                  </td>
                  <td className="border-b-2 border-black align-top p-0 bg-white">
                    <FormFieldWrapper
                      type="textarea"
                      label=""
                      hideLabel={true}
                      fieldName="travel"
                      value={row.travel || ""}
                      onChange={(e: any) => handleScheduleChange(index, 'travel', e.target.value)}
                      uuid={formData.uuid}
                      apiEndpoint="/sil-sta-service-agreement/logs"
                      wrapperClassName="w-full h-full relative"
                      classNameOverride="w-full h-full min-h-[80px] border-none focus:ring-0 p-2 text-sm resize-none"
                    />
                  </td>
                </tr>
                
                {/* Row 5 */}
                <tr>
                  <td className="bg-white border-r-2 border-b-2 border-black align-top p-2">
                    <div className="font-bold text-black text-sm">How support will<br/>be provided</div>
                    <div className="font-bold text-black text-sm mt-2">(Program of<br/>supports)</div>
                    <FormFieldWrapper
                      type="textarea"
                      label=""
                      hideLabel={true}
                      fieldName="program_of_supports"
                      value={row.program_of_supports || ""}
                      onChange={(e: any) => handleScheduleChange(index, 'program_of_supports', e.target.value)}
                      uuid={formData.uuid}
                      apiEndpoint="/sil-sta-service-agreement/logs"
                      wrapperClassName="w-full relative mt-2"
                      classNameOverride="w-full bg-transparent border-none focus:ring-0 p-0 text-black text-sm resize-none"
                      rows={5}
                    />
                  </td>
                  <td className="border-r-2 border-b-2 border-black align-top p-2 bg-white">
                    <div className="font-bold underline text-black text-sm mb-2">Support Times</div>
                  </td>
                  <td className="border-b-2 border-black align-top p-2 bg-white">
                    <table className="w-full border-collapse border border-gray-400">
                      <tbody>
                        {getTimesData(row.support_times).map((tRow, rIndex) => (
                          <tr key={rIndex}>
                            {tRow.map((cell: string, cIndex: number) => (
                              <td key={cIndex} className="border border-gray-400 p-0 h-[30px]">
                                <input
                                  type="text"
                                  className="w-full h-full border-none focus:ring-0 p-1 text-sm bg-transparent"
                                  value={cell}
                                  onChange={(e) => handleSupportTimesChange(index, rIndex, cIndex, e.target.value)}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Row 6 */}
                <tr>
                  <td className="bg-white border-r-2 border-black align-top p-2">
                    <div className="font-bold text-black text-sm">Total</div>
                  </td>
                  <td colSpan={2} className="align-top p-0 bg-white">
                    <FormFieldWrapper
                      type="textarea"
                      label=""
                      hideLabel={true}
                      fieldName="total"
                      value={row.total || ""}
                      onChange={(e: any) => handleScheduleChange(index, 'total', e.target.value)}
                      uuid={formData.uuid}
                      apiEndpoint="/sil-sta-service-agreement/logs"
                      wrapperClassName="w-full h-full relative"
                      classNameOverride="w-full h-full min-h-[80px] border-none focus:ring-0 p-2 text-sm resize-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse border-2 border-black min-w-[800px]">
          <tbody>
            <tr>
              <td className="w-[20%] bg-white border-r-2 border-b-2 border-black align-top p-2">
                <div className="font-bold text-black text-sm">Board and Lodging<br/>Contributions<br/>(includes rent,<br/>food, utilities etc)</div>
              </td>
              <td className="w-[80%] align-top p-0 bg-white border-b-2 border-black">
                <div className="p-2 border-b border-gray-200">
                  <span className="font-bold text-black text-sm">Required: </span>
                  <span className="text-black text-sm">See Accommodation Agreement</span>
                </div>
                <FormFieldWrapper
                  type="textarea"
                  label=""
                  hideLabel={true}
                  fieldName="board_and_lodging_contributions"
                  value={formData.board_and_lodging_contributions || ""}
                  onChange={handleChange || (() => {})}
                  uuid={formData.uuid}
                  apiEndpoint="/sil-sta-service-agreement/logs"
                  wrapperClassName="w-full relative"
                  classNameOverride="w-full border-none focus:ring-0 p-2 text-sm min-h-[100px] resize-none"
                />
              </td>
            </tr>
            <tr>
              <td className="bg-white border-r-2 border-black align-top p-2">
                <div className="font-bold text-black text-sm">Payment Terms</div>
              </td>
              <td className="align-top p-0 bg-white">
                <FormFieldWrapper
                  type="textarea"
                  label=""
                  hideLabel={true}
                  fieldName="payment_terms"
                  value={formData.payment_terms || ""}
                  onChange={handleChange || (() => {})}
                  uuid={formData.uuid}
                  apiEndpoint="/sil-sta-service-agreement/logs"
                  wrapperClassName="w-full relative"
                  classNameOverride="w-full border-none focus:ring-0 p-2 text-sm min-h-[100px] resize-none"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleOfSupportSection;
