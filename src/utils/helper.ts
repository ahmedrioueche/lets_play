import { dict } from "@/lib/translation/dict";

import { DictLanguages } from "@/types/dict";

export function getText(lang: DictLanguages) {
    // Default to English if translation missing
    return {
      ...dict.en,
      ...dict[lang],
    };
  }