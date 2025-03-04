
interface PerplexityResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  created: number;
  model: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export async function getStockAnalysis(
  stockSymbol: string,
  apiKey: string
): Promise<string> {
  try {
    const prompt = `Explain ${stockSymbol} recent price movements, news and analyst sentiments/ratings. Format your response using Markdown with headers, lists, and emphasis where appropriate.`;
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant providing concise and accurate information about stocks. Format your response using proper Markdown with headers, bullet points, and emphasis where appropriate.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data: PerplexityResponse = await response.json();
    return data.choices[0]?.message.content || 'No analysis available';
  } catch (error) {
    console.error('Error fetching stock analysis:', error);
    throw error;
  }
}
