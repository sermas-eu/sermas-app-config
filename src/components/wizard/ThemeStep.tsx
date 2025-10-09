import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { WizardData } from "./types";

interface ThemeStepProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

export const ThemeStep = ({ data, updateData }: ThemeStepProps) => {
  const updateTheme = (updates: Partial<typeof data.settings.theme>) => {
    updateData({
      settings: {
        ...data.settings,
        theme: { ...data.settings.theme, ...updates },
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Background Image</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Minimum resolution: 1920x1080
        </p>
        <div>
          <Label htmlFor="backgroundUrl">Background URL</Label>
          <Input
            id="backgroundUrl"
            placeholder="https://example.com/background.jpg"
            value={data.settings.theme.background}
            onChange={(e) => updateTheme({ background: e.target.value })}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Primary Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryBgColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryBgColor"
                type="color"
                value={data.settings.theme.primaryBgColor}
                onChange={(e) => updateTheme({ primaryBgColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={data.settings.theme.primaryBgColor}
                onChange={(e) => updateTheme({ primaryBgColor: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryTextColor">Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryTextColor"
                type="color"
                value={data.settings.theme.primaryTextColor}
                onChange={(e) => updateTheme({ primaryTextColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={data.settings.theme.primaryTextColor}
                onChange={(e) => updateTheme({ primaryTextColor: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Secondary Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="secondaryBgColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryBgColor"
                type="color"
                value={data.settings.theme.secondaryBgColor}
                onChange={(e) => updateTheme({ secondaryBgColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={data.settings.theme.secondaryBgColor}
                onChange={(e) => updateTheme({ secondaryBgColor: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryTextColor">Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryTextColor"
                type="color"
                value={data.settings.theme.secondaryTextColor}
                onChange={(e) => updateTheme({ secondaryTextColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={data.settings.theme.secondaryTextColor}
                onChange={(e) => updateTheme({ secondaryTextColor: e.target.value })}
                placeholder="#555555"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Preview</h3>
        <div className="space-y-2">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: data.settings.theme.primaryBgColor,
              color: data.settings.theme.primaryTextColor,
            }}
          >
            Primary: This is how your primary theme will look
          </div>
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: data.settings.theme.secondaryBgColor,
              color: data.settings.theme.secondaryTextColor,
            }}
          >
            Secondary: This is how your secondary theme will look
          </div>
        </div>
      </Card>
    </div>
  );
};
