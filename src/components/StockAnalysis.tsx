
import React from 'react';
import { Stock } from '@/utils/stocksData';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, Link } from 'lucide-react';

interface StockAnalysisProps {
  stock: Stock | null;
  analysis: string | null;
  references: string[] | null;
  isLoading: boolean;
  error: string | null;
}

const StockAnalysis: React.FC<StockAnalysisProps> = ({
  stock,
  analysis,
  references,
  isLoading,
  error
}) => {
  if (!stock) {
    return null;
  }

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
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-2 mb-1" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-2 text-sm" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1 text-sm" {...props} />,
                  a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-200 pl-4 py-2 italic" {...props} />,
                  code: ({ node, ...props }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />,
                  pre: ({ node, ...props }) => <pre className="bg-gray-100 p-4 rounded overflow-x-auto mb-4" {...props} />,
                }}
              >
                {analysis}
              </ReactMarkdown>
              
              {references && references.length > 0 && (
                <div className="mt-8 pt-4 border-t border-border">
                  <h3 className="text-md font-bold mb-2">References</h3>
                  <ul className="space-y-2">
                    {references.map((reference, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <ExternalLink size={14} className="flex-shrink-0 mt-0.5" />
                        <a 
                          href={reference} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary truncate"
                          title={reference}
                        >
                          {reference.replace(/^https?:\/\/(www\.)?/, '').slice(0, 50)}
                          {reference.length > 50 ? '...' : ''}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
