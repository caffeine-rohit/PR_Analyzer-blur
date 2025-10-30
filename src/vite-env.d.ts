/// <reference types="vite/client" />

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string
  readonly GITHUB_TOKEN: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
