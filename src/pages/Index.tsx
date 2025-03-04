import React, { useState, useEffect } from 'react';
import { Stock } from '@/utils/stocksData';
import { getStockAnalysis } from '@/utils/perplexityApi';
import StockSelector from '@/components/StockSelector';
import StockAnalysis from '@/components/StockAnalysis';
import { toast } from 'sonner';

const API_KEY_STORAGE_KEY = 'perplexity_api_key';

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [keySubmitted, setKeySubmitted] = useState<boolean>(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setKeySubmitted(true);
    }
  }, []);

  const handleSelectStock = async (stock: Stock) => {
    if (!keySubmitted) {
      toast.error('Please enter your Perplexity API key first');
      return;
    }

    if (!apiKey || apiKey.trim() === '') {
      toast.error('API key is empty or invalid');
      setKeySubmitted(false);
      return;
    }

    setSelectedStock(stock);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      toast.info(`Analyzing ${stock.symbol}...`);
      const result = await getStockAnalysis(stock.symbol, apiKey);
      setAnalysis(result.content);
      toast.success(`Analysis for ${stock.symbol} complete`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Error fetching analysis: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    const trimmedKey = apiKey.trim();
    
    if (!trimmedKey.startsWith('pplx-')) {
      toast.warning('API key should start with "pplx-". Please check your key.');
    }
    
    localStorage.setItem(API_KEY_STORAGE_KEY, trimmedKey);
    setApiKey(trimmedKey);
    setKeySubmitted(true);
    toast.success('API key saved');
  };

  const handleResetApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setKeySubmitted(false);
    setSelectedStock(null);
    setAnalysis(null);
    setError(null);
    toast.info('API key removed');
  };

  return (
    <div className="min-h-screen bg-accent/30">
      <header className="w-full bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-6">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-medium px-2 py-1 bg-accent text-accent-foreground rounded-full animate-fade-in mb-2">
              Stock Insights
            </span>
            <h1 className="text-3xl font-bold tracking-tight animate-fade-up">
              Stock Sage Explorer
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl animate-fade-up animate-delay-100">
              Select a stock to receive a comprehensive analysis of recent price movements, news, and analyst sentiments.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:px-6">
        {!keySubmitted ? (
          <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-border animate-fade-up">
            <h2 className="text-lg font-medium mb-4">Perplexity API Key</h2>
            <form onSubmit={handleSubmitApiKey} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="api-key" className="text-sm font-medium">
                  Enter your Perplexity API key to get started
                </label>
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="pplx-..."
                  autoComplete="off"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally in your browser and never sent to our servers.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Start Analyzing Stocks
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-8 animate-fade-up">
              <div className="flex items-center justify-between">
                <StockSelector onSelectStock={handleSelectStock} />
                <button
                  onClick={handleResetApiKey}
                  className="text-xs text-muted-foreground hover:text-destructive border border-border px-3 py-1 rounded-md"
                >
                  Reset API Key
                </button>
              </div>
            </div>

            {selectedStock && (
              <StockAnalysis
                stock={selectedStock}
                analysis={analysis}
                isLoading={isLoading}
                error={error}
              />
            )}

            {!selectedStock && (
              <div className="text-center my-16 animate-fade-up animate-delay-200">
                <p className="text-muted-foreground">
                  Select a stock from the dropdown above to view its analysis
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="w-full border-t border-border py-6 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <p className="text-xs text-center text-muted-foreground">
            Stock Sage Explorer provides analysis powered by Perplexity API. Stock information is for educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
