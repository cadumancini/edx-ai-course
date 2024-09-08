const { OpenAI } = require('@langchain/openai');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: 'gpt-3.5-turbo'
});

const promptFunc = async (input) => {
  try {
    const res = await model.invoke(input);
    return res;
  }
  catch (err) {
    console.log(err);
    throw(err);
  }
};

// Endpoint to handle request
app.post('/ask', async (req, res) => {
  try {
    const userQuestion = req.body.question;

    if (!userQuestion) {
      return res.status(400).json({ error: 'Please provide a question in the request body.' });
    }

    const result = await promptFunc(text);
    res.json({ result });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});