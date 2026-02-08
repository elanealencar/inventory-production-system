export type SuggestionItem = {
  productId: number;
  productCode: string;
  productName: string;
  unitValue: number;
  suggestedQuantity: number;
  subtotal: number;
};

export type SuggestionResponse = {
  items: SuggestionItem[];
  totalValue: number;
};
