// server.js
const express = require('express');
const cors = require('cors');
const fetch = global.fetch || require('node-fetch'); // Node 24 כבר יש fetch, זה רק לגיבוי

const app = express();
app.use(cors());
app.use(express.json());

const n8nWebhook = "https://wishgoods.app.n8n.cloud/webhook/30d53feb-9b53-4ce1-8d55-ff44eb12b108/chat";

app.get('/health', async (req, res) => {
  
    res.json({ message:"healthy" });

});

app.post('/chat', async (req, res) => {
  console.log("Incoming request body:", req.body);

  if (!req.body.chatInput) {
    return res.status(400).json({ error: "Missing chatInput field" });
  }

  try {
    const n8nResponse = await fetch(n8nWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatInput: req.body.chatInput,
        key: req.body.key || "default"
      })
    });

    const data = await n8nResponse.json();
    console.log("Response from n8n:", data);

    let botMessage = data.output.chatResponse || data.output.responseText || "הבוט לא הבין, אנא נסה שוב.";
    res.json({ chatResponse: botMessage });

  } catch (err) {
    console.error("Error reaching n8n:", err);
    res.status(500).json({ chatResponse: "התרחשה שגיאה בבוט." });
  }
});

app.listen(10000, () => console.log('Server running on http://localhost:10000'));
