'use client';

import { useContext } from 'react';
import { LocaleContext } from '@/components/LocaleProvider';

export function useLocale() {
  return useContext(LocaleContext);
}
