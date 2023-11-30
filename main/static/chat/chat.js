const submitMessage = document.querySelector("#submitMessage");
const chat = document.querySelector(".left-chat-messages")
const inputChat = document.querySelector(".left-write-input")

function getCSRFToken() {
    // Obtiene el token CSRF de las cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('csrftoken=')) {
            return cookie.split('=')[1];
        }
    }
    return null;
}

function sendJson(text) {
    fetch(`/chat/message/`, {
        method: 'POST', 
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
            text
        }),
    })
    .then(response => response.json())
    .then(data => {
        data
        sendMessage("message-ia", data.res);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function sendMessage(type, message) {
    if (message.length <= 0) {
        return alert("Error: no se ha enviado nada");
    }

    li = document.createElement("li");
    li.setAttribute("class", type);
    span = document.createElement("span");
    span.innerHTML = message;
    li.append(span);
    chat.append(li);
    inputChat.value = "";
    chat.scrollTop = chat.scrollHeight; //Colocar barra abajo para ver mensaje

    if (type == "message-user") {
        return sendJson(message);
    }
}

submitMessage.addEventListener("click", () => {
    sendMessage("message-user", inputChat.value);
})

window.addEventListener("keypress", (e) => {
    if (e.shiftKey) {
        return
    }

    if (e.key == "Enter") {
        e.preventDefault();
        sendMessage("message-user", inputChat.value);
    }
})