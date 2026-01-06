const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const n8nWebhook = "https://wishgoods.app.n8n.cloud/webhook/30d53feb-9b53-4ce1-8d55-ff44eb12b108/chat";

app.post('/chat', async (req, res) => {
  try {
    const response = await fetch(n8nWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reach n8n' });
  }
});

app.listen(10000, () => console.log('Server running on http://localhost:10000'));
