import type { Cookie } from "@builder.io/qwik-city";

export const SessionIdCookieName = "sid";

const SessionCookiePath = "/";

export function putSessionIdAsCookie(sessionId: string, cookie: Cookie) {
  cookie.set(SessionIdCookieName, sessionId, {
    httpOnly: true,
    path: SessionCookiePath,
    sameSite: "strict",
  });
}

export function getSessionIdFromCookie(cookie: Cookie): string | null {
  return cookie.get(SessionIdCookieName)?.value ?? null;
}

export function deleteSessionIdCookie(cookie: Cookie) {
  cookie.delete(SessionIdCookieName, { path: SessionCookiePath });
}
