const messageOne = document.querySelector('#messageOne');
const messageTwo = document.querySelector('#messageTwo');
const messageForm = document.querySelector('form')

const socket = io()
socket.on('welcome', (msg) => {
    messageOne.textContent = msg;
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = document.querySelector('input').value
    socket.emit('sendMessage', message)

})

socket.on('receiveMessage', (msg) => {
    messageOne.textContent = 'New Message: ';
    messageTwo.textContent = msg;
})