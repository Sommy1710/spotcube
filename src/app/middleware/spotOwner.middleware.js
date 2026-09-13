
import { UnauthenticatedError } from "../../lib/error-definitions.js";
import { verifyAuthenticationToken } from "../providers/jwt.provider.js";


export default function spotOwnerMiddleware(req, res, next) {
    try {
        console.log("========== SPOT OWNER MIDDLEWARE ==========");

        console.log("Authorization header:", req.headers.authorization);

        const token = getBearerToken(req);

        console.log("Extracted token:", token);
        console.log("Token exists:", !!token);

        if (!token) {
            throw new UnauthenticatedError("No token provided");
        }

        const decoded = verifyAuthenticationToken(token);

        console.log("Decoded token:", decoded);

        req.spotOwner = decoded;

        console.log("Spot Owner authenticated successfully");

        next();

    } catch (error) {
        console.error("SPOT OWNER AUTH ERROR:", error);

        throw new UnauthenticatedError("invalid or missing token");
    }
}
/*export default function spotOwnerMiddleware(req, res, next) {
  try {
    const token = getBearerToken(req);

    const decoded = verifyAuthenticationToken(token);

    req.spotOwner = decoded;

    next();
  } catch (error) {
    throw new UnauthenticatedError("invalid or missing token");
  }
}*/
/*export default async function spotOwnerMiddleware(req, res, next) {
  try {
    const token = req.cookies.authentication;
    if (!token) throw new UnauthenticatedError("Missing authentication token");

    const decoded = verifyAuthenticationToken(token);

    // Fetch spot owner from DB to get username
    const spotOwner = await SpotOwner.findById(decoded.id).select("_id username email");

    if (!spotOwner) throw new UnauthenticatedError("Spot Owner not found");

    req.spotOwner = {
      id: spotOwner._id,
      username: spotOwner.username,
      email: spotOwner.email
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid or missing token");
  }
}*/
