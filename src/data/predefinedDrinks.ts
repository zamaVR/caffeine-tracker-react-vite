// src/data/predefinedDrinks.ts

export type PredefinedDrink = {
    id: string;
    label: string;
    caffeineMg: number;
  };
  
  export const predefinedDrinks: PredefinedDrink[] = [
    // Espresso (standard single shot)
    { id: 'espresso-1oz', label: 'Espresso Shot - 1oz', caffeineMg: 64 },
  
    // Drip Coffee
    { id: 'drip-8oz', label: 'Drip Coffee - 8oz', caffeineMg: 95 },
    { id: 'drip-12oz', label: 'Drip Coffee - 12oz', caffeineMg: 140 },
    { id: 'drip-16oz', label: 'Drip Coffee - 16oz', caffeineMg: 190 },
    { id: 'drip-20oz', label: 'Drip Coffee - 20oz', caffeineMg: 240 },
  
    // Latte (assuming 1 shot per 8–12oz, then ~1 extra shot per 8oz after)
    { id: 'latte-8oz', label: 'Latte - 8oz', caffeineMg: 64 },
    { id: 'latte-12oz', label: 'Latte - 12oz', caffeineMg: 64 },
    { id: 'latte-16oz', label: 'Latte - 16oz', caffeineMg: 128 },
    { id: 'latte-20oz', label: 'Latte - 20oz', caffeineMg: 128 },
  
    // Black Tea
    { id: 'black-tea-1bag', label: 'Black Tea - 1 bag', caffeineMg: 47 },
    { id: 'black-tea-2bag', label: 'Black Tea - 2 bags', caffeineMg: 94 },
    { id: 'black-tea-3bag', label: 'Black Tea - 3 bags', caffeineMg: 141 },
  
    // Green Tea
    { id: 'green-tea-1bag', label: 'Green Tea - 1 bag', caffeineMg: 28 },
    { id: 'green-tea-2bag', label: 'Green Tea - 2 bags', caffeineMg: 56 },
    { id: 'green-tea-3bag', label: 'Green Tea - 3 bags', caffeineMg: 84 },
  
    // Red Bull (official: 80mg per 8.4oz)
    { id: 'redbull-8.4oz', label: 'Red Bull - 8.4oz', caffeineMg: 80 },
    { id: 'redbull-12oz', label: 'Red Bull - 12oz', caffeineMg: 114 },
    { id: 'redbull-16oz', label: 'Red Bull - 16oz', caffeineMg: 151 },
    { id: 'redbull-20oz', label: 'Red Bull - 20oz', caffeineMg: 198 },
  ];
  