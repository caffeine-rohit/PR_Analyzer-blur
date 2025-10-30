import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post('/api/summarize', async (req, res) => {
  console.log('\n🎯 Received summarize request');
  console.log('📦 Request body keys:', Object.keys(req.body));
  
  try {
    const { prData, files } = req.body;

    if (!prData) {
      return res.status(400).json({ 
        error: 'Missing prData in request body' 
      });
    }

    // Create detailed prompt
    const filesList = files?.slice(0, 10).map(f => f.filename).join(', ') || 'No files provided';
    
    const prompt = `Analyze this GitHub Pull Request and provide a brief analysis:

PR Title: ${prData.title}
PR Description: ${prData.body || 'No description provided'}
Repository: ${prData.repository || 'Unknown'}
Author: ${prData.author || 'Unknown'}
Files Changed: ${files?.length || 0} files
Lines Added: ${prData.additions || 0}
Lines Deleted: ${prData.deletions || 0}
Key Files: ${filesList}

Provide:
1. Short Summary (2-3 sentences max - what does this PR do?)
2. Technical Approach (1 sentence - how was it implemented?)
3. Business Impact (1 sentence - why does this matter?)

Keep it concise and professional.`;

    console.log('📡 Calling Groq API...');

    // Call Groq with CURRENT active model
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ Updated to current model
      messages: [
        { 
          role: "system", 
          content: "You are a senior software engineer reviewing pull requests. Be concise and technical." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const summary = completion.choices[0].message.content;
    
    console.log('✅ Summary generated successfully!');
    console.log('📝 Preview:', summary.substring(0, 100) + '...');

    res.json({ 
      summary: summary,
      success: true 
    });

  } catch (error) {
    console.error('❌ Error generating summary:', error.message);
    console.error('❌ Full error:', error);
    
    // Check for specific errors
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid Groq API key. Please check your .env file.',
        message: error.message 
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again in a moment.',
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.GROQ_API_KEY;
  console.log('🏥 Health check - Groq Key present:', hasKey);
  
  res.json({ 
    status: 'ok', 
    hasApiKey: hasKey,
    keyPrefix: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 7) + '...' : 'MISSING',
    provider: 'Groq (Free & Fast)',
    model: 'llama-3.3-70b-versatile'
  });
});

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 PR Analyzer Backend Server');
  console.log('='.repeat(50));
  console.log('✅ Server running on http://localhost:' + PORT);
  console.log('🔑 Groq Key configured:', !!process.env.GROQ_API_KEY ? 'YES ✓' : 'NO ✗');
  if (process.env.GROQ_API_KEY) {
    console.log('🔑 Key prefix:', process.env.GROQ_API_KEY.substring(0, 7) + '...');
  }
  console.log('⚡ Using: Groq API (FREE) - Llama 3.3 70B');
  console.log('='.repeat(50) + '\n');
});