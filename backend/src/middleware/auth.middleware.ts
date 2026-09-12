import { Request, Response, NextFunction } from 'express';

export interface AuthedUser {
  id: string;
  email?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}

/**
 * Passthrough authentication middleware.
 *
 * The frontend stores generated images in the browser (localStorage) and does
 * not require server-side authentication, so this middleware simply guarantees
 * `req.user` is present. Replace with real auth (e.g. TCB / CloudBase) when a
 * backend-backed gallery is introduced.
 */
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    req.user = { id: 'local-guest' };
  }
  next();
};
