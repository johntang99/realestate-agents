'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Locale, switchLocale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    
    const newPath = switchLocale(pathname, newLocale);
    router.push(newPath);
  };
  
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={() => handleLocaleChange('en')}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          currentLocale === 'en'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLocaleChange('zh')}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          currentLocale === 'zh'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        中文
      </button>
    </div>
  );
}
