const validateForm = () => {
    if (currentPage === 1) {
        // Validate Step 1 fields
        // Replace with actual validation for Step 1
        return formData.step1Field !== '';
    } else if (currentPage === 2) {
        // Validate Step 2 fields
        // Replace with actual validation for Step 2
        return routeDetails.length > 0; // Example validation
    } else if (currentPage === 3) {
        // Validate Step 3 fields
        return (
            formData.laycanStartTime !== '' &&
            formData.laycanEndTime !== '' &&
            formData.transitTime !== '' &&
            formData.pricePerMt !== '' &&
            formData.totalPrice !== '' &&
            formData.additionalDetails !== ''
        );
    } else if (currentPage === 4) {
        // Validate Step 4 fields
        // Replace with actual validation for Step 4
        return formData.documents.length > 0;
    }
    return true;
};
