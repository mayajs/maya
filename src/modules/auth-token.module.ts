import { CustomModule, MayaJsNextFunction, MayaJsRequest, MayaJsResponse, MODULE_KEY, MODULE_ROUTES, use } from "@mayajs/router";
import jwt from "jsonwebtoken";

export interface UnguardedRoute {
  path: RegExp | string;
  method: string;
}

export type UnguardedRoutes = UnguardedRoute[];

export interface AuthUser {
  iat?: string;
  exp?: string;
}

export interface AuthRequest<T extends AuthUser> extends MayaJsRequest {
  user?: T;
  url?: any;
}

type AuthTokenMiddleware<T> = (req: AuthRequest<T>, res: MayaJsResponse, next: MayaJsNextFunction) => void | Promise<void>;

export class AuthTokenModule extends CustomModule {
  checkAuthorization(authorization: string): string {
    if (!authorization) {
      return "Token not found";
    }

    const auth = authorization.split(" ");

    if (auth[0] !== "Bearer") {
      return "Malformed token";
    }

    return auth[1];
  }

  setReqUser<T extends AuthUser>(auth: string, jwtKey: string): T {
    const { iat, exp, ...token }: any = jwt.verify(auth, jwtKey);
    return { ...token };
  }

  verifyAuthorization<T extends AuthUser>(req: AuthRequest<T>, send: Function, next: MayaJsNextFunction) {
    const { authorization = "" } = req.headers;
    const auth = this.checkAuthorization(authorization);
    req.user = this.setReqUser<T>(auth, AuthTokenModule.key);

    if (auth === "Token not found" || auth === "Malformed token") {
      return send(auth);
    }

    return next();
  }

  authToken<T>(unGuardedRoute: UnguardedRoutes): AuthTokenMiddleware<T> {
    return (req, res, next) => {
      const send = (message: string) => {
        res.send({ status: "Unauthorized", message });
      };

      try {
        const regex = (condition: RegExp) => new RegExp(condition);
        const unprotected = unGuardedRoute.filter(({ path, method }) => {
          const isUrlMatched = path instanceof RegExp ? regex(path).test(req.url) : path === req.url.replace(/\/$/g, "");
          return isUrlMatched && req.method === method;
        });

        if (unprotected.length) {
          return next();
        }

        return this.verifyAuthorization(req, send, next);
      } catch (err) {
        const error = err as Error;
        send(error.message ? error.message : "Invalid token");
        return;
      }
    };
  }

  invoke() {
    const callback = this.authToken(AuthTokenModule.routes);
    use(callback);
  }

  static forRoot(routes: UnguardedRoutes, key: string) {
    AuthTokenModule.routes = routes;
    AuthTokenModule.key = key;
    return { module: AuthTokenModule, providers: [] };
  }
}
