import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Download, FileText, X } from "lucide-react";
import { WizardData } from "./types";
import { toast } from "sonner";
import yaml from "js-yaml";

interface ExportStepProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

export const ExportStep = ({ data, updateData }: ExportStepProps) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const ragInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [".glb", ".fbx"];
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      if (validTypes.includes(fileExt)) {
        updateData({ files: { ...data.files, avatarFile: file } });
        toast.success(`Avatar file "${file.name}" added`);
      } else {
        toast.error("Please upload a .glb or .fbx file");
      }
    }
  };

  const handleBackgroundFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        updateData({ files: { ...data.files, backgroundFile: file } });
        toast.success(`Background image "${file.name}" added`);
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  const handleRAGFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const txtFiles = files.filter((f) => f.name.endsWith(".txt"));
    if (txtFiles.length > 0) {
      updateData({ files: { ...data.files, ragFiles: [...data.files.ragFiles, ...txtFiles] } });
      toast.success(`${txtFiles.length} RAG file(s) added`);
    } else {
      toast.error("Please upload .txt files");
    }
  };

  const removeRAGFile = (index: number) => {
    const newFiles = data.files.ragFiles.filter((_, i) => i !== index);
    updateData({ files: { ...data.files, ragFiles: newFiles } });
  };

  const generateYAML = () => {
    const config = {
      appId: data.appId,
      name: data.name,
      public: data.public,
      modules: data.modules.map((m) => ({
        moduleId: m.moduleId,
        secret: m.secret,
        supports: m.supports,
        config: m.config,
      })),
      description: data.description,
      settings: {
        login: data.settings.login,
        avatar: data.settings.avatar,
        background: data.settings.background,
        language: data.settings.language,
        prompt: {
          text: data.settings.prompt.text,
        },
        theme: data.settings.theme,
        llm: data.settings.llm,
      },
    };

    return yaml.dump(config, { indent: 2, lineWidth: -1 });
  };

  const downloadYAML = () => {
    const yamlContent = generateYAML();
    const blob = new Blob([yamlContent], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.appId || "config"}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Configuration downloaded!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Avatar Model</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
            <Input
              id="avatarUrl"
              placeholder="https://example.com/avatar.glb"
              value={data.files.avatarUrl}
              onChange={(e) =>
                updateData({ files: { ...data.files, avatarUrl: e.target.value } })
              }
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">or upload a file</p>
            <input
              ref={avatarInputRef}
              type="file"
              accept=".glb,.fbx"
              onChange={handleAvatarFile}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => avatarInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload GLB/FBX
            </Button>
            {data.files.avatarFile && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {data.files.avatarFile.name}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Background Image</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Minimum resolution: 1920x1080
        </p>
        <input
          ref={backgroundInputRef}
          type="file"
          accept="image/*"
          onChange={handleBackgroundFile}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => backgroundInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Background
        </Button>
        {data.files.backgroundFile && (
          <p className="text-sm text-muted-foreground mt-2">
            Selected: {data.files.backgroundFile.name}
          </p>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">RAG Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload .txt files for Retrieval-Augmented Generation
        </p>
        <input
          ref={ragInputRef}
          type="file"
          accept=".txt"
          multiple
          onChange={handleRAGFiles}
          className="hidden"
        />
        <Button variant="outline" onClick={() => ragInputRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          Upload TXT Files
        </Button>
        {data.files.ragFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.files.ragFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-secondary rounded"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRAGFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="font-semibold mb-4">Export Configuration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Download your SERMAS configuration as a YAML file
        </p>
        <Button onClick={downloadYAML} className="w-full">
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
