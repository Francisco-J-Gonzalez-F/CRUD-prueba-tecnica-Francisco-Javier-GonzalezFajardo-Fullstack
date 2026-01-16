import type { AuthUser } from '../auth/auth.types';
import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      cookies?: Record<string, string>;
    }
  }
}
declare module 'express-serve-static-core' {
  interface Request {
    cookies?: Record<string, string>;
  }
}
export {};
