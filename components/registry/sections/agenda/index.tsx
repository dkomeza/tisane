/**
 * Component: Agenda
 */

import {
  CMSComponent,
} from "@/components/registry";
import z from "zod";
import { LayoutGrid } from "lucide-react";
import { AgendaClient } from "./AgendaClient";
import { AgendaAdmin } from "./AgendaAdmin";

const SpeakerSchema = z.object({
  name: z.string().default("Tomek Miechowski"),
  role: z.string().default("Specjalista ds. Rekrutacji w Google"),
});

export const AgendaItemSchema = z.object({
  startTime: z.string().default("08:30"),
  endTime: z.string().default("09:30"),
  tag: z.string().default("#PANEL"),
  title: z.string().default("Quantum Computing"),
  subtitle: z.string().default("jak komputery kwantowe zmienią przyszłość IT?"),
  description: z.string().default("kształtuj przyszłych liderów technologii w obszarach takich jak programowanie, AI, Data Science, cyberbezpieczeństwo, IoT czy uczenie maszynowe."),
  mediaId: z.string().optional(),
  speakers: z.array(SpeakerSchema).default([
    { name: "Tomek Miechowski", role: "Specjalista ds. Rekrutacji w Google" },
    { name: "Tomek Miechowski", role: "Specjalista ds. Rekrutacji w Google" }
  ]),
  location: z.string().default("s. 1.18 bud. D-17"),
  type: z.enum(["session", "break"]).default("session"),
  breakLabel: z.string().default("PRZERWA"),
});

export type AgendaItemSchemaValue = z.infer<typeof AgendaItemSchema>;

export type AgendaProps = {
  layout: "standard" | "list";
  items: AgendaItemSchemaValue[];
};

export const Agenda: CMSComponent<"agenda", AgendaProps> = {
  id: "agenda" as const,
  label: "Agenda",

  ClientComponent: AgendaClient,
  AdminComponent: AgendaAdmin,
  PreviewComponent: AgendaPreview,

  Schema: z.object({
    layout: z.enum(["standard", "list"]).default("standard"),
    items: z.array(AgendaItemSchema).default([]),
  }),
};

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function AgendaPreview() {
  return (
    <div className="p-8 border border-dashed border-zinc-300 rounded-xl flex items-center justify-center bg-brand-grey-100">
      <div className="text-center">
        <div className="bg-brand-purple-100 p-3 rounded-full inline-block mb-3">
          <LayoutGrid className="text-brand-purple-300" size={24} />
        </div>
        <div className="text-xs font-black text-brand-grey-600 uppercase tracking-widest">Agenda Section</div>
        <div className="text-[10px] text-brand-grey-400 mt-1 uppercase">Switchable Layouts</div>
      </div>
    </div>
  );
}