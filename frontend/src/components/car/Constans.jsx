export const API_BASE = import.meta.env.VITE_APP_API_URL;
export const PAGE_SIZE = 9;
export const IMAGE_FIELD = "Image";

export const PRICING_TYPE = {
  NORMAL: "normal",
  COMPANY: "company",
};

export const FILTER_OPTIONS = {
  fahrzeugart: ["Kleinwagen", "Kompakt", "Mittelklasse", "SUV"],
  treibstoff: ["Elektrisch", "Hybrid", "Benzin"],
  getriebe: ["Automatik", "Handschaltung"],
};

export const UI_TO_SCHEMA_KEY = {
  fahrzeugart: "Fahrzeugart",
  treibstoff: "Treibstoff",
  getriebe: "Getriebe",
};
