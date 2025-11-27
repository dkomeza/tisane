// 1. Define your roles
export type Role = "admin" | "editor";

// 2. Define the permissions
type Permission =
  | "users.manage"
  | "content.create"
  | "content.delete"
  | "content.read";

// 3. Map Roles to Permissions (The Hierarchy)
const PERMISSIONS: Record<Role, Permission[]> = {
  // Admin has their own powers PLUS everything Editor has
  admin: ["users.manage", "content.create", "content.delete", "content.read"],

  // Editor has their own powers
  editor: ["content.create", "content.read"],
};

// 4. The Magic Function
export function hasPermission(
  userRole: string | undefined,
  permission: Permission
): boolean {
  if (!userRole) return false;

  // Safety check to ensure the string from DB is a valid role
  const rolePermissions = PERMISSIONS[userRole as Role];

  if (!rolePermissions) return false; // Unknown role

  return rolePermissions.includes(permission);
}
