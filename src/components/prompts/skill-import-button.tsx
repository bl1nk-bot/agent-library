"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillImportDialog } from "./skill-import-dialog";

export function SkillImportButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleImport = (content: string, filename: string) => {
    // For now, navigate to create page with imported content
    // In a full implementation, you would parse and populate the form
    const params = new URLSearchParams({
      type: "SKILL",
      imported: "true",
      filename: filename,
    });
    
    // Store content in sessionStorage for the create page to pick up
    if (typeof window !== "undefined") {
      sessionStorage.setItem("importedSkillContent", content);
    }
    
    router.push(`/prompts/new?${params.toString()}`);
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs w-full sm:w-auto"
        onClick={() => setOpen(true)}
      >
        <Upload className="h-3.5 w-3.5 mr-1" />
        Import Skill
      </Button>
      
      <SkillImportDialog
        open={open}
        onOpenChange={setOpen}
        onImport={handleImport}
      />
    </>
  );
}
