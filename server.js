import express from "express";
import fs from "node:fs/promises";

const app = express();
const port = 3000;

const answers = [
  {
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Frederik.",
  },
  {
    category: "by",
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor i Aarhus.",
  },
  {
    category: "fritid",
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "Jeg kan godt lide at se film.",
  },
];

function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) =>
    normalizedQuestion.includes(keyword),
  );

  return matches.length;
}

function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  let bestScore = 0;
  let bestAnswer = "Det kender jeg ikke svaret på endnu.";
  let bestCategory = "";

  for (const answerGroup of answers) {
    const score = countMatches(answerGroup.keywords, normalizedQuestion);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answerGroup.answer;
      bestCategory = answerGroup.category;
    }
  }

  return {
    answer: bestAnswer,
    category: bestCategory,
  };
}

async function loadMessages() {
  // TODO: Læs data/messages.json med fs.readFile() ("utf8").
  const data = await fs.readFile("./data/messages.json", "utf8");
  // TODO: Parse JSON-teksten til et array, og returnér det.
  return JSON.parse(data);
}

async function saveMessages(messages) {
  // TODO: Omdan messages til formateret JSON-tekst med JSON.stringify().
  const json = JSON.stringify(messages, null, 2);
  // TODO: Skriv teksten til data/messages.json med fs.writeFile().
  await fs.writeFile("./data/messages.json", json);
}

const topicStats = {
  navn: 0,
  by: 0,
  fritid: 0,
};

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.post("/clear-messages", async (req, res) => {
  await saveMessages([]);
  res.redirect("/");
});

app.post("/ask", async (request, response) => {
  const messages = await loadMessages();

  const question = request.body.question.trim();
  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else {
    messages.push({ type: "question", text: question });

    const result = findBestAnswer(question);
    messages.push({ type: "answer", text: result.answer });

    if (result.category) {
      topicStats[result.category] = topicStats[result.category] + 1;
    }
  }

  await saveMessages(messages);

  response.render("index", { messages, error, topicStats });
});

app.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.render("index", { messages, error: "", topicStats });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
