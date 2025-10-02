import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Send } from "lucide-react";
import { WizardData } from "./types";
import { toast } from "sonner";
import yaml from "js-yaml";

interface ExportStepProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

export const ExportStep = ({ data }: ExportStepProps) => {
  const [isCreating, setIsCreating] = useState(false);

  const generateYAML = () => {
    const config: any = {
      name: data.name,
      public: data.public,
      description: data.description,
    };

    if (data.avatars.length > 0) {
      config.avatars = data.avatars.map(avatar => ({
        id: avatar.id,
        url: avatar.url,
        gender: avatar.gender,
        name: avatar.name,
        prompt: avatar.prompt,
        tts: avatar.tts,
      }));
    }

    if (data.modules.length > 0) {
      config.modules = data.modules;
    }

    config.settings = {
      login: data.login,
    };

    if (data.settings.avatar) {
      config.settings.avatar = data.settings.avatar;
    }

    config.settings.language = data.settings.language;
    config.settings.chatModel = data.settings.chatModel;

    if (data.settings.prompt.text) {
      config.settings.prompt = {
        text: data.settings.prompt.text,
      };
    }

    config.settings.theme = data.settings.theme;

    if (data.knowledge.documents.length > 0) {
      config.knowledge = {
        documents: data.knowledge.documents.map(doc => ({
          url: doc.url || undefined,
          options: {
            parser: doc.parser,
          },
        })).filter(doc => doc.url),
      };
    }

    return yaml.dump(config, { indent: 2, lineWidth: -1 });
  };

  const downloadYAML = () => {
    const yamlContent = generateYAML();
    const blob = new Blob([yamlContent], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name.toLowerCase().replace(/\s+/g, "-") || "config"}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Configuration downloaded!");
  };

  const createApp = async () => {
    setIsCreating(true);
    try {
      const formData = new FormData();
      
      // Add YAML config
      const yamlContent = generateYAML();
      formData.append("config", new Blob([yamlContent], { type: "text/yaml" }), "config.yaml");

      // Add background file if uploaded
      if (data.settings.theme.background && data.settings.theme.background.startsWith("data:")) {
        const response = await fetch(data.settings.theme.background);
        const blob = await response.blob();
        formData.append("background", blob, "background.jpg");
      }

      // Add knowledge documents
      data.knowledge.documents.forEach((doc, index) => {
        if (doc.file) {
          formData.append(`document_${index}`, doc.file);
        }
      });

      const response = await fetch("http://sermas.local/api/app/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      toast.success("Application created successfully!");
      console.log("Creation result:", result);
    } catch (error) {
      console.error("Creation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create application");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="font-semibold mb-4">Create Application</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Submit your configuration to create the SERMAS application
        </p>
        <Button onClick={createApp} disabled={isCreating} className="w-full" size="lg">
          <Send className="w-4 h-4 mr-2" />
          {isCreating ? "Creating..." : "Create Application"}
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Download Configuration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Download your SERMAS configuration as a YAML file
        </p>
        <Button onClick={downloadYAML} variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download YAML Configuration
        </Button>
      </Card>

      <Card className="p-4 bg-muted">
        <h4 className="text-sm font-semibold mb-2">Preview</h4>
        <pre className="text-xs overflow-auto max-h-96 p-4 bg-background rounded">
          {generateYAML()}
        </pre>
      </Card>
    </div>
  );
};
