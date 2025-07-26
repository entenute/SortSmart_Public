const messages = [];
console.log("It is starting");
        function addMessage(msg, isUser) {
            const messagesDiv = document.getElementById("messages");
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");
            if (isUser) {
                messageDiv.classList.add("user-message");
            }
            messageDiv.textContent = msg;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

       function sendMessage() {
    const input = document.getElementById("input-message");
    const message = input.value.trim();
    if (message) {
        addMessage(message, true);
        input.value = '';
        messages.push({ content: message, role: 'user' });

        // Loader-Nachricht einfügen
        const messagesDiv = document.getElementById("messages");
        const loaderDiv = document.createElement("div");
        loaderDiv.classList.add("message", "loader-message");
        loaderDiv.innerHTML = `
            <div class="ai_loader_div">
                <div class="spinner"></div>
                <h3 class="ai_loader_text">AI</h3>
            </div>
        `;
        messagesDiv.appendChild(loaderDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // AI antwortet
        puter.ai.chat(messages).then(response => {
            // Loader entfernen
            loaderDiv.remove();

            // AI Nachricht anzeigen
            addMessage(response, false);
            messages.push(response.message);
        }).catch(error => {
            // Fasl es nicht funktioniert Nutzer sagen
            message.push("Something went wrong. Please try again.")
            console.error("AI response error:", error);
            
            loaderDiv.remove();
        });
    }
}