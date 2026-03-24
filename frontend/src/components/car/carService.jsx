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

export const transformStrapiPricing = (
  car,
  pricingType = PRICING_TYPE.NORMAL
) => {
  const pricing = {};

  // ✅ Add 24-5000 from `preis` for NORMAL pricing (preis is string, convert to number)
  if (pricingType === PRICING_TYPE.NORMAL) {
    const base = Number.parseInt(String(car.preis ?? ""), 10);
    if (Number.isFinite(base) && base > 0) {
      pricing["24-5000"] = base;
    }
  }

  Object.entries(PRICING_VARIABLE_MAP).forEach(([varName, { term, km }]) => {
    if (varName === "PreisFurUnternehmen") {
      if (pricingType === PRICING_TYPE.COMPANY && car[varName] != null) {
        const key = `${term}-${km}`;
        pricing[key] = Math.round(Number(car[varName]) / 1.081);
      }
      return;
    }

    if (car[varName] != null) {
      const key = `${term}-${km}`;
      let val = Number(car[varName]);
      if (pricingType === PRICING_TYPE.COMPANY) val = Math.round(val / 1.081);
      pricing[key] = val;
    }
  });

  // keep your existing company fallback if needed
  if (pricingType === PRICING_TYPE.COMPANY && !pricing["24-5000"]) {
    const basePrice = Number.parseInt(String(car.preis ?? ""), 10) || 0;
    if (basePrice > 0) pricing["24-5000"] = Math.round(basePrice / 1.081);
  }

  return pricing;
};

export const transformPricingOptions = (car) => {
  if (!car) return { kmOptions: [], termOptions: [] };

  const pricing = car.pricing || transformStrapiPricing(car);
  const keys = Object.keys(pricing);

  if (keys.length === 0) {
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
  const base = parseInt(car.tenthVariable) || parseInt(car.preis) || 0;

  if (pricingType === PRICING_TYPE.COMPANY) {
    return Math.round(base / 1.081);
  }

  return base;
};

export const fetchCars = async (
  page,
  filters,
  signal,
  pricingType = PRICING_TYPE.NORMAL
) => {
  const strapiFilters = {};

  // Search by car name
  if (filters.autoname) {
    strapiFilters.$or = [
      { marke: { $containsi: filters.autoname } },
      { modell: { $containsi: filters.autoname } },
    ];
  }

  // Handle standard filters (fahrzeugart, treibstoff, getriebe)
  Object.keys(UI_TO_SCHEMA_KEY).forEach((uiKey) => {
    const selected = (filters[uiKey] || []).map((v) =>
      normalizeEnumValue(uiKey, v)
    );
    if (selected.length) {
      strapiFilters[UI_TO_SCHEMA_KEY[uiKey]] = { $in: selected };
    }
  });

  // ✅ ADD: Handle neuOderOccasion filter
  if (filters.NeuOderOccasion && filters.NeuOderOccasion.length > 0) {
    strapiFilters.NeuOderOccasion = { $in: filters.NeuOderOccasion };
  }

  const query = qs.stringify(
    {
      pagination: { page, pageSize: PAGE_SIZE, withCount: true },
      // sort first, then paginate (Strapi does this on the DB query)
      sort: ["tenthVariable:asc", "updatedAt:desc"],
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
    pricing: transformStrapiPricing(car, pricingType),
  }));

  return {
    cars,
    pageCount: data?.meta?.pagination.pageCount || 1,
  };
};

export const fetchCarById = async (id, pricingType = PRICING_TYPE.NORMAL) => {
  const query = qs.stringify(
    {
      populate: {
        [IMAGE_FIELD]: { fields: ["url", "formats"] },
        features: true,
      },
    },
    { encodeValuesOnly: true }
  );

  const { data } = await axios.get(`${API_BASE}/api/cars/${id}?${query}`);
  
  const normalized = normalizeCarData([data.data])[0];

  return {
    ...normalized,
    displayPrice: getPrice(normalized, pricingType),
    pricingType,
    pricing: transformStrapiPricing(normalized, pricingType),
  };
};

export const fetchCarBySlug = async (slugOrId, pricingType = PRICING_TYPE.NORMAL) => {
  const query = qs.stringify(
    {
      filters: { 
        $or: [
          { slug: { $eq: slugOrId } },
          { documentId: { $eq: slugOrId } }
        ]
      },
      populate: {
        [IMAGE_FIELD]: { fields: ["url", "formats"] },
        features: true,
      },
    },
    { encodeValuesOnly: true }
  );

  const { data } = await axios.get(`${API_BASE}/api/cars?${query}`);

  const entry = data?.data?.[0];
  if (!entry) throw new Error(`Car not found for slug or ID: ${slugOrId}`);

  const normalized = normalizeCarData([entry])[0];

  return {
    ...normalized,
    displayPrice: getPrice(normalized, pricingType),
    pricingType,
    pricing: transformStrapiPricing(normalized, pricingType),
  };
};

export const fetchTopCategories = async () => {
  const query = qs.stringify(
    {
      populate: {
        car: {
          populate: {
            [IMAGE_FIELD]: { fields: ["url", "formats"] },
          },
        },
      },
    },
    { encodeValuesOnly: true }
  );

  try {
    const { data } = await axios.get(`${API_BASE}/api/top-kategorie?${query}`);

    const carData = data?.data?.attributes?.car?.data;

    if (!carData) return [];

    return normalizeCarData(carData).map((car) => ({
      ...car,
      displayPrice: getPrice(car),
      pricing: transformStrapiPricing(car),
    }));
  } catch (error) {
    console.error("Error fetching top categories:", error);
    return [];
  }
};
