const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

function addMessage(role, content, type = 'text') {
    const div = document.createElement('div');
    div.classList.add('message', `${role}-message`);

    if (type === 'image') {
        div.innerHTML = `<img src="${content}" alt="AI Image" />`;
    } else {
        div.textContent = content;
    }

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value;
    addMessage('user', message);
    userInput.value = '';

    // Temporary "Loading" state
    const loading = document.createElement('div');
    loading.classList.add('message', 'ai-message');
    loading.textContent = '...';
    chatBox.appendChild(loading);

    try {
        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await res.json();
        chatBox.removeChild(loading);
        addMessage('ai', data.reply, data.type);
    } catch (err) {
        loading.textContent = 'Connection error.';
    }
});