const messageOne = document.querySelector('#messageOne');
const messageTwo = document.querySelector('#messageTwo');
const messageForm = document.querySelector('form')

const socket = io()

socket.on('welcome', (msg) => {
    messageOne.textContent = msg;
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.inputMessage.value;
    socket.emit('sendMessage', message)

})

socket.on('receiveMessage', (msg) => {
    messageOne.textContent = 'New Message: ';
    messageTwo.textContent = msg;
})

document.querySelector('#locationButton').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Your browser does not support this feature.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log('sending Location: ', position.coords);

        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            alt: position.coords.longitude
        }, (returnedMessage) => {
            console.log(`server response : ${returnedMessage}`);
        })
    })
})

socket.on('locationMessage', (position) => {
    console.log('received location:', position);
})