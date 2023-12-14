/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_HOST: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
