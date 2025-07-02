import { useSettings } from '@/context/SettingsContext';
import { dict } from '@/lib/translation/dict';
import { getText } from '@/utils/helper';

const useTranslator = () => {
  const settings = useSettings();
  const language = (settings as any).language;
  return getText(language as keyof typeof dict);
};

export default useTranslator;
