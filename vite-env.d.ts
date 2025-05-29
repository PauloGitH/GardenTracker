declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VITE_PORT?: number;
    VITE_PUBLIC_URL?: string;
    VITE_API_URL?: string;
    DATABASE_URL: string;
  }
}
