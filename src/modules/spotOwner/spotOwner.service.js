import {ConflictError, NotFoundError} from '../../lib/error-definitions.js';
import {SpotOwner} from './spotOwner.schema.js';

export const createSpotOwner = async(payload) =>
{
    //check if a record already exists with the user details
    const existingEmail = await SpotOwner.findOne({
        email: payload.email,
    });
    if (existingEmail) {
        throw new ConflictError("A spot owner with the provided email already exists.");
    }
    const existingUsername = await SpotOwner.findOne({
        username: payload.username,
    });
    if (existingUsername) {
        throw new ConflictError("A spot owner with the provided username already exists.");
    }
    return await SpotOwner.create(payload);
};

export const getSpotOwner = async(id) =>
{
    return await getSpotOwner.findById(id);
};

export const getSpotOwnerByEmail = async(email) =>
{
    return await SpotOwner.findOne({email});
};

export const getSpotOwnerByRole = async(role) =>
{
    return await SpotOwner.find({role});
};

export const deleteSpotOwnerById = async (spotOwnerId) => {
    const spotOwner = await SpotOwner.findById(spotOwnerId);
    if (!spotOwner) {
        throw new NotFoundError('spot owner not found');
    }

    await spotOwner.deleteOne();
    return {success: true, message: 'Spot Owner deleted successfully'};
};