import axios from "axios";
import qs from "qs";
import {
  API_BASE,
  PAGE_SIZE,
  IMAGE_FIELD,
  UI_TO_SCHEMA_KEY,
  PRICING_TYPE,
} from "./Constans";
import { normalizeCarData } from "./ImageHelpers";

const normalizeEnumValue = (key, val) => {
  if (key === "getriebe" && val === "Allrad (4x4)") return "Allrad";
  return val;
};

const PRICING_VARIABLE_MAP = {
  PreisFurUnternehmen: { term: 24, km: 5000 },
  firstVariable: { term: 24, km: 10000 },
  secondVariable: { term: 24, km: 15000 },
  thirdVariable: { term: 24, km: 20000 },
  fourthVariable: { term: 24, km: 25000 },
  fifthVariable: { term: 36, km: 5000 },
  sixthVariable: { term: 36, km: 10000 },
  seventhVariable: { term: 36, km: 15000 },
  eighthVariable: { term: 36, km: 20000 },
  ninthVariable: { term: 36, km: 25000 },
  tenthVariable: { term: 48, km: 5000 },
  eleventhVariable: { term: 48, km: 10000 },
  twelfthVariable: { term: 48, km: 15000 },
  thirteenthVariable: { term: 48, km: 20000 },
  fourteenthVariable: { term: 48, km: 25000 },
};

export const transformStrapiPricing = (car) => {
  const pricing = {};

  Object.entries(PRICING_VARIABLE_MAP).forEach(([varName, { term, km }]) => {
    if (car[varName] !== undefined && car[varName] !== null) {
      const key = `${term}-${km}`;
      pricing[key] = Number(car[varName]);
    }
  });

  return pricing;
};

// UPDATED: Transform pricing to get available km and term options
export const transformPricingOptions = (car) => {
  if (!car) return { kmOptions: [], termOptions: [] };

  const pricing = car.pricing || transformStrapiPricing(car);
  const keys = Object.keys(pricing);

  if (keys.length === 0) {
    // Fallback to default options if no pricing data
    return {
      kmOptions: [
        { km: 5000 },
        { km: 10000 },
        { km: 15000 },
        { km: 20000 },
        { km: 25000 },
      ],
      termOptions: [{ months: 24 }, { months: 36 }, { months: 48 }],
    };
  }

  const kmSet = new Set();
  const termSet = new Set();

  keys.forEach((key) => {
    const [term, km] = key.split("-").map(Number);
    termSet.add(term);
    kmSet.add(km);
  });

  return {
    kmOptions: Array.from(kmSet)
      .sort((a, b) => a - b)
      .map((km) => ({ km })),
    termOptions: Array.from(termSet)
      .sort((a, b) => a - b)
      .map((months) => ({ months })),
  };
};

export const getPrice = (car, pricingType = PRICING_TYPE.NORMAL) => {
  if (pricingType === PRICING_TYPE.COMPANY) {
    return parseInt(car.PreisFurUnternehmen || car.preis) || 0;
  }
  return parseInt(car.preis) || 0;
};

export const fetchCars = async (
  page,
  filters,
  signal,
  pricingType = PRICING_TYPE.NORMAL
) => {
  const strapiFilters = {};

  if (filters.autoname) {
    strapiFilters.$or = [
      { marke: { $containsi: filters.autoname } },
      { modell: { $containsi: filters.autoname } },
    ];
  }

  Object.keys(UI_TO_SCHEMA_KEY).forEach((uiKey) => {
    const selected = (filters[uiKey] || []).map((v) =>
      normalizeEnumValue(uiKey, v)
    );
    if (selected.length) {
      strapiFilters[UI_TO_SCHEMA_KEY[uiKey]] = { $in: selected };
    }
  });

  const query = qs.stringify(
    {
      pagination: { page, pageSize: PAGE_SIZE, withCount: true },
      sort: ["updatedAt:desc"],
      fields: [
        "marke",
        "modell",
        "Getriebe",
        "leistung",
        "Treibstoff",
        "verbrauch",
        "preis",
        "PreisFurUnternehmen",
        "firstVariable",
        "secondVariable",
        "thirdVariable",
        "fourthVariable",
        "fifthVariable",
        "sixthVariable",
        "seventhVariable",
        "eighthVariable",
        "ninthVariable",
        "tenthVariable",
        "eleventhVariable",
        "twelfthVariable",
        "thirteenthVariable",
        "fourteenthVariable",
      ],
      populate: { [IMAGE_FIELD]: { fields: ["url", "formats"] } },
      filters: Object.keys(strapiFilters).length ? strapiFilters : undefined,
    },
    { encodeValuesOnly: true }
  );

  const { data } = await axios.get(`${API_BASE}/api/cars?${query}`, { signal });

  const cars = normalizeCarData(data.data).map((car) => ({
    ...car,
    displayPrice: getPrice(car, pricingType),
    pricingType,
    pricing: transformStrapiPricing(car), // ADDED: Transform pricing variables
  }));

  return {
    cars,
    pageCount: data?.meta?.pagination.pageCount || 1,
  };
};

export const fetchCarById = async (id, pricingType = PRICING_TYPE.NORMAL) => {
  const query = qs.stringify(
    {
      populate: { [IMAGE_FIELD]: { fields: ["url", "formats"] } },
      fields: [
        "marke",
        "modell",
        "Getriebe",
        "leistung",
        "Treibstoff",
        "verbrauch",
        "preis",
        "PreisFurUnternehmen",
        "Fahrzeugart",
        "reichweite",
        "turen",
        "firstVariable",
        "secondVariable",
        "thirdVariable",
        "fourthVariable",
        "fifthVariable",
        "sixthVariable",
        "seventhVariable",
        "eighthVariable",
        "ninthVariable",
        "tenthVariable",
        "eleventhVariable",
        "twelfthVariable",
        "thirteenthVariable",
        "fourteenthVariable",
      ],
    },
    { encodeValuesOnly: true }
  );

  const { data } = await axios.get(`${API_BASE}/api/cars/${id}?${query}`);
  const normalized = normalizeCarData([data.data])[0];

  return {
    ...normalized,
    displayPrice: getPrice(normalized, pricingType),
    pricingType,
    pricing: transformStrapiPricing(normalized), // ADDED: Transform pricing variables
  };
};
