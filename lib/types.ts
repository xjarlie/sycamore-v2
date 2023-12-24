export type SycMessage = {
    from: string,
    to?: string,
    chat: string,
    content: string,
    sent_timestamp: number,
    onetime?: number,
    auxiliary: boolean,
    encrypted: boolean,
    id: string
}

export type SycIdentity = {
    pseudonym: string,
    origin: string
}

export type SycChat = {
    id: string,
    name: string,
    members: string[],
    ckey?: string,
    messages?: SycMessage[]
}