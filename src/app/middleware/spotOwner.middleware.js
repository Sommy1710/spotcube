import { SpotOwner } from "../../modules/spotOwner/spotOwner.schema.js";
import { UnauthenticatedError } from "../../lib/error-definitions.js";
import { verifyAuthenticationToken } from "../providers/jwt.provider.js";

export default async function spotOwnerMiddleware(req, res, next) {
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
}
