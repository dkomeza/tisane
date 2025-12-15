import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { useState } from "react";
import { PageWithoutContent as Page } from "@/app/actions/pages/get-pages";
import { deletePage } from "@/app/actions/pages/delete-page";
import { Spinner } from "@/components/ui/spinner";

function DeletePageDialog({ page }: { page: Page }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    await deletePage(page.id);

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
        >
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="pt-10">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Are you sure you want to delete the page{" "}
            <span className="text-nowrap whitespace-nowrap">
              &quot;{page.title}&quot;
            </span>
            ?
          </DialogTitle>
          <DialogDescription className="mt-4 text-sm text-muted-foreground">
            Deleting this page will move it to the archive for 30 days. After
            that, it will be permanently deleted. The page will no longer be
            accessible to users during this period.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              className="flex gap-2 items-center"
              variant="destructive"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading && <Spinner />}
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeletePageDialog;
