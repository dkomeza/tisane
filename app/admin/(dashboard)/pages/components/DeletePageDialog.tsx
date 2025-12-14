import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import React from "react";
import { PageGroup } from "@/app/actions/pages/get-pages";

function DeletePageDialog({ page }: { page: PageGroup["page"] }) {
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
    </Dialog>
  );
}

export default DeletePageDialog;
