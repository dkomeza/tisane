import Link from "next/link";
import { COMPONENT_REGISTRY, PLUGIN_REGISTRY, REGISTRY_CATEGORIES } from "@/components/registry";
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

      <div className="flex flex-col gap-8">
        {REGISTRY_CATEGORIES.map((category) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const all: Record<string, any> = { ...COMPONENT_REGISTRY, ...PLUGIN_REGISTRY };
          const components = category.componentIds.map(
            (id) => all[id],
          );

          return (
            <div key={category.id}>
              <h2 className="text-xl font-semibold mb-4 ml-2">
                {category.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {components.map((component) => (
                  <Link
                    key={component.id}
                    href={`/admin/components/${component.id}`}
                    className="group block"
                  >
                    <Card className="h-full border-muted/60 transition-all duration-300 hover:border-primary/50 hover:shadow-lg overflow-hidden bg-card/50 backdrop-blur-sm pt-0 gap-4">
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
                      <CardContent>
                        <div className="flex items-center text-sm font-medium text-primary relative w-fit">
                          View Component <ArrowRight className="ml-1 w-4 h-4" />
                          <span className="absolute top-full h-0.5 bg-primary left-1/2 right-1/2 group-hover:left-0 group-hover:right-0 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
