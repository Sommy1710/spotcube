import authMiddleware from "./auth.middleware.js";
import spotOwnerMiddleware from "./spotOwner.middleware.js";
import { UnauthenticatedError } from "../../lib/error-definitions.js";

export default function dualAuthMiddleware(req, res, next) {
  try {
    
    authMiddleware(req, res, () => {
      if (req.user) {
        // Set both .id and ._id for consistency
        if (!req.user.id) req.user.id = req.user._id?.toString();
        if (!req.user._id) req.user._id = req.user.id;

        return next();
      }

      spotOwnerMiddleware(req, res, () => {
        if (req.spotOwner) {
          // Set both .id and ._id for consistency
          if (!req.spotOwner.id)
            req.spotOwner.id = req.spotOwner._id?.toString();
          if (!req.spotOwner._id)
            req.spotOwner._id = req.spotOwner.id;

          return next();
        }

        throw new UnauthenticatedError("Not authenticated");
      });
    });
  } catch (err) {
    throw new UnauthenticatedError("Not authenticated");
  }
}