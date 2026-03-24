import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE, PRICING_TYPE } from "../car/Constans";
import { toAbsolute } from "../car/ImageHelpers";

const TopKategorien = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSliderCars = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/car-sliders?populate=*`
        );

        const mapped =
          data?.data?.map((item) => {
            const attrs = item?.attributes || item || {};

            const imageField =
              attrs?.bild || attrs?.Bild || attrs?.image || attrs?.Image;

            let imageUrl = "";
            if (imageField) {
              const imgData = imageField.data || imageField;
              const singleImage = Array.isArray(imgData) ? imgData[0] : imgData;

              if (singleImage) {
                const imgAttrs = singleImage.attributes || singleImage;
                imageUrl =
                  imgAttrs?.url ||
                  imgAttrs?.formats?.small?.url ||
                  imgAttrs?.formats?.thumbnail?.url;
              }
            }

            const rawPrice =
              attrs?.preis || attrs?.Preis || attrs?.price || attrs?.Price;
            const formattedPrice = rawPrice
              ? String(rawPrice).match(/^\d+$/)
                ? `Ab ${rawPrice} CHF/Monat`
                : rawPrice
              : "";

            const name =
              attrs?.modell ||
              attrs?.Modell ||
              attrs?.model ||
              attrs?.marke ||
              "";

            return {
              id: item?.documentId || item?.id || name,
              slug: attrs?.slug || "",
              imageUrl: toAbsolute(imageUrl) || "/images/container1.png",
              price: formattedPrice,
              name: name || "Car",
            };
          }) || [];

        setFeaturedCars(mapped);
      } catch (error) {
        console.error("Error fetching featured cars:", error);
      }
    };

    fetchSliderCars();
  }, []);

  const handleCardClick = (car) => {
    const routeParam = (car.slug && car.slug !== "null") ? car.slug : car.id;
    if (!routeParam) return;

    navigate(`/fahrzeuge/${routeParam}?pricing=${PRICING_TYPE.NORMAL}`);
  };

  const getOptimizedImageUrl = (car) => {
    if (car.imageUrl) return car.imageUrl;

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
      else if (img.formats.thumbnail?.url)
        targetUrl = img.formats.thumbnail.url;
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
          <h1 className="text-3xl md:text-4xl lg:text-[54px] font-semibold text-white text-center mb-8 md:mb-11 lg:mb-16">
            Top-Fahrzeuge
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {featuredCars.map((car) => (
              <div
                key={car.id || Math.random()}
                className="flex flex-col justify-between items-start gap-2 md:gap-[10px] cursor-pointer"
              >
                <div className="overflow-hidden rounded-md w-full aspect-video bg-white flex items-center justify-center">
                  <img
                    src={getOptimizedImageUrl(car)}
                    alt={car.marke || "Car"}
                    loading="lazy"
                    decoding="async"
                    className="w-[80%] h-[80%] object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <h1 className="uppercase text-xs md:text-[14px] text-white">
                  {car.name}
                </h1>

                <p className="font-bold text-base md:text-lg lg:text-[20px] text-white">
                  {car.price || "Preis auf Anfrage"}
                </p>

                <div className="text-[#B0CCF8] text-xs md:text-[14px] flex flex-row items-center justify-start gap-2 flex-wrap">
                  {/* <h1>{car.name}</h1>
                  <img src="/images/dot.svg" alt="" /> */}
                  <a
                    href="/FlexRentFactsheetNavigasMobility.pdf"
                    target="_blank"
                    download
                  >
                    <span className="text-gray-400 hover:text-white transition-all duration-300">
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
