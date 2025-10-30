import { PRData, FileData } from './githubAPI';

interface AISummary {
  shortSummary: string;
  technicalSummary: string;
  businessImpact: string;
}

export const generateAISummary = async (
  prData: PRData, 
  files: FileData[]
): Promise<AISummary> => {
  console.log('🚀 Starting AI Summary Generation...');
  console.log('📊 PR Data:', { 
    title: prData.title, 
    files: files.length,
    author: prData.author 
  });
  
  try {
    console.log('📡 Calling backend at http://localhost:3001/api/summarize');
    
    // Call backend proxy server
    const response = await fetch('http://localhost:3001/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prData: prData,
        files: files
      })
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error Response:', errorData);
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Response received');
    
    const content = data.summary;
    console.log('📝 Generated content:', content);

    // Parse the response into structured sections
    const lines = content.split('\n').filter((line: string) => line.trim());
    
    const result = {
      shortSummary: lines.find((l: string) => 
        l.includes('Summary') || l.includes('1.')
      )?.replace(/^.*?:\s*/, '').replace(/^\d+\.\s*/, '') || lines[0] || content,
      
      technicalSummary: lines.find((l: string) => 
        l.includes('Technical') || l.includes('Approach') || l.includes('2.')
      )?.replace(/^.*?:\s*/, '').replace(/^\d+\.\s*/, '') || lines[1] || 'Technical details analyzed.',
      
      businessImpact: lines.find((l: string) => 
        l.includes('Impact') || l.includes('Business') || l.includes('3.')
      )?.replace(/^.*?:\s*/, '').replace(/^\d+\.\s*/, '') || lines[2] || 'Improves codebase quality.'
    };
    
    console.log('✨ Parsed result:', result);
    return result;
    
  } catch (error) {
    console.error('❌ AI Summary Error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error)
    });
    
    // Fallback: Create basic summary from PR data
    return {
      shortSummary: `This PR "${prData.title}" by ${prData.author} modifies ${files.length} files with ${prData.additions} additions and ${prData.deletions} deletions in ${prData.repository}.`,
      technicalSummary: "⚠️ AI analysis temporarily unavailable. Check your OpenAI API key and server connection.",
      businessImpact: "Manual review recommended for detailed impact assessment."
    };
  }
};