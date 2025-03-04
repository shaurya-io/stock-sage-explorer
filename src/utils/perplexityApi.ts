
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

// Function to clean the response text by removing <think> tags and their content
function cleanResponseText(text: string): string {
  // Remove everything between <think> and </think> tags, including the tags themselves
  return text.replace(/<think>[\s\S]*?<\/think>/g, '');
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
    
    const prompt = `Explain ${stockSymbol} recent news and analyst sentiments. Restrict your sources to The Wall Street Journal, Bloomberg, Financial Times, CNBC, Reuters, Barrons, The Economist, MarketWatch, Morningstar, NPR Marketplace, and Refinitiv. Do not include references in the format [1], [2], etc. Your output should NOT exceed 300 words. Format your response elegantly using markdown.`;
    
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
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant providing concise and accurate information about stocks. Restrict your sources to The Wall Street Journal, Bloomberg, Financial Times, CNBC, Reuters, Barrons, The Economist, MarketWatch, Morningstar, NPR Marketplace, and Refinitiv. Be concise. Do not include numbered references like [1], [2] in your response. Your output should NOT exceed 300 words. Format your response elegantly using markdown. DO NOT include any <think> tags or internal thinking process in your response.',
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
    
    // Clean the response content by removing <think> tags and their content
    const cleanedContent = cleanResponseText(data.choices[0]?.message.content || 'No analysis available');
    
    return {
      content: cleanedContent
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
