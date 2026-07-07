export const ADMIN_COOKIE_NAME = "wedding_admin_session";

/** Set ADMIN_COOKIE_SECURE=true only after HTTPS is enabled (domain + SSL). */
export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
