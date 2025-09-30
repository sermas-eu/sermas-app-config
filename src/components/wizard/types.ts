export interface Module {
  moduleId: string;
  secret?: string;
  supports: string[];
  config: Record<string, any>;
}

export interface Theme {
  primaryBgColor: string;
  primaryTextColor: string;
  secondaryBgColor: string;
  secondaryTextColor: string;
}

export interface LLMConfig {
  chat: string;
  tools: string;
  sentiment: string;
  tasks: string;
  intent: string;
  translation: string;
}

export interface Settings {
  login: boolean;
  avatar: string;
  background: string;
  language: string;
  prompt: {
    text: string;
  };
  theme: Theme;
  llm: LLMConfig;
}

export interface WizardData {
  appId: string;
  name: string;
  description: string;
  public: boolean;
  modules: Module[];
  settings: Settings;
  files: {
    avatarFile: File | null;
    avatarUrl: string;
    backgroundFile: File | null;
    ragFiles: File[];
  };
}
