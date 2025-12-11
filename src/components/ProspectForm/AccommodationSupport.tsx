// AccommodationSupport.tsx
'use client';

interface AccommodationSupportProps {
  type_of_accommodation: string[];
  requested_support: string[];
  worker_preference: string;
  date_of_referral: string;
  onFieldChange: (field: string, value: string | string[]) => void;
}

export default function AccommodationSupport({
  type_of_accommodation,
  requested_support,
  worker_preference,
  date_of_referral,
  onFieldChange,
}: AccommodationSupportProps) {
  const handleAccommodationSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    if (selected && !type_of_accommodation.includes(selected)) {
      onFieldChange('type_of_accommodation', [...type_of_accommodation, selected]);
    }
    event.target.selectedIndex = 0;
  };

  const handleRequestSupport = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    if (selected && !requested_support.includes(selected)){
      onFieldChange('requested_support', [...requested_support,selected]);
    }
    event.target.selectedIndex = 0;
  }

  const removeAccommodation = (value: string) => {
    onFieldChange(
      'type_of_accommodation',
      type_of_accommodation.filter((item) => item !== value)
    );
  };

  const removeRequestSupport = (value: string) => {
    onFieldChange(
      'requested_support',
      requested_support.filter((item) => item !== value)
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFieldChange(e.target.name, e.target.value);
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-heading">
        Accommodation & Support Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type of Accommodation */}
        <div className="mb-3">
          <label className="block mb-1 font-medium text-sm">Type of Accommodation</label>
          <select
            onChange={handleAccommodationSelect}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option value="Short Term">Short Term</option>
            <option value="Medium Term">Medium Term</option>
            <option value="Community Participation">Community Participation</option>
            <option value="Supported Independent Living">Supported Independent Living</option>
          </select>
          <div className="mt-2 flex flex-wrap gap-2">
            {type_of_accommodation.map((value) => (
              <span
                key={value}
                className="btn-primary text-white px-2 py-1 text-sm rounded cursor-pointer"
                onClick={() => removeAccommodation(value)}
              >
                {value} ×
              </span>
            ))}
          </div>
        </div>

        {/* Requested Support */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Requested Support</label>
          <select
          onChange={handleRequestSupport}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option value="Support Connection – Level 1">Support Connection – Level 1</option>
            <option value="Support Coordination – Level 2">Support Coordination – Level 2</option>
            <option value="Daily Activities Support">Daily Activities Support</option>
            <option value="Independent Living Options (ILO)">Independent Living Options (ILO)</option>
          </select>
          <div className="mt-2 flex flex-wrap gap-2">
             {requested_support.map((value) => (
              <span
                key={value}
                className="btn-primary text-white px-2 py-1 text-sm rounded cursor-pointer"
                onClick={() => removeRequestSupport(value)}
              >
                {value} ×
              </span>
            ))}
          </div>
        </div>

        {/* Worker Preference */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Worker Preference</label>
          <select
            name="worker_preference"
            value={worker_preference}
            onChange={handleInputChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Preference</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="No Preference">No Preference</option>
          </select>
        </div>

        {/* Date of Referral */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Date of Referral</label>
          <input
            type="date"
            name="date_of_referral"
            value={date_of_referral}
            onChange={handleInputChange}
            className="form-control w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}