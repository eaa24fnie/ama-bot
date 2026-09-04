import express from "express";

const app = express();
const port = 3000;
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const names = [];

app.get("/", (request, response) => {
  response.render("index", { name: "", age: "", error: "", names });
});

app.post("/submit", (request, response) => {
  const age = request.body.age;
  const name = request.body.name;

  let error = "";

  if (!name || name.trim() === "") {
    error = "Skriv dit navn, før du sender formularen.";
  } else if (!age || Number.isNaN(Number(age))) {
    error = "Skriv en alder som et tal.";
  } else if (
    !Number.isInteger(Number(age)) ||
    Number(age) < 1 ||
    Number(age) > 120
  ) {
    error = "Skriv en alder som et helt tal mellem 1 og 120.";
  } else {
    names.push(name);
  }

  response.render("index", { name, age, error, names });
});

app.listen(port, () => {
  console.log(`Serveren kører på http://localhost:${port}`);
});
