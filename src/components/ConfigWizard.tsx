import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { BasicInfoStep } from "./wizard/BasicInfoStep";
import { ModulesStep } from "./wizard/ModulesStep";
import { SettingsStep } from "./wizard/SettingsStep";
import { ThemeStep } from "./wizard/ThemeStep";
import { LLMStep } from "./wizard/LLMStep";
import { ExportStep } from "./wizard/ExportStep";
import { WizardData } from "./wizard/types";

const STEPS = [
  { id: 1, name: "Basic Info", component: BasicInfoStep },
  { id: 2, name: "Modules", component: ModulesStep },
  { id: 3, name: "Settings", component: SettingsStep },
  { id: 4, name: "Theme", component: ThemeStep },
  { id: 5, name: "LLM Config", component: LLMStep },
  { id: 6, name: "Export", component: ExportStep },
];

export const ConfigWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    appId: "",
    name: "",
    description: "",
    public: true,
    modules: [],
    settings: {
      login: false,
      avatar: "",
      background: "",
      language: "en-US",
      prompt: { text: "" },
      theme: {
        primaryBgColor: "#3b82f6",
        primaryTextColor: "#ffffff",
        secondaryBgColor: "#e5e7eb",
        secondaryTextColor: "#555555",
      },
      llm: {
        chat: "groq/openai/gpt-oss-120b",
        tools: "groq/openai/gpt-oss-120b",
        sentiment: "groq/openai/gpt-oss-120b",
        tasks: "groq/openai/gpt-oss-120b",
        intent: "groq/openai/gpt-oss-120b",
        translation: "groq/openai/gpt-oss-120b",
      },
    },
    files: {
      avatarFile: null,
      avatarUrl: "",
      backgroundFile: null,
      ragFiles: [],
    },
  });

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (newData: Partial<WizardData>) => {
    setData({ ...data, ...newData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            SERMAS Configuration Wizard
          </h1>
          <p className="text-muted-foreground">
            Create your SERMAS Toolkit application configuration
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep > step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "border-primary text-primary bg-primary/10"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Enter basic application information"}
              {currentStep === 2 && "Configure application modules"}
              {currentStep === 3 && "Configure application settings"}
              {currentStep === 4 && "Customize the theme colors"}
              {currentStep === 5 && "Select LLM models for different tasks"}
              {currentStep === 6 && "Upload files and export configuration"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent data={data} updateData={updateData} />

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentStep < STEPS.length ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Review and download your configuration
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
