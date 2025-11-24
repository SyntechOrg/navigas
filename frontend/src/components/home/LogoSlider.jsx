import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

const partners = [
  {
    src: "/images/car1.png",
    alt: "Partner 1",
    model: "BMW X3",
    price: "Ab 899 CHF/Monat",
  },
  {
    src: "/images/car2.png",
    alt: "Partner 2",
    model: "Audi A4",
    price: "Ab 799 CHF/Monat",
  },
  {
    src: "/images/car3.png",
    alt: "Partner 3",
    model: "Mercedes C-Klasse",
    price: "Ab 899 CHF/Monat",
  },
  {
    src: "/images/car1.png",
    alt: "Partner 1",
    model: "BMW X3",
    price: "Ab 899 CHF/Monat",
  },
  {
    src: "/images/car2.png",
    alt: "Partner 2",
    model: "Audi A4",
    price: "Ab 799 CHF/Monat",
  },
  {
    src: "/images/car3.png",
    alt: "Partner 3",
    model: "Mercedes C-Klasse",
    price: "Ab 899 CHF/Monat",
  },
];

const LogoSlider = () => {
  return (
    <div className="bg-white md:py-25 py-15 rounded-xl w-full  mx-auto">
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={30} // Reduced from 50 to fit 5 items better
        slidesPerView={5} // Default set to 5
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
            slidesPerView: 5, // Shows 5 cars on large screens
          },
        }}
      >
        {partners.map((logo, i) => (
          // Changed px-20 to px-4 so images aren't too small
          <SwiperSlide key={i} className="flex flex-col items-center px-4">
            <img
              className="h-auto w-auto object-contain"
              src={logo.src}
              alt={logo.alt}
            />
            {/* <h1 className="text-center text-[20px] font-bold mb-2">
              {logo.model}
            </h1>
            <p className="text-center">{logo.price}</p> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LogoSlider;
