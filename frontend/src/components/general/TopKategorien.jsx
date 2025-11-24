import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRICING_TYPE } from "../car/Constans";

const TopKategorien = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // FIX FOR 400 ERROR:
    // 1. Changed 'car' to 'cars' (Plural) because you switched to "One-to-Many".
    // 2. Simplified the query to just "populate everything inside cars" to ensure it works.
    const query = new URLSearchParams({
      "populate[cars][populate][Image][populate]": "*", 
    });

    fetch(`https://navigas-strapi.syn-tech.ch/api/top-kategorien?${query.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Status ${response.status}: Check if field is named 'car' or 'cars'`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.data) {
          // Check for 'cars' (plural) first, then fallback to 'car'
          const carsData = data.data.cars || data.data.car || [];
          setFeaturedCars(Array.isArray(carsData) ? carsData : [carsData]);
        }
      })
      .catch((error) => console.error("Error fetching featured cars:", error));
  }, []);

  const handleCardClick = (car) => {
    const id = car.documentId || car.id;
    if (!id) return;

    navigate(`/api/cars/${id}?pricing=${PRICING_TYPE.NORMAL}`);
  };

  const getOptimizedImageUrl = (car) => {
    let img = car.Image;

    if (!img) return "/images/container1.png";

    // Handle if it's an array (Multiple Media)
    if (Array.isArray(img)) {
      if (img.length === 0) return "/images/container1.png";
      img = img[0];
    }

    let targetUrl = img.url;
    
    // Use optimized formats if available
    if (img.formats) {
      if (img.formats.medium?.url) targetUrl = img.formats.medium.url;
      else if (img.formats.small?.url) targetUrl = img.formats.small.url;
      else if (img.formats.thumbnail?.url) targetUrl = img.formats.thumbnail.url;
    }

    if (!targetUrl) return "/images/container1.png";

    if (targetUrl.startsWith("/")) {
      return `https://navigas-strapi.syn-tech.ch${targetUrl}`;
    }

    return targetUrl;
  };

  return (
    <div className="relative">
      <img
        src="/images/topBg.png"
        alt=""
        className="w-full object-cover absolute -z-1 h-full"
      />
      <div className="flex items-center justify-center md:py-25 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-[54px] font-semibold text-white text-center mb-6 md:mb-8 lg:mb-10">
            Top-Fahrzeuge
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {featuredCars.map((car) => (
              <div
                key={car.id || Math.random()}
                className="flex flex-col justify-between items-start gap-2 md:gap-[10px] cursor-pointer"
               
              >
                <div  onClick={() => handleCardClick(car)} className="overflow-hidden rounded-md w-full aspect-video bg-white flex items-center justify-center">

                  <img
                    src={getOptimizedImageUrl(car)}
                    alt={car.marke || "Car"}
                    loading="lazy"
                    decoding="async"
                    className="w-[80%] h-[80%] object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <h1 className="uppercase text-xs md:text-[14px] text-white">
                  {car.Fahrzeugart}
                </h1>

                <p className="font-bold text-base md:text-lg lg:text-[20px] text-white">
                  {car.preis} CHF/Monat
                </p>

                <div className="text-[#B0CCF8] text-xs md:text-[14px] flex flex-row items-center justify-start gap-2 flex-wrap">
                  <h1>{car.marke}</h1>
                  <img src="/images/dot.svg" alt="" />
                  <a href="/FlexRentFactsheetNavigasMobility.pdf" target="_blank"  download>
                  <span  className="text-gray-400 hover:text-white transition-all duration-300">
                    Details im Factsheet (Download PDF)
                  </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopKategorien;
