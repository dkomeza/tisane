"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitFeedback } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FeedbackForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await submitFeedback(formData);
        toast.success("Feedback submitted successfully!");
        const form = document.getElementById("feedback-form") as HTMLFormElement;
        form.reset();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to submit feedback.");
      }
    });
  };

  return (
    <form id="feedback-form" action={handleSubmit} className="flex flex-col gap-6 max-w-2xl bg-muted/30 p-6 rounded-lg border border-border">
      <div className="flex flex-col gap-2">
        <Label htmlFor="type">Type of Feedback</Label>
        <Select name="type" defaultValue="Bug Report">
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bug Report">Bug Report</SelectItem>
            <SelectItem value="Feature Request">Feature Request</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          name="title" 
          required 
          placeholder="e.g., The CMS crashes when saving a new page" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          required 
          rows={6}
          placeholder="Please provide as much detail as possible..." 
        />
      </div>

      <div className="flex justify-end">
        <Button disabled={isPending} type="submit">
          {isPending ? "Submitting..." : "Submit to GitHub"}
        </Button>
      </div>
    </form>
  );
}
