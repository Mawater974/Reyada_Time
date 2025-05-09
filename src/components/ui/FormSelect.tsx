import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, className, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium input-label mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={twMerge(
            'block w-full rounded-md shadow-sm input-field transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-focus focus:border-focus',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
