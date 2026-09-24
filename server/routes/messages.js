import express from "express";
import { loadMessages, saveMessages } from "../data/messages.js";
import { findBestAnswer } from "../data/findBestAnswers.js";

const router = express.Router();

// POST
router.post("/", async (request, response) => {
  const messages = await loadMessages();
  const question = request.body.question.trim();

  if (!question) {
    response.json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  const message = {
    type: "question",
    text: question,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);

  const result = await findBestAnswer(question);
  const answerMessage = {
    type: "answer",
    text: result.answer,
    createdAt: new Date().toISOString(),
  };
  messages.push(answerMessage);

  await saveMessages(messages);

  response.json({ question: message, answer: answerMessage });
});

// GET
router.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.json(messages);
});

// DELETE
router.delete("/", async (request, response) => {
  await saveMessages([]);

  response.send();
});

export default router;
