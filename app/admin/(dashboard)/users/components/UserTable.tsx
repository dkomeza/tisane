"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddUserDialog } from "./AddUserDialog";
import { Checkbox } from "./Checkbox";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { resendInvite } from "@/app/actions/admin/users/resend-invite";
import { toast } from "sonner";

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: Date;
  active: boolean;
};

const UserActions = ({ user }: { user: User }) => {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const handleResendInvite = async () => {
    const res = await resendInvite(user.id);

    if (res.success) {
      toast("Invite resent successfully");
    } else {
      toast.error(res.error || "Failed to resend invite");
    }
  };

  return (
    <>
      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={user}
      />
      <EditUserDialog open={editOpen} onOpenChange={setEditOpen} user={user} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {user.active ? (
            <DropdownMenuItem
              role="button"
              className="cursor-pointer"
              onClick={async () => {
                await navigator.clipboard.writeText(user.id);
                toast("User ID copied to clipboard");
              }}
            >
              Copy User ID
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              role="button"
              className="cursor-pointer"
              onClick={handleResendInvite}
            >
              Resend invite
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>View details</DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setEditOpen(true)}
          >
            Edit user
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3 w-full">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <UserIcon className="h-5 w-5" />
          </div>
          <span className="font-medium text-sm">{user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "admin" ? "default" : "secondary"}>
          {role || "User"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return (value as string[]).includes(row.getValue(id) as string);
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              active ? "bg-green-500" : "bg-zinc-300"
            }`}
          />
          <span className="text-muted-foreground">
            {active ? "Active" : "Inactive"}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as boolean;
      return (value as string[]).includes(String(rowValue));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Date Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.original.createdAt.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <UserActions user={row.original} />,
    meta: {
      className: "w-[1%]",
    },
  },
];

type UserTableProps = {
  data: User[];
  isLoading: boolean;
};

export default function UserTable({ data, isLoading }: UserTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const height = entry.contentRect.height;

        // Measure header height
        const headerElement = container.querySelector("thead");
        const headerHeight = headerElement
          ? headerElement.getBoundingClientRect().height
          : 50; // Fallback

        // Measure row height
        const rowElement = container.querySelector("tbody tr");
        const rowHeight = rowElement
          ? rowElement.getBoundingClientRect().height
          : 53; // Fallback

        const availableHeight = height - headerHeight;
        const newPageSize = Math.max(
          1,
          Math.floor(availableHeight / rowHeight)
        );

        setPagination((prev) => {
          if (prev.pageSize !== newPageSize) {
            return { ...prev, pageSize: newPageSize };
          }
          return prev;
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-muted-foreground">
        Loading users...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder="Filter emails..."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
            />
            <InputGroupAddon>
              <Search className="h-4 w-4" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {(table.getColumn("role")?.getFilterValue() as string[])
                  ?.length +
                  (table.getColumn("active")?.getFilterValue() as string[])
                    ?.length >
                  0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-sm px-1 font-normal lg:hidden"
                  >
                    {(table.getColumn("role")?.getFilterValue() as string[])
                      ?.length +
                      (table.getColumn("active")?.getFilterValue() as string[])
                        ?.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["admin", "editor", "user"].map((role) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={role}
                    checked={(
                      table.getColumn("role")?.getFilterValue() as string[]
                    )?.includes(role)}
                    onCheckedChange={(checked) => {
                      const column = table.getColumn("role");
                      const filterValue =
                        (column?.getFilterValue() as string[]) || [];
                      if (checked) {
                        column?.setFilterValue([...filterValue, role]);
                      } else {
                        column?.setFilterValue(
                          filterValue.filter((value) => value !== role)
                        );
                      }
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </DropdownMenuCheckboxItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ].map((status) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={status.value}
                    checked={(
                      table.getColumn("active")?.getFilterValue() as string[]
                    )?.includes(status.value)}
                    onCheckedChange={(checked) => {
                      const column = table.getColumn("active");
                      const filterValue =
                        (column?.getFilterValue() as string[]) || [];
                      if (checked) {
                        column?.setFilterValue([...filterValue, status.value]);
                      } else {
                        column?.setFilterValue(
                          filterValue.filter((value) => value !== status.value)
                        );
                      }
                    }}
                  >
                    {status.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
              {((table.getColumn("role")?.getFilterValue() as string[])
                ?.length > 0 ||
                (table.getColumn("active")?.getFilterValue() as string[])
                  ?.length > 0) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      table.getColumn("role")?.setFilterValue(undefined);
                      table.getColumn("active")?.setFilterValue(undefined);
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddUserDialog />
        </div>
      </div>
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-hidden flex flex-col"
      >
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="px-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell, i) => (
                        <TableCell
                          key={cell.id}
                          className={`px-2 ${i === 2 ? "w-full" : ""}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 pb-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
