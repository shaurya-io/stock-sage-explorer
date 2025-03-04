
import React, { useState, useEffect } from 'react';
import { Stock } from '@/utils/stocksData';
import { getStockAnalysis } from '@/utils/perplexityApi';
import StockSelector from '@/components/StockSelector';
import StockAnalysis from '@/components/StockAnalysis';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Effect to handle the progress bar filling over 20 seconds
  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    
    if (isLoading) {
      setProgress(0);
      const intervalDuration = 200; // Update every 200ms
      const totalDuration = 20000; // 20 seconds
      const steps = totalDuration / intervalDuration;
      const increment = 100 / steps;
      
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + increment;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, intervalDuration);
    } else if (progressInterval) {
      setProgress(100); // Ensure progress reaches 100% when loading completes
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isLoading]);

  const handleSelectStock = async (stock: Stock) => {
    setSelectedStock(stock);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      toast.info(`Analyzing ${stock.symbol}...`);
      const result = await getStockAnalysis(stock.symbol);
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

  return (
    <div className="min-h-screen bg-accent/30">
      <header className="w-full bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-6">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-medium px-2 py-1 bg-accent text-accent-foreground rounded-full animate-fade-in mb-2">
              Stock Insights
            </span>
            <h1 className="text-3xl font-bold tracking-tight animate-fade-up">
              Stock News Summarizer v0
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl animate-fade-up animate-delay-100">
              Select a stock to receive a comprehensive analysis of recent price movements, news, and analyst sentiments.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col gap-4 mb-8 animate-fade-up">
          <div className="flex items-center justify-between">
            <StockSelector onSelectStock={handleSelectStock} />
          </div>
        </div>

        {isLoading && (
          <div className="w-full max-w-4xl mx-auto mb-6 animate-fade-up">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Analyzing {selectedStock?.symbol}...
              </p>
              <span className="text-xs text-muted-foreground">
                {Math.min(Math.round(progress), 100)}%
              </span>
            </div>
            <Progress value={progress} className="h-2 w-full" />
          </div>
        )}

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
            Stock News Summarizer v0 provides analysis powered by Perplexity API. Stock information is for educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
