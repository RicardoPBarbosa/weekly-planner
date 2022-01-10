/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_FB_API_KEY: string
  readonly VITE_CLIENT_FB_AUTH_DOMAIN: string
  readonly VITE_CLIENT_FB_DB_URL: string
  readonly VITE_CLIENT_FB_PROJECT_ID: string
  readonly VITE_CLIENT_FB_STORAGE_BUCKET: string
  readonly VITE_CLIENT_FB_MESSAGING_SENDER_ID: string
  readonly VITE_CLIENT_FB_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
