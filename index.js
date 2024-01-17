const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

const apiKey = process.env.API_KEY; //  clé API SendinBlue dans .env

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

app.post("/process-form", async (req, res) => {
  const { nom, prenom, email, message } = req.body;

  const emailData = {
    sender: {
      name: `${nom} ${prenom}`,
      email: email,
    },
    to: [
      {
        email: "guillaumegemelas@gmail.com",
        name: `Guillaume GEMELAS`,
      },
    ],
    subject: "Formulaire de contact",
    htmlContent: `<html><head></head><body><p>Hello,</p><p>Nom: ${nom}</p><p>Prénom: ${prenom}</p><p>Email: ${email}</p><p>Message: ${message}</p></body></html>`,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    console.log("Message envoyé:", responseData);
    res.json({ message: "Message envoyé avec succès!" });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Serveur started 😀");
});
