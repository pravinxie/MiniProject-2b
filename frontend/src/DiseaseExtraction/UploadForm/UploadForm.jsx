import { useState } from "react";
import { motion } from "framer-motion";

const UploadForm = ({ onUpload, onStartLoading }) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        onStartLoading();
        
        const formData = new FormData();
        formData.append("pdf", file);

        try {
            const response = await fetch("http://127.0.0.1:5002/extract", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            onUpload(data);
        } catch (error) {
            console.error("Error uploading file:", error);
            onStartLoading(false);
        }
    };

    return (
        <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
                <div 
                    className={`w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 
                        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        required 
                        accept=".pdf"
                        className="hidden" 
                        id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="flex flex-col items-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        
                        <span className="text-lg font-medium text-gray-700">
                            {file ? file.name : 'Drop your PDF here or click to browse'}
                        </span>
                        
                        <p className="text-sm text-gray-500 mt-2">
                            Only PDF files are supported
                        </p>
                    </label>
                </div>

                <motion.button 
                    type="submit" 
                    className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all ${file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!file}
                    whileHover={file ? { scale: 1.05 } : {}}
                    whileTap={file ? { scale: 0.95 } : {}}
                >
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Extract Disease Information
                    </div>
                </motion.button>
            </form>
        </motion.div>
    );
};

export default UploadForm;