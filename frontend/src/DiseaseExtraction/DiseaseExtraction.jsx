import { useState } from "react";
import { motion } from "framer-motion";
import UploadForm from "./UploadForm/UploadForm.jsx";
import ExtractedText from "./ExtractedText/ExtractedText.jsx";

function DiseaseExtraction() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = (uploadedData) => {
        setIsLoading(false);
        setData(uploadedData);
    };

    const startLoading = () => {
        setIsLoading(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
            <motion.div 
                className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h2 
                    className="text-3xl font-bold mb-6 text-gray-800 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Medical Document Analysis
                </motion.h2>
                
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <UploadForm onUpload={handleUpload} onStartLoading={startLoading} />
                </motion.div>
                
                {isLoading && (
                    <motion.div 
                        className="flex justify-center my-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                )}
                
                {data && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ExtractedText text={data.text} diseases={data.diseases} />
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default DiseaseExtraction;