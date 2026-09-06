export const asyncHandler = (fn) => async function (req, res, next)
{
    try {
        return await fn(req, res);
    } catch (error) {
        next(error);
    }
};

export const getSecondsFromNow = (seconds) => {
    const currentTime = new Date();
    currentTime.setSeconds(currentTime.getSeconds() + seconds);
    return currentTime.getTime() / 1000;
};

export const getBearerToken = (req) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return null;
    return header.slice('Bearer '.length).trim() || null;
};
