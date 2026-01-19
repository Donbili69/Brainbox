const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    const input = message.toLowerCase();

    // 1. Image Logic
    if (input.includes("draw") || input.includes("image") || input.includes("picture")) {
        const subject = input.replace(/draw|image|picture|a|an/g, "").trim();
        const imageUrl = `https://loremflickr.com/800/600/${subject || 'robot'}`;
        return res.json({ type: 'image', content: imageUrl });
    } 

    // 2. Math Logic
    const mathMatch = input.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
    if (mathMatch) {
        const num1 = parseFloat(mathMatch[1]);
        const op = mathMatch[2];
        const num2 = parseFloat(mathMatch[3]);
        let result = 0;
        if (op === '+') result = num1 + num2;
        if (op === '-') result = num1 - num2;
        if (op === '*') result = num1 * num2;
        if (op === '/') result = num1 / num2;
        return res.json({ type: 'text', content: `📊 The answer is **${result}**.` });
    }

    // 3. Default Response
    res.json({ type: 'text', content: `I heard: "${message}". I can solve math (e.g., 5 + 5) or draw images (e.g., 'draw a space city')!` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));