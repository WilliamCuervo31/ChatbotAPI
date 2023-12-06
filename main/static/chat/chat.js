const submitMessage = document.querySelector("#submitMessage");
const chat = document.querySelector(".left-chat-messages");
const inputChat = document.querySelector(".left-write-input");
const micro = document.querySelector(".left-chat-micro");

function resultToText(text) {
    let i = 0;
    let increment = 3;
    const typeWriter = () => {
        if (i < text.length) {
            for (let j = i; j < i + increment; j++) {
                inputChat.value += text.charAt(j);
            }
            i += increment;
            setTimeout(typeWriter, 150);
        } else {
            setTimeout(() => {
                sendMessage("message-user", inputChat.value);
            }, 100);
        }
    }

    typeWriter();
}

function startVoice(event, rec) {
    let textResult = event.results[0][0].transcript;
    rec.stop();
    resultToText(textResult);
}

function listen_write(){
    let rec;
    inputChat.value = "";

    if (!("webkitSpeechRecognition" in window)){
        alert("No puedes usar el microfono")
    } else {
        rec = new webkitSpeechRecognition();
        rec.lang = "es-CO";
        rec.continuous = true;
        rec.interim = true;
        rec.addEventListener("result", (e) => {
            startVoice(e, rec);
        })
        rec.start();
    }

    return;
}

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

function speak(text) {
    var voices = speechSynthesis.getVoices();
    var texto = new SpeechSynthesisUtterance(text);
    texto.voice = voices[4];
    speechSynthesis.speak(texto);
}

function sendJson(text) {
    let new_text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    fetch(`/chat/message/`, {
        method: 'POST', 
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
            'text': `${new_text}`,
        }),
    })
    .then(response => response.json())
    .then(data => {
        data
        sendMessage("message-ia", data.res);
        speak(data.res);
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

micro.addEventListener("click", listen_write);