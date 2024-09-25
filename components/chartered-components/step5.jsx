import React, { useState } from 'react';

const Step5 = ({ formData, setFormData, onNext }) => {
    const [documentName, setDocumentName] = useState('');
    const [documentExt, setDocumentExt] = useState('pdf');
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(Date.now()); // Unique key for file input

    const handleDocumentNameChange = (e) => {
        setDocumentName(e.target.value);
    };

    const handleDocumentExtChange = (e) => {
        setDocumentExt(e.target.value);
    };

    const handleAddDocument = () => {
        if (!documentName || !documentExt) return;

        const newDocument = {
            id: Date.now(), // Generate a unique ID for the document
            doc_name: documentName,
            doc_ext: documentExt,
        };

        const updatedDocuments = [...uploadedDocuments, newDocument];
        setUploadedDocuments(updatedDocuments);
        setFormData({
            ...formData,
            documents: {
                required_docs: updatedDocuments,
            },
        });

        // Reset fields and update file input key
        setDocumentName('');
        setDocumentExt('pdf');
        setFileInputKey(Date.now());
    };

    const handleNext = () => {
        onNext();
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <label htmlFor="documentName" className="block text-gray-700 font-medium mb-2">Document Name</label>
                <input
                    type="text"
                    id="documentName"
                    value={documentName}
                    onChange={handleDocumentNameChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Document Extension</label>
                <select
                    id="documentExt"
                    value={documentExt}
                    onChange={handleDocumentExtChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="jpeg">JPEG</option>
                    <option value="pdf">PDF</option>
                    <option value="png">PNG</option>
                </select>
            </div>
            <button
                onClick={handleAddDocument}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
            >
                Add Document
            </button>

            {uploadedDocuments.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-gray-700 font-medium mb-2">Uploaded Documents</h2>
                    <div className="flex flex-wrap">
                        {uploadedDocuments.map((doc) => (
                            <div key={doc.id} className="w-full md:w-1/3 p-2">
                                <div className="bg-white rounded-lg shadow-md p-4">
                                    <div className="mb-2">
                                        <h3 className="text-gray-700 font-medium">Document Name: {doc.doc_name}</h3>
                                    </div>
                                    <div className="mb-2">
                                        <p className="text-gray-700">Document Extension: {doc.doc_ext.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Uncomment the following button to enable the "Next" button functionality */}
            {/* <button
                onClick={handleNext}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                Next
            </button> */}
        </div>
    );
};

export default Step5;
