import React, { useState, useEffect } from "react";
import { fetchPageData } from "../services/pageService";
import SEO from "../components/general/SEO";
import Angebot from "../components/faq/Angebot";
import AboutStart from "../components/about/AboutStart";
import Deinem from "../components/faq/Deinem";
import ScrollToTop from "../components/general/ScrollToTop";
import Abonnieren from "../components/general/Abonnieren";
import Nachrichten from "../components/about/Nachrichten";

const Faq = () => {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetchPageData("faq", "FAQ Page").then(data => {
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
        src="/images/faqPhoto.png"
        title="FAQ"
        mobileSrc="/images/mobileFaq.png"
      /> */}
      {/* <Angebot /> */}
      <Deinem />
      <Abonnieren />
      <Nachrichten />
    </div>
  );
};

export default Faq;
