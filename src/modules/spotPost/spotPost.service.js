import { SpotPost } from './spotPost.schema.js';

export const createSpotPost = async (payload) => {
    return await SpotPost.create(payload);
};

export const getSpotPosts = async ({ skip = 0, limit = 20, ...filters}) =>{
    return await SpotPost.find(filters)
    .populate({
        path: 'comments',
        select: 'content author createdAt',
        populate: {
            path: 'author',
            select: 'username'
        }
    })
    .populate('author', 'username')
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);
};

export const getSpotPost = async (id) => {
    return await SpotPost.findById(id)
};

export const updateSpotPost = async (id, payload) => {
    return await SpotPost.findByIdAndUpdate(id, payload, {new: true});
};

export const deleteSpotPost = async (id) => {
    return await SpotPost.findByIdAndDelete(id);
};

