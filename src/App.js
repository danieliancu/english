import React, { useState } from 'react';
import OpenAI from 'openai';
import './index.css';



const openai = new OpenAI({
  apiKey: process.env.REACT_APP_CODE
});

function ChatAssistant() {
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function generateText() {
    setIsLoading(true);
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "genereaza un text scurt in românește, cheltuie maximum 100 de tokens. Genereaza doar textul, fara alta introducere. Textul TREBUIE finalizat întodeauna cu punct! NU întrerupe fraza la mijloc, finalizeaz-o în cadrul acestor 100 tokens!" }],
            model: "gpt-3.5-turbo",
            max_tokens: 100 // Adjust this value as needed
        });
        setOriginalText(completion.choices[0].message.content);
        setTranslatedText(''); // Reset the translation textarea
    } catch (error) {
        console.error('Error generating text:', error);
        setOriginalText('Failed to generate text, check the console for more information.');
    }
    setIsLoading(false);
}


async function fetchResponse() {
  if (!translatedText) return; // Ensure there's translated text to check
  setIsLoading(true);
  try {
      const completion = await openai.chat.completions.create({
          messages: [
            {
              "role": "system",
              "content": "Act as an ultra-exacting English teacher focused on British English. Review any text with utmost care, concentrating on tenses, British expressions, grammar, and sentence structure to align strictly with British norms, ignoring the original Romanian structure. After identifying errors, generate an HTML table with each row styled with a border of 1px solid black and 10px padding. The header should have a black background with white text. The table should not include any introductory text and must list the type of error (vocabulary, grammar, expression, sentence structure) in the left column wrapped in <strong> tags, with a detailed correction and explanation on the right. The wrong words or phrases write them in red (<span style='color:red;font-weight:bold;'></span>) Conclude with the rewritten text, followed by an HTML <hr /> and a <strong>Grade:</strong> on a scale from 1 to 10, based on the accuracy of the original translation. Clearly identify each incorrect word or expression in the table and provide explanations. Delete ```html and ``` signs"
            },
            { role: "user", content: translatedText }
          ],
          model: "gpt-4-1106-preview",
          max_tokens: 1000 // Adjust this value based on your needs for feedback length
      });
      setResponse(completion.choices[0].message.content);
  } catch (error) {
      console.error('Failed to fetch data:', error);
      setResponse('Failed to load response, check the console for more information.');
  }
  setIsLoading(false);
}


  return (
    <div className="p-5">
      <hr className="my-4" />
      <h1 className="text-2xl font-bold text-center mb-4">English Teacher Assistant</h1>
      <div className="flex flex-col items-center">
        <button
          onClick={generateText}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Start
        </button>
        {originalText && (
          <>
            <div className="mb-2 p-6 border border-gray-300 rounded-lg w-full max-w-xl h-auto whitespace-pre-wrap">
              {originalText}
            </div>
            <textarea
              value={translatedText}
              onChange={e => setTranslatedText(e.target.value)}
              placeholder="Translate to English..."
              className="mb-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xl h-48"
            />
            <button
              onClick={fetchResponse}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </>
        )}
        <div style={{ maxWidth: '800px' }} className="bg-gray-100 p-5 mt-4 w-full">
          <p>{isLoading ? "Wait..." : ""}</p>
          <div className="text-gray-700 whitespace-pre-wrap"
               dangerouslySetInnerHTML={{ __html: !isLoading ? response : '' }}>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatAssistant;