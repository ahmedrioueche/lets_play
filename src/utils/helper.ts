import { dict } from '@/lib/translation/dict';
import { DictLanguages } from '@/types/dict';

export function getText(lang: DictLanguages) {
  // Default to English if translation missing
  return {
    ...dict.en,
    ...dict[lang],
  };
}

export const capitalize = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
