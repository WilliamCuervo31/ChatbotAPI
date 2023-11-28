const submitMessage = document.querySelector("#submitMessage");
const chat = document.querySelector(".left-chat-messages")
const inputChat = document.querySelector(".left-write-input")

function sendMessage() {
    message = inputChat.value;
    li = document.createElement("li");
    li.setAttribute("class", "message-user");
    span = document.createElement("span");
    span.innerHTML = message;
    li.append(span);
    chat.append(li);
    inputChat.value = "";
}

function scrollChatDown() {
    chat.scrollTop = chat.scrollHeight;
}

window.addEventListener("keypress", (e) => {
    if (e.shiftKey) {
        return
    }

    if (e.key == "Enter") {
        e.preventDefault();
        submitMessage.click();
        sendMessage();
        scrollChatDown();
    }
})