import {NotFoundError, UnauthenticatedError} from "../../lib/error-definitions.js";
import {generateAuthenticationToken} from "../../app/providers/jwt.provider.js";
import argon from 'argon2';
import * as spotOwnerService from './spotOwner.service.js';

export const registerSpotOwner = async(payload) => {
    await spotOwnerService.createSpotOwner(payload);
};

export const authenticateSpotOwner = async (payload) => 
{
    const spotOwner = await spotOwnerService.getSpotOwnerByEmail(payload.email);

    if(!spotOwner) throw new NotFoundError('we could not validate your credentials, please try again');

    if(!(await argon.verify(spotOwner.password, payload.password))) throw new UnauthenticatedError('we could not validate your credentials, please try again');

    //create the token and set it in the cookie

    return generateAuthenticationToken({
        id: spotOwner.id,
        email: spotOwner.email,
        username: spotOwner.username,
        role: spotOwner.role,

    });

}