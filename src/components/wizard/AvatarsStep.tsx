import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { WizardData, Avatar } from "./types";
import { toast } from "sonner";

interface AvatarsStepProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

const TTS_PROVIDERS = [
  { value: "google", label: "Google" },
  { value: "elevenlabs", label: "ElevenLabs" },
  { value: "azure", label: "Azure" },
];

export const AvatarsStep = ({ data, updateData }: AvatarsStepProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<Avatar>({
    id: "",
    url: "",
    gender: "F",
    name: "",
    prompt: "",
    tts: {
      provider: "google",
      model: "",
    },
  });

  const addAvatar = () => {
    if (!currentAvatar.id || !currentAvatar.name) {
      toast.error("Avatar ID and Name are required");
      return;
    }
    
    if (editingIndex !== null) {
      const newAvatars = [...data.avatars];
      newAvatars[editingIndex] = currentAvatar;
      updateData({ avatars: newAvatars });
      toast.success("Avatar updated");
      setEditingIndex(null);
    } else {
      updateData({ avatars: [...data.avatars, currentAvatar] });
      toast.success("Avatar added");
    }
    
    setCurrentAvatar({
      id: "",
      url: "",
      gender: "F",
      name: "",
      prompt: "",
      tts: { provider: "google", model: "" },
    });
  };

  const editAvatar = (index: number) => {
    setCurrentAvatar(data.avatars[index]);
    setEditingIndex(index);
  };

  const removeAvatar = (index: number) => {
    const newAvatars = data.avatars.filter((_, i) => i !== index);
    updateData({ avatars: newAvatars });
    toast.success("Avatar removed");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setCurrentAvatar({
      id: "",
      url: "",
      gender: "F",
      name: "",
      prompt: "",
      tts: { provider: "google", model: "" },
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">
          {editingIndex !== null ? "Edit Avatar" : "Add Avatar"}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="avatarId">Avatar ID *</Label>
              <Input
                id="avatarId"
                placeholder="e.g., emma"
                value={currentAvatar.id}
                onChange={(e) =>
                  setCurrentAvatar({ ...currentAvatar, id: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarName">Name *</Label>
              <Input
                id="avatarName"
                placeholder="e.g., Emma"
                value={currentAvatar.name}
                onChange={(e) =>
                  setCurrentAvatar({ ...currentAvatar, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Model URL (GLB/FBX)</Label>
            <Input
              id="avatarUrl"
              placeholder="https://example.com/avatar.glb"
              value={currentAvatar.url}
              onChange={(e) =>
                setCurrentAvatar({ ...currentAvatar, url: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={currentAvatar.gender}
              onValueChange={(value) =>
                setCurrentAvatar({ ...currentAvatar, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="F">Female</SelectItem>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="N">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarPrompt">Avatar Prompt</Label>
            <Textarea
              id="avatarPrompt"
              placeholder="Describe the avatar's role and behavior..."
              value={currentAvatar.prompt}
              onChange={(e) =>
                setCurrentAvatar({ ...currentAvatar, prompt: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ttsProvider">TTS Provider</Label>
              <Select
                value={currentAvatar.tts.provider}
                onValueChange={(value) =>
                  setCurrentAvatar({
                    ...currentAvatar,
                    tts: { ...currentAvatar.tts, provider: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TTS_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ttsModel">TTS Model</Label>
              <Input
                id="ttsModel"
                placeholder="e.g., it-IT-Chirp3-HD-Aoede"
                value={currentAvatar.tts.model}
                onChange={(e) =>
                  setCurrentAvatar({
                    ...currentAvatar,
                    tts: { ...currentAvatar.tts, model: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={addAvatar} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              {editingIndex !== null ? "Update Avatar" : "Add Avatar"}
            </Button>
            {editingIndex !== null && (
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      {data.avatars.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Configured Avatars</h3>
          <div className="space-y-2">
            {data.avatars.map((avatar, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary rounded"
              >
                <div>
                  <p className="font-medium">{avatar.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {avatar.id} | Gender: {avatar.gender} | TTS: {avatar.tts.provider}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editAvatar(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAvatar(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
