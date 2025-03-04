
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Stock, popularStocks } from '@/utils/stocksData';

interface StockSelectorProps {
  onSelectStock: (stock: Stock) => void;
}

const StockSelector: React.FC<StockSelectorProps> = ({ onSelectStock }) => {
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const handleSelect = (stock: Stock) => {
    setSelectedStock(stock);
    onSelectStock(stock);
    setOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex items-center justify-between w-full rounded-xl px-4 py-3 text-sm bg-white border border-border shadow-sm hover:bg-accent transition-colors duration-200 ease-in-out"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className={cn(
                "font-medium",
                !selectedStock && "text-muted-foreground"
              )}>
                {selectedStock ? `${selectedStock.symbol} - ${selectedStock.name}` : "Select a stock..."}
              </span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              open && "transform rotate-180"
            )} />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="p-0 w-full max-w-[var(--radix-popover-trigger-width)] bg-white shadow-md rounded-md"
          align="start"
          sideOffset={5}
        >
          <div className="max-h-[300px] overflow-auto p-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search stocks..."
                className="h-10 w-full rounded-md border border-input bg-background pl-8 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="mt-2">
              {popularStocks.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No stocks found.
                </p>
              ) : (
                <div className="space-y-1">
                  {popularStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => handleSelect(stock)}
                      className={cn(
                        "flex items-center gap-2 py-2 px-2 cursor-pointer rounded hover:bg-accent",
                        selectedStock?.symbol === stock.symbol && "bg-accent/50"
                      )}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 opacity-0 transition-opacity duration-200",
                          selectedStock?.symbol === stock.symbol && "opacity-100"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[280px]">
                          {stock.name}
                          {stock.sector && ` • ${stock.sector}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StockSelector;
