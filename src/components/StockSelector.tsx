
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Stock, popularStocks } from '@/utils/stocksData';

interface StockSelectorProps {
  onSelectStock: (stock: Stock) => void;
}

const StockSelector: React.FC<StockSelectorProps> = ({ onSelectStock }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
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
          <button
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
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] bg-white"
          align="start"
        >
          <Command className="rounded-lg border-none">
            <CommandInput 
              placeholder="Search stocks..." 
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No stocks found.
            </CommandEmpty>
            <CommandGroup className="max-h-[210px] overflow-auto">
              {popularStocks.map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  onSelect={() => handleSelect(stock)}
                  className={cn(
                    "flex items-center gap-2 py-2 px-2 cursor-pointer aria-selected:bg-accent",
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
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StockSelector;
