/**
 * Check if the current user is an admin
 * Admins are identified by email addresses in ADMIN_EMAILS environment variable
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  return adminEmails.includes(email);
}

/**
 * Verify admin access using service role key or admin email
 */
export function verifyAdminAccess(
  serviceRoleKey?: string,
  userEmail?: string | null
): boolean {
  // Check service role key
  if (serviceRoleKey === process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return true;
  }

  // Check admin email
  if (userEmail && isAdminEmail(userEmail)) {
    return true;
  }

  return false;
}

