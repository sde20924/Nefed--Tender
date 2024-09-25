import React, { useState, useEffect } from 'react';

const Step4 = ({ formData, setFormData }) => {
    const [laycanStartTime, setLaycanStartTime] = useState(formData.laycan_start_date || '');
    const [laycanEndTime, setLaycanEndTime] = useState(formData.laycan_end_date || '');
    const [transitTime, setTransitTime] = useState(formData.transit_time || '');
    const [pricePerMt, setPricePerMt] = useState(formData.pricing.price_per_mt || '');
    const [totalPrice, setTotalPrice] = useState(formData.pricing.total_price || '');
    const [additionalDetails, setAdditionalDetails] = useState(formData.additional_details || '');
    const [error, setError] = useState('');

    useEffect(() => {
        const handleNext = () => {
            if (laycanStartTime && laycanEndTime && new Date(laycanEndTime) <= new Date(laycanStartTime)) {
                setError('End time must be after start time');
            } else {
                setError('');
                setFormData(prevFormData => ({
                    ...prevFormData,
                    laycan_start_date: laycanStartTime,
                    laycan_end_date: laycanEndTime,
                    transit_time: transitTime,
                    pricing: {
                        price_per_mt: pricePerMt,
                        total_price: totalPrice
                    },
                    additional_details: additionalDetails
                }));
            }
        };

        handleNext();
    }, [laycanStartTime, laycanEndTime, transitTime, pricePerMt, totalPrice, additionalDetails, setFormData]);

    const handleLaycanStartTimeChange = (e) => {
        setLaycanStartTime(e.target.value);
    };

    const handleLaycanEndTimeChange = (e) => {
        setLaycanEndTime(e.target.value);
    };

    const handleTransitTimeChange = (e) => {
        setTransitTime(e.target.value);
    };

    const handlePricePerMtChange = (e) => {
        setPricePerMt(e.target.value);
    };

    const handleTotalPriceChange = (e) => {
        setTotalPrice(e.target.value);
    };

    const handleAdditionalDetailsChange = (e) => {
        setAdditionalDetails(e.target.value);
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <label htmlFor="laycanStartTime" className="block text-gray-700 font-medium mb-2">Laycan Start Time</label>
                <input
                    type="datetime-local"
                    id="laycanStartTime"
                    value={laycanStartTime}
                    onChange={handleLaycanStartTimeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="laycanEndTime" className="block text-gray-700 font-medium mb-2">Laycan End Time</label>
                <input
                    type="datetime-local"
                    id="laycanEndTime"
                    value={laycanEndTime}
                    onChange={handleLaycanEndTimeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="transitTime" className="block text-gray-700 font-medium mb-2">Transit Time</label>
                <input
                    type="text"
                    id="transitTime"
                    value={transitTime}
                    onChange={handleTransitTimeChange}
                    onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="pricePerMt" className="block text-gray-700 font-medium mb-2">Price per Mt</label>
                <input
                    type="number"
                    id="pricePerMt"
                    value={pricePerMt}
                    onChange={handlePricePerMtChange}
                    onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="totalPrice" className="block text-gray-700 font-medium mb-2">Total Price</label>
                <input
                    type="number"
                    id="totalPrice"
                    value={totalPrice}
                    onChange={handleTotalPriceChange}
                    onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="additionalDetails" className="block text-gray-700 font-medium mb-2">Additional Details</label>
                <textarea
                    id="additionalDetails"
                    value={additionalDetails}
                    onChange={handleAdditionalDetailsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
        </div>
    );
};

export default Step4;
