import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../car/Constans";
import { toAbsolute } from "../car/ImageHelpers";

const LogoSlider = () => {
  const [partners, setPartners] = useState([]);
  const [swiperRef, setSwiperRef] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/car-sliders?populate=*`
        );

        if (data?.data) {
          const formattedData = data.data.map((item) => {
            const attrs = item?.attributes || item || {};

            const imageField =
              attrs?.bild || attrs?.Bild || attrs?.image || attrs?.Image;

            let imageUrl = "";
            if (imageField) {
              const data = imageField.data || imageField;
              const singleImage = Array.isArray(data) ? data[0] : data;

              if (singleImage) {
                const imgAttrs = singleImage.attributes || singleImage;
                imageUrl =
                  imgAttrs?.url ||
                  imgAttrs?.formats?.small?.url ||
                  imgAttrs?.formats?.thumbnail?.url;
              }
            }

            if (!imageUrl) {
              console.log("LogoSlider: No image found for", attrs?.modell, {
                imageField,
                attrs,
              });
            }

            const rawPrice =
              attrs?.preis || attrs?.Preis || attrs?.price || attrs?.Price;
            const formattedPrice = rawPrice
              ? String(rawPrice).match(/^\d+$/)
                ? `Ab ${rawPrice} CHF/Monat`
                : rawPrice
              : "";

            return {
              src: toAbsolute(imageUrl),
              alt: attrs?.modell || "Car Partner",
              model: attrs?.modell || attrs?.Modell || attrs?.model || "",
              price: formattedPrice,
            };
          });

          setPartners(formattedData);
        }
      } catch (error) {
        console.error("Error fetching car slider data:", error);
      }
    };

    fetchCars();
  }, []);

  if (partners.length === 0) {
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
        {partners.map((logo, i) => (
          <SwiperSlide key={i} className="flex flex-col items-center px-4">
            {logo.src && (
              <img
                className="h-auto w-auto object-contain"
                src={logo.src}
                alt={logo.alt}
              />
            )}
            <h1 className="text-center text-[20px] font-bold mb-2">
              {logo.model}
            </h1>
            <p className="text-center">{logo.price}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LogoSlider;
