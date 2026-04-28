/**
 * JWT utility — decode payload without a library
 * The backend embeds `role` as a claim (e.g. "ROLE_ADMIN") in the token body.
 */

/**
 * Safely decode a JWT and return its payload as an object.
 * Returns null if the token is malformed.
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    // Fix base64url → base64
    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Extract the role string from a JWT token.
 * The backend stores it as "ROLE_ADMIN", so we strip the prefix and normalise.
 * Returns "USER" as default if role is missing.
 */
export const getRoleFromToken = (token) => {
  const payload = decodeToken(token);
  if (!payload?.role) return "USER";
  // Strip the "ROLE_" prefix added by Spring Security
  return payload.role.replace("ROLE_", "");
};

/**
 * Check if a JWT token has expired.
 */
export const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
};
