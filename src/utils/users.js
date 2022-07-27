const users = [];

// -- Add a user --
const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required.'
        }
    }
    // check if existing data
    const existingUser = users.find((user) => {
        return user.username === username && user.room === room
    })
    // if username already taken
    if (existingUser) {
        return {
            error: 'Username is in use.'
        }
    }

    // store and return the user
    const user = { id, username, room }
    users.push(user)
    return {user}
}

// -- Remove User --
const removeUser = (id) => {
    const user = users.findIndex((user) => {
        return user.id === id
    })

    if (user !== -1) {
        return users.splice( index, 1 )[0]
    }
}

// -- Get User --
const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}

// -- Get users in room --
const getUsersInRoom = ( room ) => {
    
    room = room.trim().toLowerCase();
    return users.filter((user) => {
        return room === user.room
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}