
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

const loadingText = ['.','..','...'];
let loadingIndex = 0;
let loadingInterval;
let waiting = false;

let thread_id = null;


function startLoading(loadingDiv) {
    loadingInterval = setInterval(() => {
        loadingDiv.textContent = loadingText[loadingIndex];
        loadingIndex = (loadingIndex + 1) % loadingText.length;
    }, 500);
}

function stopLoading() {
    clearInterval(loadingInterval);
    loadingIndex = 0;
}

async function sendPrompt() {
    const prompt = userInput.value;
    console.log(prompt);

    // First prompt
    if (thread_id === null) {
        const data = {message: prompt};
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        userInput.value = '';

        const logs = document.getElementById('logList');
        const newDiv = document.createElement('div');
        newDiv.textContent = prompt.slice(0,40) + "...";
        newDiv.className = "logRecord"
        logs.appendChild(newDiv);

        const reply = await fetch('https://prod-ai-ymegrqflxq-lm.a.run.app/startThread', options);
        const replyData = await reply.json();
        thread_id = replyData.tid
        return {tid: replyData.tid, text: replyData.response};
    }
    else{
        const data = {message: prompt, tid: thread_id};
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        userInput.value = '';
        const reply = await fetch('https://prod-ai-ymegrqflxq-lm.a.run.app/messageInThread', options);
        const replyData = await reply.json();
        return {text: replyData.response};
    }
}

function scrollToBottom() {
    let chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessageAndUpdateChat(){
    if (waiting)
        return;
    waiting = true;
    const chatArea = document.getElementById('chatArea');

    // Showing sent prompt
    const outerPromptDiv = document.createElement('div');
    const innerPromptDiv = document.createElement('div');

    innerPromptDiv.textContent = userInput.value;
    innerPromptDiv.className = "innerPromptDiv";
    outerPromptDiv.className = "outerPromptDiv";


    outerPromptDiv.appendChild(innerPromptDiv);
    chatArea.appendChild(outerPromptDiv);


    const outerResponseDiv = document.createElement('div');
    const innerResponseDiv = document.createElement('div');

    innerResponseDiv.textContent = '';
    innerResponseDiv.className = "innerResponseDiv";
    outerResponseDiv.className = "outerResponseDiv";

    outerResponseDiv.appendChild(innerResponseDiv);
    chatArea.appendChild(outerResponseDiv);
    scrollToBottom();

    startLoading(innerResponseDiv);

    const res = await sendPrompt();

    stopLoading();
    innerResponseDiv.innerHTML = res.text;
    waiting = false;
}

sendButton.addEventListener('click',  (e) => {
    if (userInput.value !== ''){
        sendMessageAndUpdateChat();
    }
})

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (userInput.value !== ''){
            sendMessageAndUpdateChat();
        }
    }
})



