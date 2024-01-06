import { NextFunction, Request, Response } from "express";
import db from "./conn";
import crypto, { pseudoRandomBytes } from "crypto";
import { sycError } from "./error";


function generateAuthToken(lasts: number =2592000000 /* 30 days */) {
    const tokenData = crypto.randomBytes(64).toString('hex');
    const expires = Date.now() + lasts;
    return { token: tokenData, expires };
}

export async function genAndStoreToken(pseudonym: string, lasts: number = 43200000 /* 12 hours */) {
    const authToken = generateAuthToken(lasts);
    await db.set(`/users/${pseudonym}/authToken`, authToken);
    return authToken;
}

async function checkAuthToken(pseudonym: string, givenToken: string): Promise<boolean> {

    const dbToken = await db.get(`/users/${pseudonym}/authToken`);
    if (!dbToken) return false;
    if (dbToken.expires < Date.now()) return false;

    return dbToken.token === givenToken;

}

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    if (req.path.includes('createidentity') || req.path.includes('requestauth') || req.path.includes('verifyauth') || req.path.includes('pseudonymavailable')) {
        return next();
    }

    const givenToken: string = req.body.auth_token;
    if (!givenToken) return sycError(res, 'A003', 'Auth token required');

    const pseudonym: string = req.body.pseudonym;
    if (!pseudonym) return sycError(res, 'A003', 'Pseudonym required');

    if (await checkAuthToken(pseudonym, givenToken)) {
        next();
    } else {
        return sycError(res, 'A003');
    }

}