const messagesContainer = document.querySelector("#messages");
const questionForm = document.querySelector("#question-form");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear-messages-button");
const API_URL = "http://localhost:3000";

console.log("app.js er forbundet");

function displayMessage(message) {
  if (message.type === "question") {
    const html = /*html*/ `
      <div class="qa">
        <article class="question">
          <p>${message.text}</p>
        </article>
      </div>
    `;

    messagesContainer.insertAdjacentHTML("beforeend", html);
  }

  if (message.type === "answer") {
    const lastQA = messagesContainer.lastElementChild;

    const html = /*html*/ `
      <article class="answer">
        <p>${message.text}</p>
      </article>
    `;

    lastQA.insertAdjacentHTML("beforeend", html);
  }
}

async function getMessages() {
  const response = await fetch(`${API_URL}/messages`);
  const messages = await response.json();

  for (const message of messages) {
    displayMessage(message);
  }
}

questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();

  displayMessage(data.question);
  displayMessage(data.answer);

  questionInput.value = "";
});

clearMessagesButton.addEventListener("click", async () => {
  await fetch(`${API_URL}/messages`, { method: "DELETE" });
});

getMessages();
