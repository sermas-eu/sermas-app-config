import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { WizardData, Module } from "./types";

interface ModulesStepProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

const AVAILABLE_SUPPORTS = [
  "dialogue",
  "detection",
  "ui",
  "session",
  "platform",
  "robotics",
];

export const ModulesStep = ({ data, updateData }: ModulesStepProps) => {
  const addModule = () => {
    const newModule: Module = {
      moduleId: "",
      secret: Math.random().toString(36).substring(2, 15),
      supports: [],
      config: {},
    };
    updateData({ modules: [...data.modules, newModule] });
  };

  const removeModule = (index: number) => {
    const newModules = data.modules.filter((_, i) => i !== index);
    updateData({ modules: newModules });
  };

  const updateModule = (index: number, updates: Partial<Module>) => {
    const newModules = [...data.modules];
    newModules[index] = { ...newModules[index], ...updates };
    updateData({ modules: newModules });
  };

  const toggleSupport = (moduleIndex: number, support: string) => {
    const module = data.modules[moduleIndex];
    const newSupports = module.supports.includes(support)
      ? module.supports.filter((s) => s !== support)
      : [...module.supports, support];
    updateModule(moduleIndex, { supports: newSupports });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Add and configure modules for your application
        </p>
        <Button onClick={addModule} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      {data.modules.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No modules added yet</p>
          <Button onClick={addModule} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Module
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.modules.map((module, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Module ID</Label>
                      <Input
                        placeholder="e.g., avatar, robot"
                        value={module.moduleId}
                        onChange={(e) =>
                          updateModule(index, { moduleId: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Secret</Label>
                      <Input
                        placeholder="Auto-generated secret"
                        value={module.secret || ""}
                        onChange={(e) =>
                          updateModule(index, { secret: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Supports</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_SUPPORTS.map((support) => (
                          <div key={support} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${index}-${support}`}
                              checked={module.supports.includes(support)}
                              onCheckedChange={() => toggleSupport(index, support)}
                            />
                            <label
                              htmlFor={`${index}-${support}`}
                              className="text-sm cursor-pointer"
                            >
                              {support}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeModule(index)}
                    className="ml-4"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
