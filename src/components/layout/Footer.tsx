'use client';

import { useLocale } from '@/hooks/useLocale';

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto" data-testid="footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">{t('footer.powered')}</p>
          <p className="text-xs text-gray-400">{t('footer.demo')}</p>
        </div>
      </div>
    </footer>
  );
}
