import {asyncHandler} from "../../lib/util.js";
import {NotFoundError} from "../../lib/error-definitions.js";
import { recordPostView } from './postViewService.js';

export const incrementPostViews = asyncHandler(async (req, res) => {
    const {id} =  req.params;

    const result = await recordPostView(req, id);

    if (!result) {
        throw new NotFoundError("Post not found")
    }

    res.status(200).json({
        success: true,
        counted: result.counted,
        message: result.counted
        ? "Post view recorded"
        : "Post already viewed or viewer not identified",
        ...(result.views !== undefined && {
            data: {
                views: result.views,
            },
        }),
    });
});
