const generateLocationMessage = (username, url) => {
    return {
        username,
        text: url,
        time: new Date()
    }
}

const generateMessage = (username, text) => {
    return {
        username,
        text,
        time: new Date()
    }
}

module.exports = {generateLocationMessage, generateMessage}