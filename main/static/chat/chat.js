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
                sendMessage("message-user", inputChat.value, false);
            }, 100);
        }
    }

    typeWriter();
}

function startVoice(event, rec) {
    let textResult = event.results[0][0].transcript;
    rec.stop();
    micro.style.cssText = `
        background-color: var(--secondary-color);
        box-shadow: 0 0 1.5rem 0.4rem transparent;
    `;
    resultToText(textResult);
}

function listen_write(){
    let rec;
    inputChat.value = "";
    micro.style.cssText = `
        background-color: var(--primary-color);
        box-shadow: 0 0 1.5rem 0.4rem var(--secondary-color);
    `;

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
    texto.lang = "es-CO";
    speechSynthesis.speak(texto);
    return;
}

function sendJson(text) {
    if (text.length <= 0) {
        return alert("Error: no se ha enviado nada");
    }

    let new_text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    let li = document.createElement("li");
    li.setAttribute("class", "message-ia");
    li.style.width = "fit-content";
    let div = document.createElement("div");
    div.setAttribute("class", "loader");
    li.append(div);
    chat.append(li);
    chat.scrollTop = chat.scrollHeight;

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
        sendMessage("message-ia", data.res, li);
        speak(data.res);
    })
    .catch(error => {
        sendMessage("message-ia", "Ha ocurrido un error", li);
        console.error('Error:', error);
    });
}

function sendMessage(type, message, li) {
    if (li != false) {
        li.remove();
    }

    li = document.createElement("li");
    li.setAttribute("class", type);
    span = document.createElement("span");
    span.innerHTML = message;
    li.append(span);
    chat.append(li);
    inputChat.value = "";
    chat.scrollTop = chat.scrollHeight;

    if (type == "message-user") {
        return sendJson(message);
    }
}

submitMessage.addEventListener("click", () => {
    sendMessage("message-user", inputChat.value, false);
})

window.addEventListener("keypress", (e) => {
    if (e.shiftKey) {
        return
    }

    if (e.key == "Enter") {
        e.preventDefault();
        sendMessage("message-user", inputChat.value, false);
    }
})

micro.addEventListener("click", listen_write);