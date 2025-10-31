
import React from 'react';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'normal' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'normal', fullWidth = false, className = '', ...props }) => {
    const baseClasses = "flex items-center justify-center font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: 'bg-purple-600 text-white hover:bg-purple-500 focus:ring-purple-500 shadow-lg shadow-purple-900/30',
        secondary: 'bg-gray-700 text-indigo-100 hover:bg-gray-600 focus:ring-indigo-400',
    };

    const sizeClasses = {
        normal: 'px-4 py-2 text-sm',
        large: 'px-6 py-3 text-base',
    };
    
    const widthClass = fullWidth ? 'w-full' : '';

    const combinedClasses = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClass,
        className
    ].join(' ');

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;
