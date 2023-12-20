import db from "./conn";
import crypto from "crypto";


function generateAuthToken(lasts: number =2592000000 /* 30 days */) {
    const tokenData = crypto.randomBytes(64).toString('hex');
    const expires = Date.now() + lasts;
    return { token: tokenData, expires };
}

export function genAndStoreToken(lasts: number = 86400000 /* 1 day */) {
    // TODO: use generateAuthToken to create token, then store in database and return value
}

export function checkAuthToken(pseudonym: string, givenToken: string) {
    // TODO: compare given token against database stored token for given pseudonym
}