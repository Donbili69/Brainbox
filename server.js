const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    const input = message.toLowerCase();

    // 1. DYNAMIC IMAGE LOGIC
    if (input.includes("draw") || input.includes("image") || input.includes("picture")) {
        const subject = input.replace("draw", "").replace("image", "").replace("a", "").trim();
        const imageUrl = `https://loremflickr.com/800/600/${subject || 'robot'}`;
        res.json({ type: 'image', content: imageUrl });
    }

    // 2. BASIC MATH SOLVER (No API needed!)
    else if (/\d+[\+\-\*\/]\d+/.test(input)) {
        try {
            // This safely calculates simple math like 5+5 or 10*2
            const equation = input.match(/\d+[\+\-\*\/]\d+/)[0];
            const result = eval(equation);
            res.json({ type: 'text', content: `📊 Math Result: The answer to ${equation} is **${result}**.` });
        } catch (e) {
            res.json({ type: 'text', content: "I see a math problem, but it's a bit too complex for my offline mode!" });
        }
    }

    // 3. MOCK CODING LOGIC
    else if (input.includes("code") || input.includes("function") || input.includes("javascript")) {
        res.json({ type: 'text', content: "Here is a code snippet for you:\n\n```javascript\nfunction greetUser() {\n  console.log('Hello! I am your AI assistant.');\n}\n```" });
    }

    // 4. SCIENCE / GENERAL LOGIC
    else if (input.includes("science") || input.includes("gravity") || input.includes("planet")) {
        res.json({ type: 'text', content: "🚀 Science Fact: Did you know that light travels at approximately 299,792,458 meters per second?" });
    }

    // 5. DEFAULT RESPONSE
    else {
        res.json({ type: 'text', content: `I received your message: "${message}". I'm currently running in offline demonstration mode. Try asking me for 'Math', 'Code', or to 'Draw a cat'!` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 BRAINBOX RUNNING ON PORT ${PORT}`);
});