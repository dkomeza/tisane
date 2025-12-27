import { PageForm } from "@/app/components/PageForm";
import { toast } from "sonner";

export default function CreatePage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Create Page</h1>
      <PageForm
        onSubmit={async (data) => {
          console.log("CREATE", data);
          toast.success("Page created");
        }}
      />
    </>
  );
}
