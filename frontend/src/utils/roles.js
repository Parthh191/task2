export const ROLES = {
  LEAD: 'lead',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

export const PERMISSIONS = {
  VIEW_BLOGS: [ROLES.LEAD, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  EDIT_BLOGS: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  DELETE_BLOGS: [ROLES.SUPER_ADMIN],
  MANAGE_USERS: [ROLES.SUPER_ADMIN]
};

export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return PERMISSIONS[permission]?.includes(userRole) || false;
};