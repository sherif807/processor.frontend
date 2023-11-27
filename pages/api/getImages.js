// pages/api/getImages.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { query } = req.body;
        const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        const GOOGLE_CSE_ID = process.env.NEXT_PUBLIC_GOOGLE_CSE_ID;
  
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${GOOGLE_CSE_ID}&searchType=image&num=10&key=${GOOGLE_API_KEY}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
  
        res.status(200).json({ results: data.items });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while processing your request" });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  