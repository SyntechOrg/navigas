import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * Reusable SEO component to inject metadata into the <head> of the document.
 * 
 * @param {object} props
 * @param {string} props.title - The primary page title
 * @param {string} props.description - The primary page description
 * @param {string} props.image - The URL of the image to use for social sharing
 * @param {string} props.url - The current canonical URL 
 */
const SEO = ({ title, description, image, url }) => {
  // Fallbacks if not provided
  const siteName = "Navigas Mobility";
  const defaultTitle = "Auto Abo Schweiz – Flexibel, Transparent & All-Inclusive | Navigas Mobility";
  const defaultDescription = "Auto Abo Schweiz mit Versicherung, Service, europaweiter Assistance und Reifen inklusive. Flexible Laufzeiten, transparente Preise und schweizweite Lieferung.";
  
  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  
  // Optional: Build absolute URL for the image
  // Assuming 'image' might come in as an absolute URL from Strapi (e.g., Cloudinary)
  // or a relative path if local. If local, prefix with your API_BASE or frontend origin.
  const seoImage = image || "https://navigas-mobility.ch/images/navigasLogo.svg"; 

  // Make sure URL is absolute
  const seoUrl = url || typeof window !== "undefined" ? window.location.href : "https://navigas-mobility.ch";

  return (
    <Helmet>
      {/* Basic Standard HTML Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
};

export default SEO;
