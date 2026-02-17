import React, { useState, useCallback } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { DataTable } from "@/shared/custom-ui/data-table";
import { EditSheet, type EditSheetField } from "@/shared/custom-ui/edit-sheet";
import type { ColumnDef, ActionDef } from "@/shared/custom-ui/data-table/types";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joinDate: string;
}

// Sample data
const initialData: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
    joinDate: "2024-02-10",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Editor",
    status: "inactive",
    joinDate: "2024-01-20",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "User",
    status: "active",
    joinDate: "2024-03-05",
  },
];

// Edit sheet fields configuration
const editSheetFields: EditSheetField[] = [
  {
    key: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter full name",
    required: true,
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter email address",
    required: true,
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "Admin", label: "Admin" },
      { value: "Editor", label: "Editor" },
      { value: "User", label: "User" },
    ],
    required: true,
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
    required: true,
  },
  {
    key: "joinDate",
    label: "Join Date",
    type: "date",
    required: true,
  },
];

export default function UsersTablePage() {
  const [data, setData] = useState<User[]>(initialData);
  const [editSheet, setEditSheet] = useState<{
    open: boolean;
    mode: "add" | "edit";
    data?: User;
  }>({
    open: false,
    mode: "add",
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId?: string;
  }>({
    open: false,
  });

  // Handle edit sheet open for adding
  const handleAddNew = useCallback(() => {
    setEditSheet({
      open: true,
      mode: "add",
      data: undefined,
    });
  }, []);

  // Handle edit sheet open for editing
  const handleEdit = useCallback((user: User) => {
    setEditSheet({
      open: true,
      mode: "edit",
      data: user,
    });
  }, []);

  // Handle edit sheet save
  const handleSave = useCallback((formData: User) => {
    if (editSheet.mode === "add") {
      const newUser: User = {
        ...formData,
        id: Date.now().toString(),
      };
      setData((prev) => [...prev, newUser]);
    } else if (editSheet.mode === "edit" && editSheet.data) {
      setData((prev) =>
        prev.map((user) => (user.id === editSheet.data!.id ? formData : user))
      );
    }
    setEditSheet({ open: false, mode: "add" });
  }, [editSheet.mode, editSheet.data]);

  // Handle delete confirmation
  const handleDeleteClick = useCallback((user: User) => {
    setDeleteDialog({
      open: true,
      userId: user.id,
    });
  }, []);

  // Handle delete confirmation
  const handleConfirmDelete = useCallback(() => {
    if (deleteDialog.userId) {
      setData((prev) => prev.filter((user) => user.id !== deleteDialog.userId));
      setDeleteDialog({ open: false });
    }
  }, [deleteDialog.userId]);

  // Column definitions
  const columns: ColumnDef<User>[] = [
    {
      key: "name" as keyof User,
      header: "Name",
      width: 180,
      sortable: true,
    },
    {
      key: "email" as keyof User,
      header: "Email",
      width: 220,
      sortable: true,
    },
    {
      key: "role" as keyof User,
      header: "Role",
      width: 120,
      sortable: true,
    },
    {
      key: "status" as keyof User,
      header: "Status",
      width: 120,
      sortable: true,
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        </span>
      ),
    },
    {
      key: "joinDate" as keyof User,
      header: "Join Date",
      width: 150,
      sortable: true,
      render: (value) => new Date(String(value)).toLocaleDateString(),
    },
  ];

  // Action buttons
  const actions: ActionDef<User>[] = [
    {
      icon: <Edit2 className="h-4 w-4" />,
      label: "Edit",
      onClick: handleEdit,
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      label: "Delete",
      onClick: handleDeleteClick,
    },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your users and their roles
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Data Table */}
      <DataTable<User>
        data={data}
        columns={columns}
        actions={{
          header: "Actions",
          width: "100px",
          items: actions,
        }}
        title="Users"
        enableRowSelection={false}
        enableColumnFilters={true}
        enableGlobalSearch={true}
        initialPageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />

      {/* Edit Sheet */}
      <EditSheet<User>
        open={editSheet.open}
        onOpenChange={(open) => setEditSheet({ ...editSheet, open })}
        title={editSheet.mode === "add" ? "Add New User" : "Edit User"}
        description={
          editSheet.mode === "add"
            ? "Create a new user account"
            : "Update user information"
        }
        data={editSheet.data}
        fields={editSheetFields}
        onSave={handleSave}
        mode={editSheet.mode}
        showResetButton={true}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
