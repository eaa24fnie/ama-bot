import express from "express";

const app = express();
const port = 3000;

const answers = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answers: [
      "Jeg hedder Frederik. Hvad vil du ellers vide om mig?",
      "Pretty boy F",
    ],
  },
  {
    keywords: ["bor", "by", "fra"],
    answers: ["Jeg bor i Aarhus.", "Jeg bor i nuet"],
  },
  {
    keywords: ["fritid", "hobby", "kan lide"],
    answers: ["Hvad rager det dig?", "se film i guess?"],
  },
];

function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) =>
      normalizedQuestion.includes(keyword),
    );

    if (hasMatch) {
      const randomIndex = Math.floor(
        Math.random() * answerGroup.answers.length,
      );
      return answerGroup.answers[randomIndex];
    }
  }

  return "Det kender jeg ikke svaret på endnu.";
}

function sanitizeQuestion(input) {
  return input.replace(/[\u0000-\u001F\u007F]/g, "");
}

const messages = [];

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.post("/clear-messages", (req, res) => {
  messages.length = 0;
  res.redirect("/");
});

app.post("/ask", (req, res) => {
  const rawQuestion = req.body.question;
  const question = sanitizeQuestion(rawQuestion).trim();
  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else if (question.length > 280) {
    error = "Spørgsmålet er for langt. Hold det under 280 tegn.";
  } else {
    messages.push({ type: "question", text: question, createdAt: new Date() });
    const answer = findAnswer(question);
    messages.push({ type: "answer", text: answer, createdAt: new Date() });
  }

  res.render("index", { messages, error });
});

app.get("/", (req, res) => {
  res.render("index", { messages, error: "" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
