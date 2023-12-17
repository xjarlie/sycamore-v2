export type SycMessage = {
    from: String,
    to?: String,
    chat: String,
    content: String,
    sent_timestamp: Number,
    onetime?: Number,
    auxiliary: Boolean,
    encrypted: Boolean
}

export type SycIdentity = {
    pseudonym: string,
    origin: string
}

export type SycChat = {
    id: string,
    name: string,
    members: string[] | SycIdentity[],
    skey: string
}