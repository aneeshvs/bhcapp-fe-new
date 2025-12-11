"use client";
import React, { useState, useMemo } from "react";
import { destroy } from "@/src/services/crud";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface UnfundedSupport {
  id?: number;
  schedule_of_support_id?: number;
  unfunded_support_name?: string;
  unfunded_description?: string;
  unfunded_price_information?: string;
  unfunded_delivery_details?: string;
  unfunded_price?: number | null;
  unfunded_unit?: number | null;
  unfunded_grand_total?: number | null;
  goal_key?: string;
  status_id?: number;
  owner_id?: number | null;
  owner_type?: string | null;
  created_at?: string;
  deleted_at?: string | null;
  updated_at?: string;
  uuid?: string;
}

interface UnfundedSupportsProps {
  unfundedSupports?: UnfundedSupport[];
  setUnfundedSupports?: React.Dispatch<React.SetStateAction<UnfundedSupport[]>>;
  uuid?: string | null;
}

export default function UnfundedSupportsForm({
  unfundedSupports = [],
  setUnfundedSupports,
  uuid,
}: UnfundedSupportsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Track newly added supports that haven't been submitted
  const [unsavedSupportIndexes, setUnsavedSupportIndexes] = useState<
    Set<number>
  >(new Set());
  
  // Helper function to round to 2 decimal places
  const roundToTwoDecimals = (num: number): number => {
    return Math.round(num * 100) / 100;
  };

  const calculateGrandTotal = (unfunded_price: number | null | undefined, unfunded_unit: number | null | undefined): number | null => {
    if (unfunded_price === null || unfunded_price === undefined || unfunded_unit === null || unfunded_unit === undefined) {
      return null;
    }
    
    const priceNum = Number(unfunded_price);
    const unitNum = Number(unfunded_unit);
    
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
    if (!setUnfundedSupports) return;
    const { name, value } = e.target;
    const updatedSupports = [...unfundedSupports];

    // Convert numeric fields to numbers
    if (name === "unfunded_price" || name === "unfunded_grand_total" || name === "unfunded_unit") {
      if (name === "unfunded_price") {
        const numValue = value === "" ? null : parseFloat(value);
        updatedSupports[index].unfunded_price = isNaN(numValue as number)
          ? null
          : numValue;
        
        // Auto-calculate grand total when price changes
        const calculatedGrandTotal = calculateGrandTotal(
          updatedSupports[index].unfunded_price,
          updatedSupports[index].unfunded_unit
        );
        updatedSupports[index].unfunded_grand_total = calculatedGrandTotal;
      } else if (name === "unfunded_unit") {
        // Allow empty value for better UX when typing
        if (value === "") {
          updatedSupports[index].unfunded_unit = null;
        } else {
          const numValue = parseFloat(value);
          if (isNaN(numValue) || numValue === null) {
            // If invalid number, keep as null (will show empty)
            updatedSupports[index].unfunded_unit = null;
          } else if (numValue < 1) {
            // Ensure minimum value is 1
            updatedSupports[index].unfunded_unit = 1;
          } else {
            // Ensure unit is a whole number
            updatedSupports[index].unfunded_unit = Math.floor(numValue);
          }
        }
        
        // Auto-calculate grand total when unit changes
        const calculatedGrandTotal = calculateGrandTotal(
          updatedSupports[index].unfunded_price,
          updatedSupports[index].unfunded_unit
        );
        updatedSupports[index].unfunded_grand_total = calculatedGrandTotal;
      } else if (name === "unfunded_grand_total") {
        // Only allow manual override if needed
        const numValue = value === "" ? null : parseFloat(value);
        if (numValue !== null && !isNaN(numValue)) {
          updatedSupports[index].unfunded_grand_total = roundToTwoDecimals(numValue);
        } else {
          updatedSupports[index].unfunded_grand_total = null;
        }
      }
    } else {
      const key = name as keyof UnfundedSupport;
      if (
        key === "unfunded_support_name" ||
        key === "unfunded_description" ||
        key === "unfunded_price_information" ||
        key === "unfunded_delivery_details" ||
        key === "goal_key"
      ) {
        updatedSupports[index][key] = value;
      }
    }

    setUnfundedSupports(updatedSupports);
  };

  // Optional: Handle unit field blur to reset to 1 if left empty
  const handleUnitBlur = (index: number) => {
    if (!setUnfundedSupports) return;
    const updatedSupports = [...unfundedSupports];
    
    // If unit is null or undefined after blur, set to 1
    if (updatedSupports[index].unfunded_unit === null || updatedSupports[index].unfunded_unit === undefined) {
      updatedSupports[index].unfunded_unit = 1;
      // Recalculate grand total
      const calculatedGrandTotal = calculateGrandTotal(
        updatedSupports[index].unfunded_price,
        updatedSupports[index].unfunded_unit
      );
      updatedSupports[index].unfunded_grand_total = calculatedGrandTotal;
      setUnfundedSupports(updatedSupports);
    }
  };

  const addUnfundedSupport = () => {
    if (!setUnfundedSupports) return;

    const newIndex = unfundedSupports.length;
    setUnfundedSupports([
      ...unfundedSupports,
      {
        unfunded_support_name: "",
        unfunded_description: "",
        unfunded_price: null,
        unfunded_unit: 1, // Set default unit to 1
        unfunded_price_information: "",
        unfunded_delivery_details: "",
        unfunded_grand_total: null,
        goal_key: "",
      },
    ]);

    // Track the index of the newly added support
    setUnsavedSupportIndexes((prev) => new Set([...prev, newIndex]));
  };

  const removeUnfundedSupport = async (index: number) => {
    if (!setUnfundedSupports) return;
    const support = unfundedSupports[index];

    // Check if this support has a goal_key (submitted to backend)
    const hasGoalKey = !!support.goal_key;

    // Only call API for supports that have goal_key (exist in backend)
    if (hasGoalKey && uuid) {
      try {
        await destroy("schedule-of-support/section/remove", {
          uuid: uuid,
          table: "unfunded_supports",
          field: "goal_key",
          value: support.goal_key,
        });
      } catch (error) {
        console.error("Failed to remove support from backend:", error);
        // Even if API call fails, remove from local state
      }
    }

    // Remove from local state regardless of API call success
    const updatedSupports = [...unfundedSupports];
    updatedSupports.splice(index, 1);
    setUnfundedSupports(updatedSupports);

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

  // Calculate total grand total from all unfunded supports
  const totalGrandTotal = useMemo(() => {
    const total = unfundedSupports.reduce((sum, support) => {
      const grandTotal = support.unfunded_grand_total;
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
  }, [unfundedSupports]);

  return (
    <div className="mb-4 mt-4 border border-gray-300 rounded shadow bg-white">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h2 className="text-lg font-semibold text-heading">
          UNFUNDED SUPPORTS
        </h2>
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
        {unfundedSupports.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No unfunded supports added yet.
          </p>
        ) : (
          unfundedSupports.map((support, index) => (
            <div
              key={support.id || support.goal_key || support.uuid || index}
              className="grid grid-cols-1 gap-6 mb-6 p-4 rounded relative border border-gray-200"
            >
              {/* Support Name */}
              <div>
                <label className="block mb-1 font-medium">Support Name</label>
                <input
                  type="text"
                  name="unfunded_support_name"
                  value={support.unfunded_support_name || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter support name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 font-medium">
                  Description of Support
                </label>
                <textarea
                  name="unfunded_description"
                  placeholder="Enter support description"
                  value={support.unfunded_description || ""}
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
                    name="unfunded_price"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={support.unfunded_price ?? ""}
                    onChange={(e) => handleFieldChange(index, e)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block mb-1 font-medium">Unit</label>
                  <input
                    type="number"
                    name="unfunded_unit"
                    placeholder="1"
                    step="1"
                    min="1"
                    value={support.unfunded_unit ?? ""}
                    onChange={(e) => handleFieldChange(index, e)}
                    onBlur={() => handleUnitBlur(index)}
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
                    name="unfunded_grand_total"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={support.unfunded_grand_total ?? ""}
                    onChange={(e) => handleFieldChange(index, e)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    readOnly // Make it read-only since it's auto-calculated
                  />
                </div>
              </div>

              {/* Price Information */}
              <div>
                <label className="block mb-1 font-medium">
                  Price Information
                </label>
                <input
                  type="text"
                  name="unfunded_price_information"
                  placeholder="Enter price information"
                  value={support.unfunded_price_information || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Delivery Details */}
              <div>
                <label className="block mb-1 font-medium">
                  How the support will be provided
                </label>
                <textarea
                  name="unfunded_delivery_details"
                  placeholder="How, when, where, who provides the support"
                  value={support.unfunded_delivery_details || ""}
                  onChange={(e) => handleFieldChange(index, e)}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeUnfundedSupport(index)}
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
          onClick={addUnfundedSupport}
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          ➕ Add Another Unfunded Support
        </button>

        {/* Total Grand Total Display */}
        {unfundedSupports.length > 0 && (
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
              Sum of all unfunded supports ({unfundedSupports.length}{" "}
              {unfundedSupports.length === 1 ? "support" : "supports"})
            </p>
          </div>
        )}
        <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
          <div className="text-gray-700 space-y-3 w-full">
            <p className="text-gray-600 mb-4">
              <b>Please note:</b>
            </p>
            <p>
              Payment for board and lodgings would be either the Public Trust
              Officer (PTO) or via Best of Homecare account only, e.g., Direct
              payment from the participant or Centrelink, and this should be
              noted above. The breakdown of board and lodging costs are
              available on request
            </p>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="unfunded_supports"
        field="all"
        url="support-care-plan/logs"
      />
    </div>
  );
}