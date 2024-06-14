import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();

app.use(bodyParser.json());

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  const url = 'https://us17.api.mailchimp.com/3.0/lists/8fd7cf4e0d/members/';
  const apiKey = 'd959c77ebf70bd1824b44bfd722a1f3f-us17';
  const data = {
    email_address: email,
    status: 'subscribed'
  };
  const base64ApiKey = Buffer.from(`anystring:${apiKey}`).toString('base64');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64ApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      res.status(200).json({ message: 'Subscription successful' });
    } else {
      res.status(response.status).json({ message: result.detail });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
