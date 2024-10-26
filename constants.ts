export type Prices = {
    inr: number;
    usd: number;
    gbp: number;
    aud: number;
    aed: number;
  };

export type EventPricing = {
    [event: string]: {
      name: string;
      prices: Prices;
    };
  };

export type EventDict = {
    [key: string]: string;
}

export const academies = ["Academy of Kalari Adimurai", "Kalari Academy of Texas Payil", "Subashini Kalari Group", "Queen City ATA Martial Arts", "Tamil Tutor Inc.", "World Federation Of Kalari"]
export const ages = ["6 Years", "7 to 8 Years", "9 to 10 Years", "11 to 12 Years", "13 to 15 Years", "16 to 18 Years", "18 to 25 Years", "26 to 30 Years", "31 to 35 Years", "36 to 40 Years", "41 to 45 Years", "46 to 50 Years", "51 Years and up"]
export const events_dict_WFK: EventDict = {"Silambam": "S", "Kalari Chuvadu & Silambam": "KCS", "Kalari Chuvadu & Silambam & Vel Kambu": "KCSVK", "K.C. & Silambam & V.K. & Kalari Payattu": "KCSVKKP"}
export const events_pricing_WFK: EventPricing = {
    "S": {
      name: "S",
      prices: {
        inr: 450000,
        usd: 5000,
        gbp: 4000,
        aud: 8000,
        aed: 20000
      }
    },
    "KCS": {
      name: "KCS",
      prices: {
        inr: 575000,
        usd: 5000,
        gbp: 5500,
        aud: 10000,
        aed: 25000
      }
    },
    "KCSVK": {
      name: "KCSVK",
      prices: {
        inr: 700000,
        usd: 7500,
        gbp: 7000,
        aud: 12000,
        aed: 30000
      }
    },
    "KCSVKKP": {
      name: "KCSVKKP",
      prices: {
        inr: 800000,
        usd: 10000,
        gbp: 8000,
        aud: 14000,
        aed: 35000
      }
    }
  };
export const events_dict_open = {"Silambam": "S", "Kalari Chuvadu & Silambam": "KCS"}
export const events_pricing_open: EventPricing = {
    "S": {
      name: "S",
      prices: {
        inr: 450000,
        usd: 5000,
        gbp: 4000,
        aud: 8000,
        aed: 20000
      }
    },
    "KCS": {
      name: "KCS",
      prices: {
        inr: 10000,
        usd: 1000,
        gbp: 1000,
        aud: 12000,
        aed: 12000
      }
    }
  };

export const currencySymbols = {
    inr: '₹',
    usd: '$',
    gbp: '£',
    aud: 'A$',
    aed: 'د.إ',
  };