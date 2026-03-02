import { forwardRef } from 'react';
import { icons, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof icons;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', className, ...props }, ref) => {
    const aliasMap: Record<string, keyof typeof icons> = {
      Certificate: 'BadgeCheck',
      ShirtIcon: 'Shirt',
      Grid: 'LayoutGrid',
    };
    const resolvedName = (aliasMap[name as string] || name) as keyof typeof icons;
    const LucideIcon = icons[resolvedName];
    
    if (!LucideIcon) {
      console.warn(`Icon "${name}" not found in lucide-react`);
      return null;
    }
    
    // Convert size shortcuts to pixel values
    const sizeMap = {
      sm: 16,
      md: 24,
      lg: 32,
      xl: 48,
    };
    
    const iconSize = typeof size === 'string' ? sizeMap[size] : size;
    
    return (
      <LucideIcon
        ref={ref}
        size={iconSize}
        className={cn('inline-block', className)}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export default Icon;
