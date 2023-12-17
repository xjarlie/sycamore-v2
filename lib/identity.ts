import { SycIdentity } from "./types";

export function decodeIdentity(identity: string): SycIdentity {
    const split = identity.split('@')[1].split('~');
    const pseudonym = split[0];
    const origin = split[1];

    return { pseudonym, origin };
}

export function encodeIdentity(identity: SycIdentity): string {
    return `@${identity.pseudonym}~${identity.origin}`;
}