import express from 'express';
import { openai } from '../lib/openai.js'

const app = express();
app.use(express.json());

app.get("/", function(req, res) {
    res.send("Hello")
})

app.get('/generate-question', async (req, res) => {
    //const { level, topic } = req.body;
    const level = "easy";
    const topic = "javascript"
    //const promptMessage = `Generate a ${level} level question about ${topic}. Provide four options and indicate the correct answer.`;
    //const prompt = `Generate a ${level} level question about ${topic}. Provide four options and indicate the correct answer. Make sure the question is clear and the answer choices are grammatically correct and relevant to the question. Don't include unnecessary prompts like "Options:.`;
    const prompt =
        `Generate a ${level} level question about ${topic}.
        Provide four options and indicate the correct answer using the following template:
        Question: question
        Options: 
        a) choice 1 
        b) choice 2
        c) choice 3
        d) choice 4
        Correct answer: correct answer`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [
                { 
                    role: 'user',
                    content: prompt 
                },
            ],
            max_tokens: 250, // check it out
        })

        console.log(response);
        const generatedText = response.choices[0].message.content.trim();
        console.log(generatedText);

        // Parse the generated text to a structured JSON format (pseudo code)
        const questionData = parseGeneratedText(generatedText);
        res.json(questionData);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error generating question');
    }
});

function parseGeneratedText(text) {
    
    // Extract question, options, and answer from generated text
    const lines = text.split("\n");
    const questionLine = lines.find(line => line.startsWith("Question: "));
    const optionsLines = lines.filter(line => line.startsWith("a) ") || line.startsWith("b) ") || line.startsWith("c) ") || line.startsWith("d) "));
    const answerLine = lines.find(line => line.startsWith("Correct answer: "));

    // Parse extracted data
    const question = questionLine ? questionLine.slice(10).trim() : null;
    const options = optionsLines.map(line => line.slice(3).trim());
    const correctAnswer = answerLine ? answerLine.slice(17).trim() : null;

    // Return structured data in JSON format
    return {
        question,
        options,
        correctAnswer,
    };
}

console.log(parseGeneratedText)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server running on port : http://localhost:${PORT}`);
})