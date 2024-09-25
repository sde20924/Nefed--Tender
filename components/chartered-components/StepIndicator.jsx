import React from 'react';

const StepIndicator = ({ currentPage, totalPages, setCurrentPage, validateForm }) => {
    const steps = Array.from({ length: totalPages }, (_, index) => index +1);

    const handleClick = (stepIndex) => {
        if(validateForm())
            setCurrentPage(stepIndex+1);
    };

    return (
        <div className="flex justify-between items-center mb-6 max-w-3xl mx-auto">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div
                        key={index}
                        onClick={() => handleClick(index)}
                        style={{cursor:'pointer'}}
                        className={`h-10 w-10 flex items-center justify-center rounded-full ${
                            step <= currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                        }`}
                    >
                        {step}
                    </div>
                    {index < steps.length - 1 && (
                        <div  className="flex-grow h-0.5 bg-black bg-opacity-50 mx-1"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default StepIndicator;
