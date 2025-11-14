import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // if you need fetch, Node v18+ has global fetch

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        listIds: [2], // your Brevo list ID
        updateEnabled: true,
      }),
    });

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
