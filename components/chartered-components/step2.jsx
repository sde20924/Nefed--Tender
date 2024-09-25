import React, { useState, useRef, useEffect } from "react";
import { commodityGetApi, commoditySearchGetApi, commoditycallApi } from "../../utils/FetchApi.jsx";

const Step2 = ({ formData, setFormData }) => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentHatchIndex, setCurrentHatchIndex] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await commodityGetApi("commodities/get-all");
        setDropdownOptions(response.commodities.map(commodity => commodity.name));
      } catch (error) {
        console.error("Error fetching commodities:", error);
      }
    };

    fetchCommodities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      hatch_details: {
        ...formData.hatch_details,
        [name]: value,
      },
    });
  };

  const handleHatchChange = (index, key, value) => {
    const updatedHatches = formData.hatch_details.hatch_wise_details.map((hatch, idx) =>
      idx === index ? { ...hatch, [key]: value } : hatch
    );
    setFormData({
      ...formData,
      hatch_details: {
        ...formData.hatch_details,
        hatch_wise_details: updatedHatches,
      },
    });
  };

  const handleDropdownChange = async (index, e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
    setCurrentHatchIndex(index);

    // Search for commodities based on the search term
    if (value) {
      try {
        const response = await commoditySearchGetApi(`commodities/get-all?name=${value}`);
        setDropdownOptions(response.commodities.map(commodity => commodity.name));
      } catch (error) {
        console.error("Error searching commodities:", error);
      }
    } else {
      setDropdownOptions([]);
    }
  };

  const handleAddOption = async () => {
    if (searchTerm && !dropdownOptions.includes(searchTerm)) {
      // Add the new commodity to the server
      try {
        const newCommodity = { names: [searchTerm] };
        await commoditycallApi("commodities/create", "POST", newCommodity);

        // Update the dropdown options with the new commodity
        const newOptions = [...dropdownOptions, searchTerm];
        setDropdownOptions(newOptions);

        if (formData.hatch_details.type === "individual") {
          setFormData({
            ...formData,
            hatch_details: {
              ...formData.hatch_details,
              commodity_name: searchTerm,
            },
          });
        } else {
          handleHatchChange(currentHatchIndex, "commodity_name", searchTerm);
        }

        setSearchTerm("");
        setShowDropdown(false);
      } catch (error) {
        console.error("Error adding commodity:", error);
      }
    }
  };

  const handleSelectOption = (index, option) => {
    if (formData.hatch_details.type === "individual") {
      setFormData({
        ...formData,
        hatch_details: {
          ...formData.hatch_details,
          commodity_name: option,
        },
      });
    } else {
      handleHatchChange(index, "commodity_name", option);
    }
    setSearchTerm(option);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNumberOfHatchesChange = (e) => {
    let numberOfHatches = parseInt(e.target.value, 10);
    if (isNaN(numberOfHatches) || numberOfHatches < 0) {
      numberOfHatches = 0;
    }

    const MAX_HATCHES = 7;
    if (numberOfHatches > MAX_HATCHES) {
      numberOfHatches = MAX_HATCHES;
    }

    const newHatches = Array(numberOfHatches)
      .fill()
      .map((_, idx) => ({
        hatch_number: `Hatch ${idx + 1}`,
        capacity: "",
        commodity_name: "",
        commodity_id: "",
        price_per_mt: {
          rate: "",
          currency: "USD",
        },
      }));

    setFormData({
      ...formData,
      hatch_details: {
        ...formData.hatch_details,
        total_hatch_numbers: numberOfHatches,
        hatch_wise_details: newHatches,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="w-full bg-gray-100 flex p-4">
      <div className="w-full flex bg-white shadow-md rounded p-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-2 mt-6">
            <label className="block text-gray-700 font-medium text-lg">
              Hatches Details
            </label>
            <input
              type="radio"
              id="individual"
              name="type"
              value="individual"
              checked={formData.hatch_details.type === "individual"}
              onChange={handleChange}
              className="mr-1"
            />
            <label htmlFor="individual" className="text-gray-700 mr-3">
              Individual
            </label>
            <input
              type="radio"
              id="multiple"
              name="type"
              value="multiple"
              checked={formData.hatch_details.type === "multiple"}
              onChange={handleChange}
              className="mr-1"
            />
            <label htmlFor="multiple" className="text-gray-700">
              Multiple
            </label>

            {formData.hatch_details.type === "individual" && (
              <>
                <div className="mt-6 max-w-xs">
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="mb-2">
                      <label
                        htmlFor="capacity"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Total Capacity
                      </label>
                      <input
                        type="text"
                        id="capacity"
                        name="capacity"
                        value={formData.hatch_details.capacity}
                        onChange={handleChange}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="rate"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Rate per MT
                      </label>
                      <input
                        type="text"
                        id="rate"
                        name="rate"
                        value={formData.hatch_details.price_per_mt.rate}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "price_per_mt",
                              value: {
                                ...formData.hatch_details.price_per_mt,
                                rate: e.target.value,
                              },
                            },
                          })
                        }
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="currency"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Currency
                      </label>
                      <input
                        type="text"
                        id="currency"
                        name="currency"
                        value={formData.hatch_details.price_per_mt.currency}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "price_per_mt",
                              value: {
                                ...formData.hatch_details.price_per_mt,
                                currency: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-2 relative" ref={dropdownRef}>
                      <label className="block text-gray-700 font-medium mb-1">
                        Select Commodity
                      </label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleDropdownChange(null, e)}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search/add Commodity..."
                        className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {showDropdown && (
                        <div className="absolute bg-white border border-gray-300 rounded-lg shadow-md w-full mt-1 z-10 max-h-60 overflow-y-auto">
                          {dropdownOptions
                            .filter(
                              (option) =>
                                typeof option === "string" &&
                                option
                                  .toLowerCase()
                                  .includes((searchTerm || "").toLowerCase())
                            )
                            .map((option, index) => (
                              <div
                                key={index}
                                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSelectOption(null, option)}
                              >
                                {option}
                              </div>
                            ))}
                          {!dropdownOptions.includes(searchTerm) && (
                            <div
                              className="bg-blue-500 px-3 py-2 text-white cursor-pointer"
                              onClick={handleAddOption}
                            >
                              Add "{searchTerm}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {formData.hatch_details.type === "multiple" && (
              <div>
                <div className="mb-2 mt-2">
                  <label
                    htmlFor="total_hatch_numbers"
                    className="block text-gray-700 font-medium"
                  >
                    Number of Hatches
                  </label>
                  <input
                    type="number"
                    id="total_hatch_numbers"
                    name="total_hatch_numbers"
                    value={formData.hatch_details.total_hatch_numbers}
                    onChange={handleNumberOfHatchesChange}
                    min="0"
                    max="7"
                    className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="bg-white flex flex-wrap">
                  {formData.hatch_details.hatch_wise_details.map((hatch, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md p-4 mb-2"
                    >
                      <div className="mb-2">
                        <label htmlFor={`capacity-${index}`} className="text-center block text-gray-700 font-medium text-lg mb-1">
                          Hatch {index + 1}
                        </label>
                        <label htmlFor={`capacity-${index}`} className="block text-gray-700 font-medium mb-1">
                          Capacity
                        </label>
                        <input
                          type="text"
                          value={hatch.capacity}
                          onChange={(e) =>
                            handleHatchChange(index, "capacity", e.target.value)
                          }
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                          }}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700 font-medium mb-1">
                          Rate per MT
                        </label>
                        <input
                          type="text"
                          value={hatch.price_per_mt.rate}
                          onChange={(e) =>
                            handleHatchChange(index, "price_per_mt", {
                              ...hatch.price_per_mt,
                              rate: e.target.value,
                            })
                          }
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                          }}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-gray-700 font-medium mb-1">
                          Currency
                        </label>
                        <input
                          type="text"
                          value={hatch.price_per_mt.currency}
                          onChange={(e) =>
                            handleHatchChange(index, "price_per_mt", {
                              ...hatch.price_per_mt,
                              currency: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div
                        className="mb-2 relative"
                        ref={dropdownRef}
                      >
                        <label className="block text-gray-700 font-medium mb-1">
                          Select Commodity
                        </label>
                        <input
                          type="text"
                          value={
                            index === currentHatchIndex
                              ? searchTerm
                              : hatch.commodity_name
                          }
                          onChange={(e) => handleDropdownChange(index, e)}
                          onFocus={() => {
                            setCurrentHatchIndex(index);
                            setShowDropdown(true);
                          }}
                          placeholder="Search/add Commodity..."
                          className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showDropdown && index === currentHatchIndex && (
                          <div className="absolute bg-white border border-gray-300 rounded-lg shadow-md w-full mt-1 z-10 max-h-60 overflow-y-auto">
                            {dropdownOptions
                              .filter(
                                (option) =>
                                  typeof option === "string" &&
                                  option
                                    .toLowerCase()
                                    .includes((searchTerm || "").toLowerCase())
                              )
                              .map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                  onClick={() =>
                                    handleSelectOption(index, option)
                                  }
                                >
                                  {option}
                                </div>
                              ))}
                            {!dropdownOptions.includes(searchTerm) && (
                              <div
                                className="bg-blue-500 px-3 py-2 text-white cursor-pointer"
                                onClick={handleAddOption}
                              >
                                Add "{searchTerm}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2;
