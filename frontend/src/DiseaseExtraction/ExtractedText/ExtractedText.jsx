import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ExtractedText = ({ text, diseases }) => {
    const [highlightedText, setHighlightedText] = useState(text);
    
    useEffect(() => {
        // Function to highlight disease mentions in text
        const highlightDiseases = () => {
            let processedText = text;
            
            // Sort diseases by length (descending) to handle cases where one disease name contains another
            const sortedDiseases = [...diseases].sort((a, b) => b.length - a.length);
            
            // Create a case-insensitive regex pattern for each disease
            sortedDiseases.forEach(disease => {
                // Escape special regex characters in the disease name
                const escapedDisease = disease.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                
                // Create regex that handles word boundaries and case insensitivity
                const regex = new RegExp(`(\\b${escapedDisease}\\b)`, 'gi');
                
                // Replace all occurrences with highlighted version - using light yellow background
                processedText = processedText.replace(
                    regex, 
                    '<span class="bg-yellow-100 px-1 rounded">$1</span>'
                );
            });
            
            setHighlightedText(processedText);
        };
        
        if (text && diseases && diseases.length > 0) {
            highlightDiseases();
        } else {
            setHighlightedText(text);
        }
    }, [text, diseases]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            className="mt-8 bg-gray-50 rounded-xl p-6 shadow-md"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={item} className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Document Text
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 max-h-64 overflow-y-auto">
                    <p dangerouslySetInnerHTML={{ __html: highlightedText }}></p>
                </div>
            </motion.div>

            <motion.div variants={item}>
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Identified Medical Conditions
                </h3>
                
                {diseases.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {diseases.map((disease, index) => (
                            <motion.span 
                                key={index}
                                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 + 0.2 }}
                            >
                                {disease}
                            </motion.span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No medical conditions identified in the document.</p>
                )}
            </motion.div>

            {diseases.length > 0 && (
                <motion.div 
                    variants={item}
                    className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100"
                >
                    <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-blue-800">
                            Medical conditions are <span className="bg-yellow-100 px-1 rounded">highlighted in yellow</span> in the document text above for easy identification.
                        </p>
                    </div>
                </motion.div>
            )}

            <motion.div 
                className="mt-6 pt-4 border-t border-gray-200 text-gray-600 text-sm italic"
                variants={item}
            >
                This analysis is for informational purposes only. Always consult with a healthcare professional.
            </motion.div>
        </motion.div>
    );
};

export default ExtractedText;