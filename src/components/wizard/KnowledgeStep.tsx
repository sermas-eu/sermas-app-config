import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, X, Plus } from "lucide-react";
import { WizardData, Document } from "./types";
import { toast } from "sonner";

interface KnowledgeStepProps {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
}

export const KnowledgeStep = ({ data, updateData }: KnowledgeStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addDocument = () => {
    const newDoc: Document = {
      name: "",
      url: "",
      text: "",
    };
    updateData({
      knowledge: {
        documents: [...data.knowledge.documents, newDoc],
      },
    });
  };

  const removeDocument = (index: number) => {
    const newDocs = data.knowledge.documents.filter((_, i) => i !== index);
    updateData({
      knowledge: {
        documents: newDocs,
      },
    });
  };

  const updateDocument = (index: number, updates: Partial<Document>) => {
    const newDocs = [...data.knowledge.documents];
    newDocs[index] = { ...newDocs[index], ...updates };
    updateData({
      knowledge: {
        documents: newDocs,
      },
    });
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".txt")) {
        const text = await file.text();
        const name = file.name.replace(/\.txt$/, "").replace(/[^a-zA-Z0-9-]/g, "-");
        updateDocument(index, { name, text });
        toast.success(`Document "${file.name}" added`);
      } else {
        toast.error("Please upload a .txt file");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Upload text documents for Retrieval-Augmented Generation (RAG)
        </p>
        <Button onClick={addDocument} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Document
        </Button>
      </div>

      {data.knowledge.documents.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            No documents added yet. Click "Add Document" to get started.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.knowledge.documents.map((doc, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold">Document {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Document Name</Label>
                  <Input
                    placeholder="document-name"
                    value={doc.name}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[^a-zA-Z0-9-]/g, "-");
                      updateDocument(index, { name: sanitized });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Document URL</Label>
                  <Input
                    placeholder="https://example.com/document.txt"
                    value={doc.url}
                    onChange={(e) => updateDocument(index, { url: e.target.value })}
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">or upload a file</p>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => handleFileUpload(index, e)}
                    className="hidden"
                    id={`file-${index}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById(`file-${index}`)?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload TXT File
                  </Button>
                  {doc.text && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Content loaded ({doc.text.length} characters)
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
