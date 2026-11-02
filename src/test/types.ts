export interface RenderAppOptions {
  loggedIn?: boolean;
  photoUrl?: string;
}

export interface ApiCall {
  method: string;
  path: string;
  search: string;
  authorization: string | null;
  body?: unknown;
}
