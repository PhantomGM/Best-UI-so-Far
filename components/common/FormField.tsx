
import React from 'react';

interface FormFieldProps {
    label: string;
    htmlFor: string;
    description?: string;
    children: React.ReactElement;
    isTextArea?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, description, children, isTextArea=false }) => {
    return (
        <div>
            <label htmlFor={htmlFor} className="block text-md font-semibold mb-1 text-indigo-200">{label}</label>
             {isTextArea ? (
                React.cloneElement(children as React.ReactElement<any>, {
                    className: "w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-indigo-100"
                })
            ) : (
                 React.cloneElement(children as React.ReactElement<any>, {
                    className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-indigo-100"
                })
            )}
            {description && <p className="text-sm text-indigo-400/80 mt-1">{description}</p>}
        </div>
    );
};

export default FormField;
