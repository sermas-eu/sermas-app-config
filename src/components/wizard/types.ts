export interface Module {
  moduleId: string;
  secret?: string;
  supports: string[];
  config: Record<string, any>;
}

export interface Avatar {
  id: string;
  url: string;
  gender: string;
  name: string;
  prompt: string;
  tts: {
    provider: string;
    model: string;
  };
}

export interface Theme {
  primaryBgColor: string;
  primaryTextColor: string;
  secondaryBgColor: string;
  secondaryTextColor: string;
}

export interface Settings {
  avatar: string;
  background: string;
  language: string;
  chatModel: string;
  prompt: {
    text: string;
  };
  theme: Theme;
}

export interface WizardData {
  name: string;
  description: string;
  public: boolean;
  login: boolean;
  avatars: Avatar[];
  modules: Module[];
  settings: Settings;
  files: {
    backgroundFile: File | null;
    backgroundUrl: string;
    ragFiles: File[];
  };
}
