const socket = io()

// -- HTML_Elements --
const messageForm = document.querySelector('form')
const $locationButton = messageForm.querySelector('#locationButton')
const $messageHtml = document.querySelector('#message-html')
const $inputMessage = messageForm.querySelector('#inputMessage')
// -- Templates --
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('welcome', (msg) => {
    const renderMessage = Mustache.render(messageTemplate, {
        message: msg
    })
    $messageHtml.insertAdjacentHTML('beforeend', renderMessage)
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.inputMessage.value;
    socket.emit('sendMessage', message)
    $inputMessage.value='';

})

socket.on('receiveMessage', (msg) => {

    const renderMessage = Mustache.render(messageTemplate, {
        message: msg
    })
    $messageHtml.insertAdjacentHTML('beforeend', renderMessage)
})

$locationButton.addEventListener('click', () => {

    $locationButton.setAttribute('disabled', 'disabled');

    if (!navigator.geolocation) {
        return alert('Your browser does not support this feature.')
    }

    navigator.geolocation.getCurrentPosition((position) => {

        const url = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
        
        socket.emit('sendLocation', url, (returnedMessage) => {
            console.log(`server response : ${returnedMessage}`);
            $locationButton.removeAttribute('disabled')
        })
    })
})

socket.on('locationMessage', (url) => {
    console.log('received location:', url);
    const renderMessage = Mustache.render(locationTemplate, {
        location: url
    })
    $messageHtml.insertAdjacentHTML('beforeend', renderMessage)
})