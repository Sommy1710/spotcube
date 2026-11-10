import {asyncHandler} from "../../lib/util.js";
import {NotFoundError} from "../../lib/error-definitions.js";
import { recordSpotPostView } from './spotPostViewService.js';

export const incrementSpotPostViews = asyncHandler(async (req, res) => {
    const {id} =  req.params;

    const result = await recordSpotPostView(req, id);

    if (!result) {
        throw new NotFoundError("spotPost not found")
    }

    res.status(200).json({
        success: true,
        counted: result.counted,
        message: result.counted
        ? "spotPost view recorded"
        : "spotPost already viewed or viewer not identified",
        ...(result.views !== undefined && {
            data: {
                views: result.views,
            },
        }),
    });
});
