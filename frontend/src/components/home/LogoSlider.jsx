import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../car/Constans";
import { normalizeCarData } from "../car/ImageHelpers";

const LogoSlider = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [swiperRef, setSwiperRef] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const query = new URLSearchParams({
          "populate[cars][populate][Image][populate]": "*",
        });

        const { data } = await axios.get(
          `${API_BASE}/api/top-kategorien?${query.toString()}`
        );

        const rawCars =
          data?.data?.attributes?.cars?.data ||
          data?.data?.cars?.data ||
          data?.data?.cars ||
          [];

        const normalizedCars = normalizeCarData(
          Array.isArray(rawCars) ? rawCars : [rawCars]
        );

        const slides = normalizedCars.map((car) => {
          const model = [car.marke, car.modell].filter(Boolean).join(" ").trim();
          const price = car.preis || car.price;

          return {
            id: car.documentId || car.id || model,
            src: car.imageUrl || "/images/car.png",
            alt: model || "Car",
            model: model || "Car",
            price: price ? `Ab ${price} CHF/Monat` : "",
          };
        });

        setFeaturedCars(slides);
      } catch (error) {
        console.error("Error fetching car slider data:", error);
      }
    };

    fetchCars();
  }, []);

  if (featuredCars.length === 0) {
    return null;
  }

  return (
    <div
      className="bg-white md:py-25 py-15 rounded-xl w-full  mx-auto"
      onMouseEnter={() => swiperRef?.autoplay.stop()}
      onMouseLeave={() => swiperRef?.autoplay.start()}
    >
      <Swiper
        onSwiper={setSwiperRef}
        modules={[Autoplay, FreeMode]}
        spaceBetween={30}
        slidesPerView={5}
        loop={true}
        freeMode={{
          enabled: true,
          momentum: false,
        }}
        allowTouchMove={false}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={2000}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
          1536: {
            slidesPerView: 5,
          },
        }}
      >
        {featuredCars.map((car, index) => (
          <SwiperSlide
            key={car.id || index}
            className="flex flex-col items-center px-4"
          >
            {car.src && (
              <img
                className="h-auto w-auto object-contain"
                src={car.src}
                alt={car.alt}
              />
            )}
            <h1 className="text-center text-[20px] font-bold mb-2">
              {car.model}
            </h1>
            <p className="text-center">{car.price}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LogoSlider;
