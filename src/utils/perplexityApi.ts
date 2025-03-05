
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

// Hardcoded API key
const API_KEY = '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';

export async function getStockAnalysis(
  stockSymbol: string
): Promise<StockAnalysisResult> {
  try {
    const prompt = `Summarize recent ${stockSymbol} news. Format your response elegantly using markdown.`;
    
    console.log("Making request to Perplexity API");
    
    // Add credentials and mode to fetch options to handle CORS issues
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      mode: 'cors', // Add explicit CORS mode
      body: JSON.stringify({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant providing concise and accurate information about stocks. Restrict your sources to The Wall Street Journal, Bloomberg, Financial Times, CNBC, Reuters, Barrons, The Economist, MarketWatch, Morningstar, NPR Marketplace, and Refinitiv. Be concise. Do not include references in the format [1], [2], etc. List your references at the end. Format your response elegantly using markdown. All facts about stock prices and analyst targets should be double-checked from multiple sources. If you are not confident of a financial metric or fact, exclude it from your answer.',
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 400,
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
          'Connection to Perplexity API failed. This could be due to network issues or CORS restrictions.'
        );
      }
      throw error;
    }
    throw new Error('Unknown error when fetching stock analysis');
  }
}
