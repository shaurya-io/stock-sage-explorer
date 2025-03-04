
import React from 'react';
import { Stock } from '@/utils/stocksData';
import { cn } from '@/lib/utils';

interface StockAnalysisProps {
  stock: Stock | null;
  analysis: string | null;
  isLoading: boolean;
  error: string | null;
}

const StockAnalysis: React.FC<StockAnalysisProps> = ({
  stock,
  analysis,
  isLoading,
  error
}) => {
  if (!stock) {
    return null;
  }

  // Function to format analysis text with paragraphs
  const formatAnalysis = (text: string) => {
    if (!text) return [];
    
    // Split by paragraphs and filter out empty ones
    return text.split('\n\n').filter(paragraph => paragraph.trim().length > 0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-up">
      <div className="px-6 py-6 rounded-2xl bg-white shadow-sm border border-border">
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                {stock.sector || 'Stock'}
              </span>
              <h2 className="text-2xl font-semibold mt-2">{stock.name}</h2>
              <p className="text-sm text-muted-foreground">{stock.symbol}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-4">
              <div className="h-4 bg-secondary animate-pulse-soft rounded-full w-3/4"></div>
              <div className="h-4 bg-secondary animate-pulse-soft rounded-full w-full"></div>
              <div className="h-4 bg-secondary animate-pulse-soft rounded-full w-5/6"></div>
              <div className="h-4 bg-secondary animate-pulse-soft rounded-full w-2/3"></div>
              <div className="h-4 bg-secondary animate-pulse-soft rounded-full w-full"></div>
            </div>
          ) : error ? (
            <div className="py-4 text-destructive text-sm">
              <p className="font-medium">Error fetching analysis</p>
              <p>{error}</p>
            </div>
          ) : analysis ? (
            <div className="prose prose-gray max-w-none">
              {formatAnalysis(analysis).map((paragraph, index) => (
                <p key={index} className={cn(
                  "text-sm leading-relaxed mb-4",
                  index === 0 && "text-base"
                )}>
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">
              Select a stock to view the analysis.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;
