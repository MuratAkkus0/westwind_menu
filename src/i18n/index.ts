import de from "./de.json";

export type Language = "de";
export type MessageKey = keyof typeof de;

const MESSAGES: Record<Language, Record<MessageKey, string>> = { de };

export const LANGUAGES: Language[] = ["de"];
export const DEFAULT_LANGUAGE: Language = "de";

/** Looks up a UI string and fills `{name}` placeholders. */
export function translate(
  language: Language,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  const template = MESSAGES[language][key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}
