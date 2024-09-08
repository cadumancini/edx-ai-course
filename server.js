const { OpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
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

const prompt = new PromptTemplate({
  template: "You are a programming expert and will answer the user's coding question as thoroughly as possible using JavaScript. If the question is unrelated to coding, do not answer. \n{question}",
  inputVariables: ['question']
});

const promptFunc = async (input) => {
  try {
    // Format the prompt with the user input
    const promptInput = await prompt.format({
      question: input
    });

    const res = await model.invoke(promptInput);
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

    const result = await promptFunc(userQuestion);
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