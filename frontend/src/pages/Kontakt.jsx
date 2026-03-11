import React, { useState, useEffect } from "react";
import { fetchPageData } from "../services/pageService";
import SEO from "../components/general/SEO";
import AboutStart from "../components/about/AboutStart";
import KontaktInfo from "../components/kontakt/KontaktInfo";
import KontaktFormular from "../components/kontakt/KontaktFormular";
import ScrollToTop from "../components/general/ScrollToTop";
import Abonnieren from "../components/general/Abonnieren";

const Kontakt = () => {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetchPageData("kontakt", "Kontakt Page").then(data => {
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
          image={seoData.shareImage?.[0]?.url ? `${seoData.shareImage[0].url}` : null} 
        />
      )}
      <ScrollToTop />
      {/* <AboutStart
        src="/images/kontaktPhoto.png"
        title="Kontakt"
        mobileSrc="/images/mobileKontakt.png"
      /> */}
      <KontaktInfo />
      <KontaktFormular />
      <Abonnieren />
    </div>
  );
};

export default Kontakt;
