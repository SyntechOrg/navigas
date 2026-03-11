import { useState, useEffect } from "react";
import { fetchPageData } from "../services/pageService";
import SEO from "../components/general/SEO";
import HomeStart from "../components/home/HomeStart";
import LogoSlider from "../components/home/LogoSlider";
import HoverCategories from "../components/home/HoverCategories";
import Auto from "../components/home/Auto";
import CarList from "../components/general/CarList";
import ServicesType from "../components/home/ServicesType";
import ScrollAnimation from "../components/home/ScrollAnimation";
import Video from "../components/home/Video";
import Nachrichten from "../components/about/Nachrichten";
import Abonnieren from "../components/general/Abonnieren";
import ScrollToTop from "../components/general/ScrollToTop";

function Home() {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetchPageData("global", "Global / Home Page").then(data => {
      if (data && data.defaultSeo) {
        setSeoData(data.defaultSeo);
      }
    });
  }, []);

  // const [refreshTrigger, setRefreshTrigger] = useState(0);

  // const handleUploadSuccess = () => {
  //   setRefreshTrigger((prev) => prev + 1);
  // };

  return (
    <div className="">
      {seoData && (
        <SEO 
          title={seoData.metaTitle} 
          description={seoData.metaDescription} 
          image={seoData.shareImage?.url ? `${seoData.shareImage.url}` : null} 
        />
      )}
      <ScrollToTop />
      <HomeStart />
      <LogoSlider />

      <HoverCategories />
      <Auto />
      <ServicesType />
      <Video />
      <Abonnieren />
      <ScrollAnimation />

      {/* <ExcelUploader onUploadSuccess={handleUploadSuccess} /> */}

      {/* <button
        onClick={() => setRefreshTrigger((prev) => prev + 1)}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
      >
        Refresh List
      </button> */}
      <Nachrichten />

      {/* <CarList refreshTrigger={refreshTrigger} /> */}
    </div>
  );
}

export default Home;
