/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_PORT?: string;
  /** Sentry DSN. Leave empty to disable error reporting. */
  readonly VITE_SENTRY_DSN?: string;
  /** 'false' allows users without an enrolled TOTP factor to skip MFA enrollment. Defaults to required. */
  readonly VITE_REQUIRE_MFA?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
