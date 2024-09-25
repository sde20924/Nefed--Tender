import React, { useState } from 'react';
import Step1 from '@/components/chartered-components/step1';
import Step2 from '@/components/chartered-components/step2';
import Step3 from '@/components/chartered-components/step3';
import Step4 from '@/components/chartered-components/step4';
import Step5 from '@/components/chartered-components/step5';
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import StepIndicator from '@/components/chartered-components/StepIndicator';
import { vesselCallApi } from '../../utils/FetchApi.jsx';

function StepForm() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;

    const validateForm = () => {
        if (currentPage === 1) {
            return (
                formData.vessel_name !== '' &&
                formData.vessel_size.quantity !== '' &&
                formData.lots_available.min_lot !== '' &&
                formData.lots_available.max_lot !== ''
            );
        } else if (currentPage === 2) {
            return (
                formData.hatch_details.capacity !== '' &&
                formData.hatch_details.commodity_name !== ''
            );
        } else if (currentPage === 3) {
            return formData.route_details.port_n_time.length > 1;
        } else if (currentPage === 4) {
            return (
                formData.laycan_start_date !== '' &&
                formData.laycan_end_date !== '' &&
                formData.transit_time !== '' &&
                formData.pricing.price_per_mt !== '' &&
                formData.pricing.total_price !== '' &&
                formData.additional_details !== ''
            );
        } else if (currentPage === 5) {
            return formData.documents.required_docs.length > 1;
        }
        return true;
    };

    const nextPage = () => {
        if (validateForm()) {
            setCurrentPage(currentPage + 1);
        } else {
            alert('Please fill all required fields.');
        }
    };

    const convertToUnixTimestamp = (dateTimeString) => {
        return new Date(dateTimeString).getTime();
    };

    const submitForm = async () => {
        if (!validateForm()) {
            alert('Please fill all required fields.');
            return;
        }

        console.log('Form submitted:', formData);

        const routeDetails = formData.route_details.port_n_time.map(port => ({
            ...port,
            arrival_date: convertToUnixTimestamp(port.arrival_date),
            arrival_time: convertToUnixTimestamp(port.arrival_time),
            departure_date: convertToUnixTimestamp(port.departure_date),
            departure_time: convertToUnixTimestamp(port.departure_time)
        }));

        let obj = {
            vessel_name: formData.vessel_name,
            vessel_size: formData.vessel_size,
            lots_available: formData.lots_available,
            hatch_details: formData.hatch_details,
            route_details: { port_n_time: routeDetails },
            laycan_start_date: convertToUnixTimestamp(formData.laycan_start_date),
            laycan_end_date: convertToUnixTimestamp(formData.laycan_end_date),
            transit_time: formData.transit_time,
            pricing: formData.pricing,
            additional_details: formData.additional_details,
            documents: formData.documents,
            status: 'pending'  // Add a default status
        };

        try {
            const response = await vesselCallApi('offering/create', 'POST', obj);
            console.log('API response:', response);
            alert('Form submitted successfully!');
        } catch (error) {
            console.error('API error:', error);
            alert('There was an error submitting the form. Please try again.');
        }
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const [formData, setFormData] = useState({
        vessel_name: "",
        vessel_size: {
            quantity: "",
            unit: "TEW"
        },
        lots_available: {
            max_lot: "",
            min_lot: ""
        },
        hatch_details: {
            type: "individual", // or "multiple"
            capacity: "",
            commodity_id: "",
            commodity_name: "",
            price_per_mt: {
                rate: "",
                currency: "USD",
            },
            total_hatch_numbers: 0,
            hatch_wise_details: []
        },
        route_details: {
            port_n_time: [
                {
                    port_id: "",
                    port_name: "",
                    port_code: "",
                    lat: "",
                    long: "",
                    arrival_date: "",
                    arrival_time: "",
                    departure_date: "",
                    departure_time: ""
                }
            ]
        },
        laycan_start_date: "",
        laycan_end_date: "",
        transit_time: "",
        pricing: {
            price_per_mt: "",
            total_price: ""
        },
        additional_details: "",
        documents: {
            required_docs: [
                {
                    id: 1,
                    doc_name: "",
                    doc_ext: "pdf"
                }
            ]
        },
        status: 'pending'  // Add a default status
    });

    const renderPage = () => {
        switch (currentPage) {
            case 1:
                return <Step1 formData={formData} setFormData={setFormData} nextPage={nextPage} />;
            case 2:
                return <Step2 formData={formData} setFormData={setFormData} nextPage={nextPage} />;
            case 3:
                return <Step3 formData={formData} setFormData={setFormData} nextPage={nextPage} />;
            case 4:
                return <Step4 formData={formData} setFormData={setFormData} nextPage={nextPage} />;
            case 5:
                return <Step5 formData={formData} setFormData={setFormData} nextPage={nextPage} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <HeaderTitle
                padding={"p-4"}
                subTitle={"Create offerings, update it, delete it"}
                title={"Create offerings"}
            />
            <div className="bg-gray-100 flex">
                <div className="bg-white p-8 rounded-lg shadow-md w-full m-4 ">
                    <StepIndicator currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} validateForm={validateForm}/>
                    {renderPage()}
                    <div className="mt-6 flex justify-between">
                        {currentPage > 1 && (
                            <button onClick={prevPage} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                Previous
                            </button>
                        )}
                        {currentPage < totalPages && (
                            <button onClick={nextPage} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                Next
                            </button>
                        )}
                        {currentPage === totalPages && (
                            <button onClick={submitForm} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                                Submit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

StepForm.layout = UserDashboard;
export default StepForm;
