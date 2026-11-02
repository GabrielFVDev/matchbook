export interface RenderAppOptions {
  // Starts with the sample account logged in, as if Firebase had restored her session.
  loggedIn?: boolean;
  // The photo of her Google account. Without it, the account has none.
  photoUrl?: string;
}

export interface ApiCall {
  method: string;
  // Without the leading "/api": "/recommendation/accept".
  path: string;
  search: string;
  authorization: string | null;
  body?: unknown;
}
