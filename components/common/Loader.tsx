
import React from 'react';

interface LoaderProps {
    message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.5s', borderTopColor: 'transparent' }}></div>
                <div className="absolute inset-2 border-2 border-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                <div className="absolute inset-4 border-2 border-purple-500 rounded-full animate-ping"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-indigo-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M5 21v-4M3 19h4M21 3v4M19 5h4M21 21v-4M19 19h4M12 5V3M12 21v-2M19 12h2M3 12h2M7.05 7.05l-1.414-1.414M18.364 18.364l-1.414-1.414M18.364 7.05l-1.414 1.414M7.05 18.364l-1.414 1.414" />
                    </svg>
                </div>
            </div>
            <p className="mt-6 text-xl font-semibold text-indigo-200 tracking-widest">{message}</p>
        </div>
    );
};
