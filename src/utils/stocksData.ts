
export interface Stock {
  symbol: string;
  name: string;
  sector?: string;
}

// This is a simplified list of popular US stocks
export const popularStocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical" },
  { symbol: "META", name: "Meta Platforms, Inc.", sector: "Technology" },
  { symbol: "TSLA", name: "Tesla, Inc.", sector: "Automotive" },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services" },
  { symbol: "V", name: "Visa Inc.", sector: "Financial Services" },
  { symbol: "WMT", name: "Walmart Inc.", sector: "Consumer Defensive" },
  { symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer Defensive" },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare" },
  { symbol: "MA", name: "Mastercard Incorporated", sector: "Financial Services" },
  { symbol: "UNH", name: "UnitedHealth Group Incorporated", sector: "Healthcare" },
  { symbol: "HD", name: "The Home Depot, Inc.", sector: "Consumer Cyclical" },
  { symbol: "BAC", name: "Bank of America Corporation", sector: "Financial Services" },
  { symbol: "PFE", name: "Pfizer Inc.", sector: "Healthcare" },
  { symbol: "DIS", name: "The Walt Disney Company", sector: "Communication Services" },
  { symbol: "NFLX", name: "Netflix, Inc.", sector: "Communication Services" },
  { symbol: "ADBE", name: "Adobe Inc.", sector: "Technology" },
  { symbol: "CMCSA", name: "Comcast Corporation", sector: "Communication Services" },
  { symbol: "CSCO", name: "Cisco Systems, Inc.", sector: "Technology" },
  { symbol: "INTC", name: "Intel Corporation", sector: "Technology" },
  { symbol: "VZ", name: "Verizon Communications Inc.", sector: "Communication Services" },
  { symbol: "KO", name: "The Coca-Cola Company", sector: "Consumer Defensive" },
  { symbol: "PEP", name: "PepsiCo, Inc.", sector: "Consumer Defensive" },
  { symbol: "ABT", name: "Abbott Laboratories", sector: "Healthcare" },
  { symbol: "MRK", name: "Merck & Co., Inc.", sector: "Healthcare" },
  { symbol: "NKE", name: "NIKE, Inc.", sector: "Consumer Cyclical" },
  { symbol: "T", name: "AT&T Inc.", sector: "Communication Services" }
];

export const getStockBySymbol = (symbol: string): Stock | undefined => {
  return popularStocks.find(stock => stock.symbol === symbol);
};
