import { useMemo } from "react";
import { Check } from "lucide-react";

import { passwordRules, PasswordSchema } from "@/lib/schemas/SignupSchema";
import { cn } from "@/lib/utils"; // Standard shadcn utility

export default function PasswordChecklist({
  password,
}: {
  password?: string | null;
}) {
  const validationResult = useMemo(() => {
    return PasswordSchema.safeParse(password || "");
  }, [password]);

  const errorMessages = !validationResult.success
    ? validationResult.error.issues.map((issue) => issue.message)
    : [];

  return (
    <ul className="space-y-1 text-xs pl-1">
      {passwordRules.map((req, i) => {
        const isMet = !errorMessages.includes(req.description);

        return (
          <li
            key={i}
            className={cn(
              "flex items-center gap-2 transition-colors duration-200",
              isMet ? "text-green-500" : "text-muted-foreground"
            )}
          >
            {isMet ? (
              <Check className="h-3.5 w-3.5 shrink-0" />
            ) : (
              // You can use <X /> here for red crosses, or a circle for "pending"
              <div className="h-3.5 w-3.5 rounded-full border border-current shrink-0" />
            )}
            <span>{req.description}</span>
          </li>
        );
      })}
    </ul>
  );
}
