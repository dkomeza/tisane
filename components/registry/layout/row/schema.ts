import z from "zod";

export const Schema = z.object({
  direction: z.enum(["row", "column"]).default("row"),
  justify: z
    .enum(["start", "end", "center", "between", "around", "evenly"])
    .default("start"),
  align: z
    .enum(["start", "end", "center", "baseline", "stretch"])
    .default("start"),
  gap: z.number().min(0).max(12).default(4),
  wrap: z.enum(["wrap", "nowrap"]).default("wrap"),

  padding: z.enum(["0", "2", "4", "8", "12"]).default("4"),
  width: z.enum(["full", "container"]).default("full"),

  children: z.array(z.any()).default([]),
});

export type RowProps = z.infer<typeof Schema>;
