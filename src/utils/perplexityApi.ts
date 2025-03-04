
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

export interface StockAnalysisResult {
  content: string;
}

export async function getStockAnalysis(
  stockSymbol: string,
  apiKey: string
): Promise<StockAnalysisResult> {
  try {
    if (!apiKey || !apiKey.trim()) {
      throw new Error("API key is required");
    }

    // Ensure API key is properly formatted
    const trimmedApiKey = apiKey.trim();
    
    const prompt = `Explain ${stockSymbol} recent price movements, news and analyst sentiments/ratings. Restrict your sources to The Wall Street Journal, Bloomberg, Financial Times, CNBC, Reuters, Barrons, The Economist, MarketWatch, Morningstar, NPR Marketplace, and Refinitiv. Do not include references in the format [1], [2], etc. Your output should NOT exceed 250 words.`;
    
    console.log("Making request to Perplexity API with key length:", trimmedApiKey.length);
    
    // Add credentials and mode to fetch options to handle CORS issues
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${trimmedApiKey}`,
        'Content-Type': 'application/json',
      },
      mode: 'cors', // Add explicit CORS mode
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant providing concise and accurate information about stocks. Restrict your sources to The Wall Street Journal, Bloomberg, Financial Times, CNBC, Reuters, Barrons, The Economist, MarketWatch, Morningstar, NPR Marketplace, and Refinitiv. Be concise. Do not include numbered references like [1], [2] in your response. Your output should NOT exceed 250 words.',
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
      const errorText = await response.text();
      console.error('Perplexity API error response:', response.status, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText || response.statusText}`);
    }

    const data: PerplexityResponse = await response.json();
    
    return {
      content: data.choices[0]?.message.content || 'No analysis available'
    };
  } catch (error) {
    console.error('Error fetching stock analysis:', error);
    
    // More detailed error message
    if (error instanceof Error) {
      // Check for common fetch errors
      if (error.message.includes('Failed to fetch')) {
        throw new Error(
          'Connection to Perplexity API failed. This could be due to network issues, CORS restrictions, or an invalid API key.'
        );
      }
      throw error;
    }
    throw new Error('Unknown error when fetching stock analysis');
  }
}
