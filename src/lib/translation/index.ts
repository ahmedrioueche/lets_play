import { Translator } from "./translator";
import { Synchronizer } from "./synchronizer";
import { TranslationWatcher } from "./watcher";
import { TranslationConfig } from "../../types/translation";

export function createTranslator(config: TranslationConfig) {
  return new Translator(config);
}

export function createSynchronizer(config: TranslationConfig) {
  return new Synchronizer(config);
}

export function createWatcher(translator: Translator, watchDirectory?: string) {
  return new TranslationWatcher(translator, watchDirectory);
}
