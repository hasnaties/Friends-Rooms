const socket = io()
//const moment = moment()

// -- HTML_Elements --
const messageForm = document.querySelector('form')
const $locationButton = messageForm.querySelector('#locationButton')
const $messageHtml = document.querySelector('#message-html')
const $inputMessage = messageForm.querySelector('#inputMessage')
// -- Templates --
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebarTemplate').innerHTML

// -- Parsing Query --
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true})

// -- Auto scroll
const autoScroll = () => {

    //  New message element
    const $newMessage = $messageHtml.lastElementChild

    // 1. Access element styles
    const newMessageStyles = getComputedStyle($newMessage)
    // 2. Element bottom-margin in numbers
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    // 3. final height of the element
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible Height
    const visibleHeight = $messageHtml.offsetHeight;
    // Height of messages-html container
    const containerHeight = $messageHtml.scrollHeight;
    // How far someone scrolled?
    const scrollOffset = $messageHtml.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messageHtml.scrollTop = $messageHtml.scrollHeight;
    }

}
socket.on('welcome', (msg) => {
    const renderMessage = Mustache.render(messageTemplate, {
        message: msg.text,
        time: moment(msg.time).format('LT')
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
        username: msg.username,
        message: msg.text,
        time: moment(msg.time).format('LT')
    })

    $messageHtml.insertAdjacentHTML('beforeend', renderMessage)
    autoScroll();
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

    const renderMessage = Mustache.render(locationTemplate, {
        username: url.username,
        location: url.text,
        time: moment(url.time).format('LT')
    })

    $messageHtml.insertAdjacentHTML('beforeend', renderMessage)
    autoScroll();
})

socket.emit('join', { username, room }, (error) => {

    if (error) {
        alert(error);
        location.href = '/';
    }
})

socket.on('roomList', ({room, users}) => {

    const renderList = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = renderList
})