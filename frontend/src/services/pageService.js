import axios from "axios";
import { API_BASE } from "../components/car/Constans";

/**
 * Fetches Single Type page data from Strapi and logs its SEO fields.
 * 
 * @param {string} endpoint - The Strapi API endpoint (e.g., 'global', 'faq', 'auto-abo-pro')
 * @param {string} pageName - A human readable name for logging (e.g., 'FAQ Page')
 * @returns {object|null} The attributes of the page or null on error
 */
export const fetchPageData = async (endpoint, pageName) => {
  try {
    // Populate all relations/media/components at the first level
    // Some setups might need deep population for nested media ex: ?populate[defaultSeo][populate]=*
    const queryParam = "populate=*";
    const { data } = await axios.get(`${API_BASE}/api/${endpoint}?${queryParam}`);

    return data?.data?.attributes || data?.data || null;
  } catch (error) {
    console.error(`Error fetching data for ${pageName} (${endpoint}):`, error.message);
    return null;
  }
};
