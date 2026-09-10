import express from "express";

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

const messages = [];

const topicStats = {
  navn: 0,
  by: 0,
  fritid: 0,
};

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.post("/clear-messages", (req, res) => {
  messages.length = 0;
  res.redirect("/");
});

app.post("/ask", (request, response) => {
  const question = request.body.question.trim();
  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else {
    messages.push({ type: "question", text: question, createdAt: new Date() });

    const result = findBestAnswer(question);
    messages.push({
      type: "answer",
      text: result.answer,
      createdAt: new Date(),
    });

    if (result.category) {
      topicStats[result.category] = topicStats[result.category] + 1;
    }
  }

  response.render("index", { messages, error, topicStats });
});

app.get("/", (req, res) => {
  res.render("index", {
    messages,
    error: "",
    topicStats,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
