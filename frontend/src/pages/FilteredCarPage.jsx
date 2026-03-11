import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPageData } from "../services/pageService";
import SEO from "../components/general/SEO";
import { FilterPanel } from "../components/car/FilterPanel";
import { CarList } from "../components/car/CarList";
import { PRICING_TYPE } from "../components/car/Constans";
import AboutStart from "../components/about/AboutStart";
import ScrollToTop from "../components/general/ScrollToTop";
import Nachrichten from "../components/about/Nachrichten";
import Abonnieren from "../components/general/Abonnieren";
import AboutStart2 from "../components/about/AboutStart2";

const INITIAL_FILTERS = {
  autoname: "",
  fahrzeugart: [],
  treibstoff: [],
  getriebe: [],
  NeuOderOccasion: [],
};

const FilteredCarPage = ({ pricingType = PRICING_TYPE.NORMAL }) => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    if (pricingType === PRICING_TYPE.NORMAL) {
      fetchPageData("privatkunde", "Privatkunden Page").then(data => {
        if (data) {
          setSeoData(data);
        }
      });
    }
  }, [pricingType]);

  // Combined useEffect for all URL params
  useEffect(() => {
    const fahrzeugart = searchParams.get("fahrzeugart");
    const treibstoff = searchParams.get("treibstoff");
    const NeuOderOccasion = searchParams.get("NeuOderOccasion");

    setFilters((prev) => ({
      ...prev,
      ...(fahrzeugart && { fahrzeugart: [fahrzeugart] }),
      ...(treibstoff && { treibstoff: [treibstoff] }),
      ...(NeuOderOccasion && { NeuOderOccasion: [NeuOderOccasion] }),
    }));
  }, [searchParams]);

  const memoizedFilters = useMemo(
    () => filters,
    [
      filters.autoname,
      filters.fahrzeugart,
      filters.treibstoff,
      filters.getriebe,
      filters.NeuOderOccasion,
    ]
  );

  return (
    <div>
      {seoData && pricingType === PRICING_TYPE.NORMAL && (
        <SEO 
          title={seoData.metaTitle || seoData.seo?.metaTitle || seoData.defaultSeo?.metaTitle} 
          description={seoData.metaDescription || seoData.seo?.metaDescription || seoData.defaultSeo?.metaDescription} 
          image={seoData.shareImage?.url || seoData.seo?.shareImage?.url || seoData.shareImage?.[0]?.url ? `${seoData.shareImage?.url || seoData.seo?.shareImage?.url || seoData.shareImage?.[0]?.url}` : null} 
        />
      )}
      <ScrollToTop />
      <AboutStart2
        src="images/filter.png "
        title="Ihr Auto Abo all-inclusive, flexibel und einfach"
        paragraph="Finden Sie Ihr passendes Fahrzeug, schweizweit geliefert und bei jeder offiziellen Markenvertretung gewartet."
        mobileSrc="images/filterMobile.png"
      />
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col xl:flex-row md:gap-8 lg:gap-12 py-30">
          <FilterPanel filters={memoizedFilters} setFilters={setFilters} />
          <div className="flex-1 mt-6 md:mt-0">
            <CarList filters={memoizedFilters} pricingType={pricingType} />
          </div>
        </div>
      </div>
      <Abonnieren />
      <Nachrichten />
    </div>
  );
};

export default FilteredCarPage;
