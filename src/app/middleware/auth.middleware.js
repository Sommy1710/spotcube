import {UnauthenticatedError} from "../../lib/error-definitions.js";
import { verifyAuthenticationToken } from "../providers/jwt.provider.js";
import {getBearerToken} from "../../lib/util.js";

/*export default function authMiddleware(req, res, next) {
  try {
    let token = getBearerToken(req);

    // If there is no Bearer token, check the cookie
    if (!token) {
      token = req.cookies?.authentication;
    }

    const decoded = verifyAuthenticationToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    throw new UnauthenticatedError(
      "invalid or missing token"
    );
  }
}*/
//delete the above middleware when pushing 
export default function authMiddleware(req, res, next) {
    try {
        const token = getBearerToken(req);
    const decoded = verifyAuthenticationToken(token);
    req.user = decoded;
    next();
    } catch (error) {
        throw new UnauthenticatedError('invalid or missing token');
    }
}
