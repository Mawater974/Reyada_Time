import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium input-label mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            'block w-full rounded-md shadow-sm input-field transition-colors duration-200 text-sm py-1.5',
            'focus:outline-none focus:ring-2 focus:ring-focus focus:border-focus',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
