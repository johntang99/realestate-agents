import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      error,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={cn(
                'peer h-5 w-5 appearance-none rounded border-2 border-gray-300 bg-white transition-all',
                'checked:border-primary checked:bg-primary',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:bg-gray-100',
                error && 'border-red-500',
                className
              )}
              {...props}
            />
            <Check
              size={16}
              className="absolute left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
              strokeWidth={3}
            />
          </div>
          
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 ml-8">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Radio Component
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      error,
      id,
      ...props
    },
    ref
  ) => {
    const radioId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className={cn(
              'h-5 w-5 border-2 border-gray-300 text-primary transition-all',
              'focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:bg-gray-100',
              error && 'border-red-500',
              className
            )}
            {...props}
          />
          
          {label && (
            <label
              htmlFor={radioId}
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 ml-8">{error}</p>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Checkbox;
