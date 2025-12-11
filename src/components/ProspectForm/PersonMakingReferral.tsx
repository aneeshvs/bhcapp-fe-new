"use client";
import React from "react";

interface PersonMakingReferralProps {
  formData: {
    agency?: string;
    contact_name?: string;
    job_title?: string;
    work_contact?: string;
    referral_mobile?: string;
    referral_email?: string;
    has_consent?: number;
  };
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | 
    { target: { name: string; value: string | number | boolean } }
  ) => void;
}

export default function PersonMakingReferral({
  formData,
  handleChange,
}: PersonMakingReferralProps) {
  // const [isCollapsed, setIsCollapsed] = useState(false);

  // const toggleCollapse = () => setIsCollapsed(prev => !prev);
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      handleChange({ target: { name, value: value === 'Yes' ? 1 : 0 } });
    };
  return (
    <div className="mb-4 mt-4 border border-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-4 text-heading">
        Person Making Referral
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-3">
          <label htmlFor="agency" className="form-label font-medium mb-1 block">
            Agency/Organisation:
          </label>
          <input
            type="text"
            id="agency"
            name="agency"
            value={formData.agency || ""}
            onChange={handleChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="contact_name"
            className="form-label font-medium mb-1 block"
          >
            Contact Name:
          </label>
          <input
            type="text"
            id="contact_name"
            name="contact_name"
            value={formData.contact_name || ""}
            onChange={handleChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="job_title"
            className="form-label font-medium mb-1 block"
          >
            Job Title:
          </label>
          <input
            type="text"
            id="job_title"
            name="job_title"
            value={formData.job_title || ""}
            onChange={handleChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="work_contact"
            className="form-label font-medium mb-1 block"
          >
            Work Contact (W):
          </label>
          <input
            type="tel"
            id="work_contact"
            name="work_contact"
            value={formData.work_contact || ""}
            onChange={handleChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="referral_mobile"
            className="form-label font-medium mb-1 block"
          >
            Mobile (M):
          </label>
          <input
            type="tel"
            id="referral_mobile"
            name="referral_mobile"
            value={formData.referral_mobile || ""}
            onChange={handleChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="referral_email"
            className="form-label font-medium mb-1 block"
          >
            Email:
          </label>
          <input
            type="referral_email"
            id="referral_email"
            name="referral_email"
            value={formData.referral_email || ""}
            onChange={handleChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Agency Consent Radio Buttons */}
        <div className="col-span-full mb-3">
          <label className="form-label font-medium mb-1 block">
            I have Consent to Refer and Provide their Personal Information to
            Best of Homecare?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="has_consent"
                value="Yes"
                checked={formData.has_consent === 1}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="has_consent"
                value="No"
                checked={formData.has_consent === 0}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
