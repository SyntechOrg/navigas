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
    <div className="bg-white md:py-25 py-15 rounded-xl w-full max-w-[1920px] mx-auto">
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={50}
        slidesPerView={3}
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
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {partners.map((logo, i) => (
          <SwiperSlide key={i} className="flex flex-col items-center px-20">
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
