import { SycIdentity } from "./types";

export function decodeIdentity(identity: string, addProtocol: boolean = false): SycIdentity {
    const split = identity.split('@')[1].split('~');
    const pseudonym = split[0];
    let origin = split[1];
    if (addProtocol && !origin.includes('http')) origin = 'https://' + origin;

    return { pseudonym, origin };
}

export function decodeIdentities(identities: string[], addProtocol: boolean = false): SycIdentity[] {
    const decoded: SycIdentity[] = [];
    for (const identity of identities) {
        decoded.push(decodeIdentity(identity, addProtocol));
    }
    return decoded;
}

export function encodeIdentity(identity: SycIdentity): string {
    return `@${identity.pseudonym}~${identity.origin}`;
}