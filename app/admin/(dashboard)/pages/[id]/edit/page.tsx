import { PageForm } from "@/app/components/PageForm";
import { PageFormValues } from "@/lib/schemas/EditCreateSchema";
import { toast } from "sonner";

export default function EditPage() {
  const mock: PageFormValues = {
    title: "About",
    slug: "about",
    status: "published",
    seoTitle: "About us",
    seoDescription: "About company",
    content: "{}",
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Edit Page</h1>
      <PageForm
        defaultValues={mock}
        onSubmit={async (data) => {
          console.log("UPDATE", data);
          toast.success("Page updated");
        }}
      />
    </>
  );
}
