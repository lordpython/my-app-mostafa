"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnswer = exports.generateQuestion = void 0;
const https_1 = require("firebase-functions/v2/https");
const openai_1 = require("openai");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
exports.generateQuestion = (0, https_1.onCall)(async (request) => {
    const { categoryName, difficulty, language } = request.data;
    try {
        const completion = await openai.chat.completions.create({
            messages: [{
                    role: "system",
                    content: `Generate a trivia question with:
          Category: ${categoryName}
          Difficulty: ${difficulty}
          Language: ${language || "Arabic"}`,
                }],
            model: "gpt-4",
            response_format: { type: "json_object" },
        });
        return JSON.parse(completion.choices[0].message.content || "{}");
    }
    catch (error) {
        console.error("Error generating question:", error);
        throw new Error("Failed to generate question");
    }
});
exports.validateAnswer = (0, https_1.onCall)(async (request) => {
    const { question, correctAnswer, userAnswer, language } = request.data;
    try {
        const completion = await openai.chat.completions.create({
            messages: [{
                    role: "system",
                    content: `Compare these answers for the question: "${question}"
          Correct answer: "${correctAnswer}"
          User's answer: "${userAnswer}"
          
          Evaluate in ${language || "Arabic"} and return as JSON with:
          - isCorrect (boolean)
          - feedback (string)
          - similarity (number between 0 and 1)`,
                }],
            model: "gpt-4",
            response_format: { type: "json_object" },
        });
        return JSON.parse(completion.choices[0].message.content || "{}");
    }
    catch (error) {
        console.error("Error validating answer:", error);
        throw new Error("Failed to validate answer");
    }
});
//# sourceMappingURL=index.js.map