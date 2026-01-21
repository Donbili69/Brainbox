const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public')); // This serves your frontend files

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const lowerMessage = userMessage.toLowerCase();
        
        // CHECK FOR IMAGE REQUEST
        if (lowerMessage.includes("draw") || lowerMessage.includes("generate image") || lowerMessage.includes("picture of")) {
            const imageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: userMessage,
                n: 1,
                size: "1024x1024",
            });
            return res.json({ reply: imageResponse.data[0].url, type: 'image' });
        }

        // OTHERWISE, TEXT RESPONSE (GPT-4o)
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are Brainbox, a helpful and professional AI assistant with real-time knowledge." },
                { role: "user", content: userMessage }
            ],
        });

        res.json({ reply: chatCompletion.choices[0].message.content, type: 'text' });

    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ reply: "I ran into an error. Please check your API key/credits." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`));