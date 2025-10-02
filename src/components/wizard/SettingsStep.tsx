import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WizardData } from "./types";

interface SettingsStepProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

const LANGUAGES = [
  { value: "en-US", label: "English (US)" },
  { value: "it-IT", label: "Italian" },
  { value: "es-ES", label: "Spanish" },
  { value: "fr-FR", label: "French" },
  { value: "de-DE", label: "German" },
];

const CHAT_MODELS = [
  { value: "openai/gpt-4.1", label: "OpenAI ChatGPT 4.1" },
  { value: "groq/openai/gpt-oss-120b", label: "Groq ChatGPT 120B" },
  { value: "mistral/mistral-large-3.1", label: "Mistral 3.1" },
];

export const SettingsStep = ({ data, updateData }: SettingsStepProps) => {
  const updateSettings = (updates: Partial<typeof data.settings>) => {
    updateData({ settings: { ...data.settings, ...updates } });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="avatar">Select Avatar (Optional)</Label>
        <Select
          value={data.settings.avatar}
          onValueChange={(value) => updateSettings({ avatar: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Default avatar will be used" />
          </SelectTrigger>
          <SelectContent>
            {data.avatars.length > 0 ? (
              data.avatars.map((avatar) => (
                <SelectItem key={avatar.id} value={avatar.id}>
                  {avatar.name} ({avatar.id})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No custom avatars configured
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {data.avatars.length === 0 && (
          <p className="text-sm text-muted-foreground">
            A default avatar will be used. Configure custom avatars in the Avatars step.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="background">Background Name</Label>
        <Input
          id="background"
          placeholder="e.g., office, lab"
          value={data.settings.background}
          onChange={(e) => updateSettings({ background: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select
          value={data.settings.language}
          onValueChange={(value) => updateSettings({ language: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="chatModel">Chat Model</Label>
        <Select
          value={data.settings.chatModel}
          onValueChange={(value) => updateSettings({ chatModel: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHAT_MODELS.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">System Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Enter the system prompt for your assistant..."
          value={data.settings.prompt.text}
          onChange={(e) =>
            updateSettings({ prompt: { text: e.target.value } })
          }
          rows={6}
        />
        <p className="text-sm text-muted-foreground">
          This prompt defines your assistant's behavior and personality
        </p>
      </div>
    </div>
  );
};
