import React, { useState, useEffect, useRef } from 'react';
import { portGetApi } from '../../utils/FetchApi.jsx';

const Step3 = ({ formData, setFormData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [savedPorts, setSavedPorts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchPorts = async () => {
            if (searchTerm) {
                setIsSearching(true);
                try {
                    const response = await portGetApi(`search-port?query=${searchTerm}`);
                    const results = response.ports || [];
                    console.log('Fetched Ports:', results); // Debugging line
                    setSearchResults(results);
                } catch (error) {
                    console.error('Error fetching ports:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        };

        const debounceTimeout = setTimeout(() => {
            fetchPorts();
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleArrivalTimeChange = (e, port) => {
        const value = e.target.value;
        savePortWithTimes(port, value, port.departure_date_time);
    };

    const handleDepartureTimeChange = (e, port) => {
        const value = e.target.value;
        savePortWithTimes(port, port.arrival_date_time, value);
    };

    const savePortWithTimes = (port, arrival, departure) => {
        const updatedPort = {
            ...port,
            arrival_date_time: arrival ? new Date(arrival).toISOString() : '',
            departure_date_time: departure ? new Date(departure).toISOString() : '',
        };

        const updatedPorts = savedPorts.map(savedPort =>
            savedPort.code === port.code ? updatedPort : savedPort
        );

        if (!savedPorts.some(savedPort => savedPort.code === port.code)) {
            updatedPorts.push(updatedPort);
        }

        setSavedPorts(updatedPorts);
        setFormData(prevFormData => ({
            ...prevFormData,
            route_details: {
                port_n_time: updatedPorts
            }
        }));
    };

    const removePort = (portId) => {
        setSavedPorts(savedPorts.filter(port => port.code !== portId));
        setFormData(prevFormData => ({
            ...prevFormData,
            route_details: {
                port_n_time: (prevFormData.route_details.port_n_time || []).filter(port => port.code !== portId)
            }
        }));
    };

    const selectPort = (port) => {
        savePortWithTimes(port, '', '');
        setSearchResults([]);
        setSearchTerm('');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="p-4">
            <div className="mb-4">
                <label htmlFor="search" className="block text-gray-700 font-medium mb-2">Search Port</label>
                <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Enter port name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchResults.length > 0 && (
                    <div ref={dropdownRef} className="absolute bg-white border border-gray-300 rounded-lg shadow-md mt-1 z-10 max-h-60 overflow-y-auto w-full md:w-1/2">
                        {searchResults.map((port, index) => (
                            <div
                                key={index}
                                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => selectPort(port)}
                            >
                                {port.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <h2 className="text-gray-700 font-medium mb-2">Saved Ports</h2>
                <div className="flex flex-wrap -mx-2">
                    {savedPorts.map((port, index) => (
                        <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <div className="mb-2">
                                    <h3 className="text-gray-700 font-medium">Port Name: {port.name}</h3>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor={`arrivalTime-${port.code}`} className="block text-gray-700 font-medium mb-2">Arrival Date and Time</label>
                                    <input
                                        type="datetime-local"
                                        id={`arrivalTime-${port.code}`}
                                        value={port.arrival_date_time ? new Date(port.arrival_date_time).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => handleArrivalTimeChange(e, port)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor={`departureTime-${port.code}`} className="block text-gray-700 font-medium mb-2">Departure Date and Time</label>
                                    <input
                                        type="datetime-local"
                                        id={`departureTime-${port.code}`}
                                        value={port.departure_date_time ? new Date(port.departure_date_time).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => handleDepartureTimeChange(e, port)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={() => removePort(port.code)}
                                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                                >
                                    Remove Port
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Step3;
