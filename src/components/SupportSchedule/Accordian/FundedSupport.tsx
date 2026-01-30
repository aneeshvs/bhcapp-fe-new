'use client';
import React, { useState, useMemo } from "react";
import { destroy } from "@/src/services/crud";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface FundedSupport {
  id?: number;
  schedule_of_support_id?: number;
  support_name?: string;
  description?: string;
  price?: number | null;
  unit?: number | null;
  payment_information?: string;
  invoicing_details?: string;
  delivery_details?: string;
  grand_total?: number | null;
  goal_key?: string;
  status_id?: number;
  owner_id?: number | null;
  owner_type?: string | null;
  created_at?: string;
  deleted_at?: string | null;
  updated_at?: string;
  uuid?: string;
}

interface FundedSupportsProps {
  fundedSupports?: FundedSupport[];
  setFundedSupports?: React.Dispatch<React.SetStateAction<FundedSupport[]>>;
  uuid?: string | null;
}

export default function FundedSupportsForm({
  fundedSupports = [],
  setFundedSupports,
  uuid,
}: FundedSupportsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Track newly added supports that haven't been submitted
  const [unsavedSupportIndexes, setUnsavedSupportIndexes] = useState<
    Set<number>
  >(new Set());

  // Helper function to round to 2 decimal places
  const roundToTwoDecimals = (num: number): number => {
    return Math.round(num * 100) / 100;
  };

  const calculateGrandTotal = (price: number | null | undefined, unit: number | null | undefined): number | null => {
    if (price === null || price === undefined || unit === null || unit === undefined) {
      return null;
    }
    
    const priceNum = Number(price);
    const unitNum = Number(unit);
    
    if (isNaN(priceNum) || isNaN(unitNum)) {
      return null;
    }
    
    // Round to 2 decimal places to avoid floating-point precision issues
    const result = priceNum * unitNum;
    return roundToTwoDecimals(result);
  };

  const handleFieldChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!setFundedSupports) return;
    const { name, value } = e.target;
    const updatedSupports = [...fundedSupports];

    // Convert numeric fields to numbers
    if (name === "price" || name === "grand_total" || name === "unit") {
        if (name === "price") {
        const numValue = value === "" ? null : parseFloat(value);
        updatedSupports[index].price = isNaN(numValue as number)
          ? null
          : numValue;
        
        // Auto-calculate grand total when price changes
        const calculatedGrandTotal = calculateGrandTotal(
          updatedSupports[index].price,
          updatedSupports[index].unit
        );
        updatedSupports[index].grand_total = calculatedGrandTotal;
      } else if (name === "unit") {
        // Allow empty value for better UX when typing
        if (value === "") {
          updatedSupports[index].unit = null;
        } else {
          const numValue = parseFloat(value);
          if (isNaN(numValue) || numValue === null) {
            // If invalid number, keep as null (will show empty)
            updatedSupports[index].unit = null;
          } else if (numValue < 0) {
            // Ensure minimum value is 0
            updatedSupports[index].unit = 0;
          } else {
            // Allow decimals, do not floor
            updatedSupports[index].unit = numValue;
          }
        }
        
        // Auto-calculate grand total when unit changes
        const calculatedGrandTotal = calculateGrandTotal(
          updatedSupports[index].price,
          updatedSupports[index].unit
        );
        updatedSupports[index].grand_total = calculatedGrandTotal;
      } else if (name === "grand_total") {
        // Only allow manual override if needed
        const numValue = value === "" ? null : parseFloat(value);
        if (numValue !== null && !isNaN(numValue)) {
          updatedSupports[index].grand_total = roundToTwoDecimals(numValue);
        } else {
          updatedSupports[index].grand_total = null;
        }
      }
    } else {
      const key = name as keyof FundedSupport;
      if (
        key === "support_name" ||
        key === "description" ||
        key === "payment_information" ||
        key === "invoicing_details" ||
        key === "delivery_details" ||
        key === "goal_key"
      ) {
        updatedSupports[index][key] = value;
      }
    }

    setFundedSupports(updatedSupports);
  };

  const handleRadioChange = (index: number, value: string) => {
    if (!setFundedSupports) return;
    const updatedSupports = [...fundedSupports];
    updatedSupports[index].payment_information = value;
    setFundedSupports(updatedSupports);
  };

  const addFundedSupport = () => {
    if (!setFundedSupports) return;

    const newIndex = fundedSupports.length;
    setFundedSupports([
      ...fundedSupports,
      {
        support_name: "",
        description: "",
        price: null,
        unit: 1, // Set default unit to 1
        payment_information: "",
        invoicing_details: "",
        delivery_details: "",
        grand_total: null,
        goal_key: "",
      },
    ]);

    // Track the index of the newly added support
    setUnsavedSupportIndexes((prev) => new Set([...prev, newIndex]));
  };

  const removeFundedSupport = async (index: number) => {
    if (!setFundedSupports) return;
    const support = fundedSupports[index];

    // Check if this support has a goal_key (submitted to backend)
    const hasGoalKey = !!support.goal_key;

    // Only call API for supports that have goal_key (exist in backend)
    if (hasGoalKey && uuid) {
      try {
        await destroy("schedule-of-support/section/remove", {
          uuid: uuid,
          table: "funded_supports", // Adjust table name as needed
          field: "goal_key",
          value: support.goal_key,
        });
      } catch (error) {
        console.error("Failed to remove support from backend:", error);
        // Even if API call fails, remove from local state
      }
    }

    // Remove from local state regardless of API call success
    const updatedSupports = [...fundedSupports];
    updatedSupports.splice(index, 1);
    setFundedSupports(updatedSupports);

    // Update the unsavedSupportIndexes to adjust indexes
    const updatedIndexes = new Set<number>();
    unsavedSupportIndexes.forEach((unsavedIndex) => {
      if (unsavedIndex > index) {
        updatedIndexes.add(unsavedIndex - 1);
      } else if (unsavedIndex < index) {
        updatedIndexes.add(unsavedIndex);
      }
    });
    setUnsavedSupportIndexes(updatedIndexes);
  };

  const handleViewLogs = () => {
    setIsModalOpen(true);
  };

  // Calculate total grand total from all funded supports
  const totalGrandTotal = useMemo(() => {
    const total = fundedSupports.reduce((sum, support) => {
      const grandTotal = support.grand_total;
      // Handle null, undefined, or NaN values
      if (
        grandTotal === null ||
        grandTotal === undefined ||
        isNaN(Number(grandTotal))
      ) {
        return sum;
      }
      return sum + Number(grandTotal);
    }, 0);
    // Round to 2 decimal places to avoid floating-point issues
    return roundToTwoDecimals(total);
  }, [fundedSupports]);

  const paymentOptions = [
    { label: "NDIA", value: "NDIA" },
    { label: "Self-managed", value: "Self-managed" },
    { label: "Plan managed", value: "Plan managed" },
  ];

  return (
    <div className="mb-4 mt-4 border border-gray-300 rounded shadow bg-white">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h2 className="text-lg font-semibold text-heading">FUNDED SUPPORTS</h2>
        {uuid && (
          <button
            type="button"
            onClick={handleViewLogs}
            className="btn-primary text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            View Logs
          </button>
        )}
      </div>

      <div className="p-4">
        {fundedSupports.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No funded supports added yet.
          </p>
        ) : (
          fundedSupports.map((support, index) => (
            <div
              key={support.id || support.goal_key || support.uuid || index}
              className="grid grid-cols-1 gap-6 mb-6 p-4 rounded relative border border-gray-200"
            >
              {/* Support Name */}
              <div>
                <label className="block mb-1 font-medium">
                  Support Name / Item Number
                </label>
                <input
                  type="text"
                  name="support_name"
                  value={support.support_name || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter support name or item number"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 font-medium">
                  Description of Support
                </label>
                <textarea
                  name="description"
                  placeholder="Enter scope and volume details"
                  value={support.description || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block mb-1 font-medium">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={support.price ?? ""}
                    onChange={(e) => handleFieldChange(index, e)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                {/* Unit */}
                <div>
                  <label className="block mb-1 font-medium">Unit</label>
                  <input
                    type="number"
                    name="unit"
                    placeholder="1"
                    step="0.01"
                    min="0"
                    value={support.unit ?? ""}
                    onChange={(e) => handleFieldChange(index, e)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Default is 1. Change as needed.
                  </p>
                </div>

                {/* Grand Total */}
                <div>
                  <label className="block mb-1 font-medium">
                    Grand Total ($)
                  </label>
                  <input
                    type="number"
                    name="grand_total"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={support.grand_total ?? ""}
                    onChange={(e) => handleFieldChange(index, e)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    readOnly // Make it read-only since it's auto-calculated
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <label className="block mb-1 font-medium">
                  Payment Information
                </label>
                <div className="flex flex-wrap gap-4">
                  {paymentOptions.map(({ label, value }) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`payment_information_${index}`}
                        value={value}
                        checked={support.payment_information === value}
                        onChange={() => handleRadioChange(index, value)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Invoicing Details */}
              <div>
                <label className="block mb-1 font-medium">
                  Invoicing Details
                </label>
                <textarea
                  name="invoicing_details"
                  placeholder="Organization name, email, address, etc."
                  value={support.invoicing_details || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Delivery Details */}
              <div>
                <label className="block mb-1 font-medium">
                  How the support will be provided
                </label>
                <textarea
                  name="delivery_details"
                  placeholder="How, when, where, who provides the support"
                  value={support.delivery_details || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFundedSupport(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                title="Remove this support"
              >
                ❌ Remove
              </button>
            </div>
          ))
        )}

        {/* Add Button */}
        <button
          type="button"
          onClick={addFundedSupport}
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          ➕ Add Another Funded Support
        </button>

        {/* Total Grand Total Display */}
        {fundedSupports.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                Total Grand Total:
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ${totalGrandTotal.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Sum of all funded supports ({fundedSupports.length}{" "}
              {fundedSupports.length === 1 ? "support" : "supports"})
            </p>
          </div>
        )}
        <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
          <div className="text-gray-700 space-y-3 w-full">
            <p className="text-gray-600 mb-4">
              <b>
                Please note:
              </b>
            </p>
            <p>
              Participants being supported to engage in community/social or
              recreational activities within the community will be charged,
              where applicable, up to four hours over the plan period for
              documentation purposes. The schedule of supports can include
              staff member ‘shadow shifts’ (or buddy shifts) up to six hours of
              weekday support per year. Participants receiving core supports
              approve the flexible movement of funding between support types
              noted in the Schedule of Support to meet their needs.
            </p>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="funded_supports" // Adjust table name as needed
        field="all"
        url="support-care-plan/logs" // Adjust URL as needed
      />
    </div>
  );
}