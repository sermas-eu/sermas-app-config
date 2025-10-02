import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { WizardData } from "./types";

interface BasicInfoStepProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

export const BasicInfoStep = ({ data, updateData }: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Application Name *</Label>
        <Input
          id="name"
          placeholder="e.g., My Virtual Assistant"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your application..."
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="login"
          checked={data.login}
          onCheckedChange={(checked) => updateData({ login: checked })}
        />
        <Label htmlFor="login">Enable user login</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="public"
          checked={data.public}
          onCheckedChange={(checked) => updateData({ public: checked })}
        />
        <Label htmlFor="public">Make this application public</Label>
      </div>
    </div>
  );
};
