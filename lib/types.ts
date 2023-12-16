export type SycMessage = {
    from: String,
    to: String,
    chat: String,
    content: String,
    sent_timestamp: Number,
    onetime?: Number,
    auxiliary: Boolean,
    encrypted: Boolean
}