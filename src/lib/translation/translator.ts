import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  TranslationDictionary,
  LanguageCode,
  TranslationConfig,
} from "../../types/translation";
import { TRANSLATION_PROMPT } from "../../constants/prompts";
import { LANGUAGES } from "@/constants/language";

export class Translator {
  private model: any;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: TranslationConfig) {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = genAI.getGenerativeModel({
      model: config.model || "gemini-pro",
    });
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  public async translateKey(
    key: string,
    language: LanguageCode
  ): Promise<string> {
    const prompt = TRANSLATION_PROMPT.replace(
      "{LANGUAGE}",
      LANGUAGES[language]
    ).replace("{KEY}", key);

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const translation = result.response.text().trim();

        // Validate translation for certain languages
        if (language === "ar" && !/[\u0600-\u06FF]/.test(translation)) {
          throw new Error("Invalid Arabic script");
        }

        return translation;
      } catch (error) {
        console.error(`Attempt ${attempt} failed for ${language}:`, error);
        if (attempt === this.maxRetries) return key; // Fallback to key
        await new Promise((r) => setTimeout(r, this.retryDelay * attempt));
      }
    }
    return key;
  }

  public async translateDictionary(
    dict: TranslationDictionary,
    targetLanguage: LanguageCode
  ): Promise<TranslationDictionary> {
    const translated = { ...dict };
    if (!translated[targetLanguage]) translated[targetLanguage] = {};

    async function traverse(
      this: any,
      source: any,
      target: any,
      currentPath: string = ""
    ) {
      for (const key in source) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        if (typeof source[key] === "object" && source[key] !== null) {
          target[key] = target[key] || {};
          await traverse(source[key], target[key], newPath);
        } else if (!target[key]) {
          target[key] = await this.translateKey(source[key], targetLanguage);
        }
      }
    }

    await traverse.call(this, dict.en, translated[targetLanguage]);
    return translated;
  }
}
