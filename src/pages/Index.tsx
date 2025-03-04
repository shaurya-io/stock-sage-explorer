
import React, { useState, useEffect } from 'react';
import { Stock } from '@/utils/stocksData';
import { getStockAnalysis } from '@/utils/perplexityApi';
import StockSelector from '@/components/StockSelector';
import StockAnalysis from '@/components/StockAnalysis';

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Hardcoded API key
  const apiKey = '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';

  const handleSelectStock = async (stock: Stock) => {
    setSelectedStock(stock);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const stockAnalysis = await getStockAnalysis(stock.symbol, apiKey);
      setAnalysis(stockAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
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
        <div className="mb-8 animate-fade-up">
          <StockSelector onSelectStock={handleSelectStock} />
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
