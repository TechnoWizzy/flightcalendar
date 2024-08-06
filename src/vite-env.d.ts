/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_PUBLIC_POSTHOG_KEY: string
    readonly VITE_PUBLIC_POSTHOG_HOST: string
    readonly VITE_FEEDBACK_WEBHOOK_URL: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}