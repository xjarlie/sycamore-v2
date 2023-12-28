import db from "./conn";
import { decodeIdentities, decodeIdentity, encodeIdentity } from "./identity";
import { serverInfo } from "./serverInfo";
import { SycMessage, SycChat, SycIdentity } from "./types";

type ChatReturn = {
    success: boolean,
    error?: {
        code: string,
        message?: string
    }
}

export async function sendMessageToChat(message: SycMessage, chat: SycChat): Promise<ChatReturn> {
    // MESSAGE SHOULD HAVE ALL FIELDS INCLUDED AND CORRECT (except 'to') BEFORE THIS POINT

    const decodedMembers: SycIdentity[] = decodeIdentities(chat.members, true);

    for (const identity of decodedMembers) {

        const body = {
            message: { ...message, to: encodeIdentity(identity) }
        };

        // If local identity, no need to fetch
        if (identity.origin === serverInfo.address) {
            const msgSent = await receiveMessage(body.message);
            if (msgSent.success === false) {
                return msgSent;
            }
            continue;
        }

        const response = await fetch(`${identity.origin}/syc/server/inbox`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const status = response.status;
        const json = await response.json();
        if (json.success === false) {
            return {
                success: false,
                error: json.error
            }
        }
    }

    return { success: true }
}

export async function sendMessage(message: SycMessage): Promise<ChatReturn> {

    const recipient = decodeIdentity(message.to as string, true);

    // Local identity
    if (recipient.origin === serverInfo.address) {
        const msgSent = await receiveMessage(message);
        return msgSent;
    }

    // External identity
    const response = await fetch(`${recipient.origin}/syc/server/inbox`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    });
    const status = response.status;
    const json = await response.json();
    if (json.success === false) {
        return {
            success: false,
            error: json.error
        }
    }

    return { success: true };
}

export async function receiveMessage(message: SycMessage): Promise<ChatReturn> {
    // MESSAGE SHOULD HAVE ALL FIELDS CORRECT BEFORE THIS POINT


    if (message.auxiliary && !message.encrypted) {
        // TODO: process auxiliary messages
    }

    // Assume here (after processing auxiliary) that chat should have been created and members should be correct

    // Verify that chat exists for recipient
    const recipient = decodeIdentity(message.to as string);
    const chat: SycChat = await db.get(`/users/${recipient.pseudonym}/chats/${message.chat}`);

    if (!chat) {
        return {
            success: false,
            error: {
                code: 'B001'
            }
        }
    }

    // Verify that sender is in chat member list
    if (!chat.members.includes(message.from)) {
        return {
            success: false,
            error: {
                code: 'C002',
                message: 'Sender not in chat'
            }
        }
    }

    if (chat.messages && chat.messages[message.id]) {
        return {
            success: false,
            error: {
                code: 'C004'
            }
        }
    }

    // Store message under /users/:pseudonym/chats/:chatID/messages
    await db.set(`/users/${recipient.pseudonym}/chats/${message.chat}/messages/${message.id}`, message);

    console.log('MESSAGE RECEIVED: ', message.content, 'FROM: ', message.from, 'TO: ', message.to);

    return {
        success: true
    }

}