
function parseAux(content: String) {
    
    

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