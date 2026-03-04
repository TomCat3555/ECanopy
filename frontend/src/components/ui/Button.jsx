import { cn } from '../../lib/utils';
import React from 'react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center border font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                fullWidth ? 'w-full' : '',
                className
            )}
            {...props}
        />
    );
});

Button.displayName = 'Button';
export default Button;
