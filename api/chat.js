// api/chat.js (Vercel Serverless Function)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
    }

    try {
        const { contents, generationConfig } = req.body;
      
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            console.error("Server Error: GEMINI_API_KEY is not set in environment variables.");
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, generationConfig })
        });

        const data = await googleResponse.json();
      
        if (!googleResponse.ok) {
            console.error("Google API Error:", data.error);
            return res.status(googleResponse.status).json({ error: data.error?.message || 'Error from Google API' });
        }
      
        return res.status(200).json(data);

    } catch (error) {
        console.error('Serverless Function Catch Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
          }
