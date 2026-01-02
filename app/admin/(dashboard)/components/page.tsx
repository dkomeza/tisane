import Link from "next/link";
import { COMPONENT_REGISTRY } from "@/components/registry";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Box } from "lucide-react";

export default function ComponentsAdminPage() {
  const components = Object.values(COMPONENT_REGISTRY);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Component Registry
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage and preview all available components for the application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {components.map((component) => (
          <Link
            key={component.id}
            href={`/admin/components/${component.id}`}
            className="group block"
          >
            <Card className="h-full border-muted/60 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 overflow-hidden bg-card/50 backdrop-blur-sm pt-0">
              <CardHeader className="bg-muted/30 border-b border-border/50 py-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Box className="w-5 h-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="font-mono text-xs bg-background/50"
                  >
                    {component.id}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-xl">
                  {component.label}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  Interactive preview available.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center text-sm font-medium text-primary group-hover:underline decoration-2 underline-offset-4">
                  View Component{" "}
                  <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
