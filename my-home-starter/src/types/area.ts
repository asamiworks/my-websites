export interface Municipality {
    name: string;
    slug: string;
    population: number;
  }
  
  export interface BudgetRange {
    slug: string;
    label: string;
    min: number;
    max: number;
    description: string;
  }
  
  export interface AreaContent {
    title: string;
    description: string;
    h1: string;
    leadText: string;
    pricePerTsubo: number;
    sections: {
      landPrice: {
        title: string;
        content: string;
      };
      buildingCost: {
        title: string;
        content: string;
      };
      recommendedCompanies: {
        title: string;
        content: string;
      };
    };
  }