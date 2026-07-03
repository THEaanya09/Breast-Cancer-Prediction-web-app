const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// voice API
app.post("/speak", async (req, res) => {
  const { text } = req.body;

  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en-IN&client=tw-ob`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    res.set({
      "Content-Type": "audio/mpeg",
    });

    res.send(response.data);
  } catch (err) {
    res.status(500).send("Error generating audio");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});