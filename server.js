import express from "express";

const app = express();
const port = 3000;

const answers = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Frederik. Hvad vil du ellers vide om mig?",
  },
  {
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor i Aarhus.",
  },
  {
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "Hvad rager det dig?",
  },
];

function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) =>
      normalizedQuestion.includes(keyword),
    );

    if (hasMatch) {
      return answerGroup.answer;
    }
  }

  return "Det kender jeg ikke svaret på endnu.";
}

const messages = [];

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.post("/ask", (req, res) => {
  const question = req.body.question.trim();
  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else {
    messages.push({ type: "question", text: question });
    const answer = findAnswer(question);
    messages.push({ type: "answer", text: answer });
  }

  res.render("index", { messages, error });
});

app.get("/", (req, res) => {
  res.render("index", { messages, error: "" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
