import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { WizardData } from "./types";

interface LLMStepProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

const LLM_MODELS = [
  { value: "openai/gpt-4.1", label: "OpenAI GPT-4.1" },
  { value: "groq/openai/gpt-oss-120b", label: "Groq GPT OSS 120B" },
  { value: "anthropic/claude-3", label: "Anthropic Claude 3" },
];

const LLM_TASKS = [
  { key: "chat", label: "Chat", description: "Main conversational model" },
  { key: "tools", label: "Tools", description: "Function calling and tool usage" },
  { key: "sentiment", label: "Sentiment", description: "Emotion and sentiment analysis" },
  { key: "tasks", label: "Tasks", description: "Task planning and execution" },
  { key: "intent", label: "Intent", description: "User intent classification" },
  { key: "translation", label: "Translation", description: "Language translation" },
];

export const LLMStep = ({ data, updateData }: LLMStepProps) => {
  const updateLLM = (key: string, value: string) => {
    updateData({
      settings: {
        ...data.settings,
        llm: { ...data.settings.llm, [key]: value },
      },
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select LLM models for different AI tasks. You can use different models for different
        purposes or use the same model for all tasks.
      </p>

      {LLM_TASKS.map((task) => (
        <Card key={task.key} className="p-4">
          <div className="space-y-2">
            <Label htmlFor={task.key}>
              {task.label}
              <span className="text-sm text-muted-foreground ml-2">
                {task.description}
              </span>
            </Label>
            <Select
              value={data.settings.llm[task.key as keyof typeof data.settings.llm]}
              onValueChange={(value) => updateLLM(task.key, value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LLM_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
      ))}
    </div>
  );
};
