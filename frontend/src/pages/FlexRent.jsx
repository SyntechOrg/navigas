import React, { useState, useEffect } from "react";
import { fetchPageData } from "../services/pageService";
import SEO from "../components/general/SEO";
import AboutStart2 from "../components/about/AboutStart2";
import Flexible from "../components/general/Flexible";
import Peaks from "../components/general/Peaks";
import TopKategorien from "../components/general/TopKategorien";
import ServicesType2 from "../components/general/ServicesType2";
import Fragen from "../components/general/Fragen";
import Unverbindlich from "../components/general/Unverbindlich";
import Abonnieren from "../components/general/Abonnieren";
import Nachrichten from "../components/about/Nachrichten";
import ScrollToTop from "../components/general/ScrollToTop";

const FlexRent = () => {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetchPageData("flex-rent", "FlexRent Page").then(data => {
      if (data) {
        setSeoData(data);
      }
    });
  }, []);

  return (
    <div>
      {seoData && (
        <SEO 
          title={seoData.metaTitle} 
          description={seoData.metaDescription} 
          image={seoData.shareImage?.url ? `${seoData.shareImage.url}` : null} 
        />
      )}
      <ScrollToTop />
      <AboutStart2
        src="/images/VideoBG.png"
        mobileSrc="/images/mobileFlex.png"
        title={seoData?.content?.[0]?.children?.[0]?.text || seoData?.title || "FlexRent: Top-Auto für Ihr KMU"}
        paragraph={seoData?.content?.[1]?.children?.[0]?.text || "Maximale Mobilität mit minimalem Aufwand: Fahrzeuge ab 1 Monat inklusive Lieferung an Ihre Wunschadresse. Schnell, flexibel, alles drin."}
      />
      <Flexible />
      <Peaks />
      <TopKategorien />
      <ServicesType2 />
      <Fragen />
      <Unverbindlich />
      <Abonnieren />
      <Nachrichten />
    </div>
  );
};

export default FlexRent;
