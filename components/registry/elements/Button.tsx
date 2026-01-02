import { CMSComponent } from "@/components/registry";
import z from "zod";

type ButtonProps = {
  content: string;
};

export const Button: CMSComponent<ButtonProps> = {
  id: "button",
  label: "Button",

  ClientComponent: ButtonClientComponent,
  AdminComponent: ButtonAdminComponent,
  PreviewComponent: ButtonPreviewComponent,

  Schema: z.object({
    content: z.string().min(1).max(100).default("Click Me"),
  }),
};

function ButtonClientComponent({ content }: { content: string }) {
  return <button>{content}</button>;
}

function ButtonAdminComponent({ content }: { content: string }) {
  return <textarea></textarea>;
}

function ButtonPreviewComponent() {
  return <button disabled>Button Preview</button>;
}
