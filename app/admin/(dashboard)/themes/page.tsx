import { authorize } from "@/lib/auth/authorize";
import { redirect } from "next/navigation";
import { getThemes } from "@/app/actions/themes/get-themes";
import { getActiveThemeSlug } from "@/app/actions/themes/get-active-theme-slug";
import { ThemeCard } from "./components/ThemeCard";

async function ThemesPage() {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  const [themesResult, activeSlug] = await Promise.all([
    getThemes(),
    getActiveThemeSlug(),
  ]);

  const themes = themesResult.success ? themesResult.data.themes : [];

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Themes</h1>
        <p className="text-lg font-light text-secondary-foreground/70">
          Customize the appearance of your site with installable themes.
        </p>
      </div>

      {!themesResult.success && (
        <p className="text-destructive text-sm">
          Failed to load themes: {themesResult.error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={theme.slug === activeSlug}
          />
        ))}
        {themes.length === 0 && (
          <div className="rounded-lg border bg-card p-6 text-center">
            <p className="text-muted-foreground text-sm">
              No themes installed. Install a theme plugin to get started.
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Themes are installed through the plugin system with{" "}
              <code className="font-mono">type: &quot;theme&quot;</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemesPage;
