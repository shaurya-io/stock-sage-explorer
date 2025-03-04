
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
  citations?: string[]; // Added citations field which may exist in the response
}

export interface StockAnalysisResult {
  content: string;
  references: string[];
}

export async function getStockAnalysis(
  stockSymbol: string,
  apiKey: string
): Promise<StockAnalysisResult> {
  try {
    const prompt = `Explain ${stockSymbol} recent price movements, news and analyst sentiments/ratings.`;
    
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
            content: 'You are a helpful assistant providing concise and accurate information about stocks. Restrict your sources to The Wall Street Journal, Bloomberg, Financial Times, CNBC, Reuters, Barrons, The Economist, MarketWatch, Morningstar, NPR Marketplace, and Refinitiv. Be concise.'
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
    
    return {
      content: data.choices[0]?.message.content || 'No analysis available',
      references: data.citations || []
    };
  } catch (error) {
    console.error('Error fetching stock analysis:', error);
    throw error;
  }
}
