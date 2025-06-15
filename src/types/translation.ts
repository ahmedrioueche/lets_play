import { LANGUAGES } from "@/constants/language";

export type LanguageCode = keyof typeof LANGUAGES;

export interface TranslationDictionary {
  [language: string]: {
    [key: string]: string | TranslationDictionary;
  };
}

export interface TranslationConfig {
  apiKey: string;
  model?: string;
  maxRetries?: number;
  retryDelay?: number;
}
