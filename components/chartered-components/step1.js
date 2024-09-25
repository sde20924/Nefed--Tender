import React from "react";

const Step1 = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <form className="max-w-sm mx-auto">
      <div className="mb-5">
        <label
          htmlFor="vessel_name"
          className="block mb-2 text-lg font-medium text-gray-900"
        >
          Vessel Name
        </label>
        <input
          type="text"
          id="vessel_name"
          name="vessel_name"
          value={formData.vessel_name}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="vessel_size_quantity"
          className="block mb-2 text-lg font-medium text-gray-900 "
        >
          Vessel Size
        </label>
        <input
          type="text"
          id="vessel_size_quantity"
          name="vessel_size.quantity"
          value={formData.vessel_size.quantity}
          onChange={handleChange}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="vessel_size_unit"
          className="block mb-2 text-lg font-medium text-gray-900"
        >
          Vessel Size Unit
        </label>
        <select
          id="vessel_size_unit"
          name="vessel_size.unit"
          value={formData.vessel_size.unit}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        >
          <option value="TEW">TEW</option>
          <option value="DWT">DWT</option>
        </select>
      </div>

      <div className="mb-5">
        <label
          htmlFor="lots_available_min_lot"
          className="block mb-2 text-lg font-medium text-gray-900 "
        >
          Min Lot Size
        </label>
        <input
          type="text"
          id="lots_available_min_lot"
          name="lots_available.min_lot"
          value={formData.lots_available.min_lot}
          onChange={handleChange}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="lots_available_max_lot"
          className="block mb-2 text-lg font-medium text-gray-900"
        >
          Max Lot Size
        </label>
        <input
          type="text"
          id="lots_available_max_lot"
          name="lots_available.max_lot"
          value={formData.lots_available.max_lot}
          onChange={handleChange}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
    </form>
  );
};

export default Step1;