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

export const SettingsStep = ({ data, updateData }: SettingsStepProps) => {
  const updateSettings = (updates: Partial<typeof data.settings>) => {
    updateData({ settings: { ...data.settings, ...updates } });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="avatar">Select Avatar</Label>
        <Select
          value={data.settings.avatar}
          onValueChange={(value) => updateSettings({ avatar: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an avatar" />
          </SelectTrigger>
          <SelectContent>
            {data.avatars.length === 0 ? (
              <SelectItem value="" disabled>
                No avatars configured
              </SelectItem>
            ) : (
              data.avatars.map((avatar) => (
                <SelectItem key={avatar.id} value={avatar.id}>
                  {avatar.name} ({avatar.id})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {data.avatars.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Configure avatars in the Avatars step first
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
