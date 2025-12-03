import React from "react";
import { Link } from "react-router-dom";

const AboutStart3 = ({ src, mobileSrc, title, paragraph }) => {
  return (
    <div className="relative">
      <img src={mobileSrc} alt="" className="block sm:hidden w-full" />
      <img
        src={src}
        alt=""
        className="hidden sm:block sm:h-[600px] w-full max-lg:h-auto"
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[90%] md:w-full flex flex-col items-center">
        <h1 className="text-white text-center z-[99] lg:text-[80px] md:text-[64px] text-[32px] font-medium">
          {title}
        </h1>
        <p className="text-center font-medium text-white text-[16px] mt-10 md:text-[24px] z-[99]">
          {paragraph}
        </p>
        <Link to="/privatkunden">
          <button className="relative mt-10 text-[14px] md:text-[16px] hover:cursor-pointer bg-transparent border border-white rounded-lg px-5 py-2 text-white font-medium overflow-hidden group transition-all duration-300">
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            <span className="relative z-10">Fahrzeuge entdecken</span>
          </button>
        </Link>
      </div>

      <img
        className="absolute w-full h-full z-[9] bottom-0"
        src="/images/Gradient.png"
        alt=""
      />
    </div>
  );
};

export default AboutStart3;
