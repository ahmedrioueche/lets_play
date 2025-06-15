import { useSettings } from "@/context/SettingsContext";
import { dict } from "@/lib/translation/dict";
import { getText } from "@/utils/helper";

const useTranslator = () => {
  const { language } = useSettings();
  return getText(language as keyof typeof dict);
};

export default useTranslator; 