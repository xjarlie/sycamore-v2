function decodeAux(content: string): DecodedAuxiliary {
    
    // Turn string into decoded auxiliary message
    return {
        category: 'no',
        instruction: 'no'
    }

}

function encodeAux(content: DecodedAuxiliary): string {

    // Turn decoded auxiliary content into string
    return 'no';

}

type DecodedAuxiliary = {
    category: string,
    instruction: string,
    parameters?: {key: string, value: string}[]
}

const instructions = {
    security: {
        ckey: {
            parameters: [
                'ckey'
            ]
        }
    },
    chataccess: {
        addmember: {
            parameters: [
                'identity'
            ]
        },
        removemember: {
            parameters: [
                'identity'
            ]
        },
        invite: {
            parameters: [
                'id', 'pkey', 'members',
            ]
        }
    },
    chataesthetics: {}
}