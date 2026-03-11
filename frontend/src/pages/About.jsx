import React, { useState, useEffect } from "react";
import { fetchPageData } from "../services/pageService";
import SEO from "../components/general/SEO";
import AboutStart from "../components/about/AboutStart";
import UnsereMission from "../components/about/UnsereMission";
import Car from "../components/about/Car";
import Verantwortung from "../components/about/Verantwortung";
import Nachrichten from "../components/about/Nachrichten";
import ScrollToTop from "../components/general/ScrollToTop";
import Abonnieren from "../components/general/Abonnieren";
import AboutStart2 from "../components/about/AboutStart2";
const About = () => {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetchPageData("ueber-uns", "Über uns (About)").then(data => {
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
        src="/images/aboutStart.png"
        title={seoData?.content?.[0]?.children?.[0]?.text || seoData?.title || "Unser Antrieb"}
        paragraph={seoData?.content?.[1]?.children?.[0]?.text || "Mobilität, wie sie sein soll. Einfach, fair und auf Ihre Bedürfnisse zugeschnitten"}
        mobileSrc="/images/aboutMobile.png"
      />
      <UnsereMission />
      <Car />
      <Verantwortung />
      <Abonnieren />
      <Nachrichten />
    </div>
  );
};

export default About;
