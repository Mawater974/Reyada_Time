import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium input-label mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={twMerge(
            'block w-full rounded-md shadow-sm input-field transition-colors duration-200',
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

FormTextArea.displayName = 'FormTextArea';

export default FormTextArea;
