import React from "react";

const Dabei = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-[#010101] text-2xl sm:text-3xl md:text-5xl lg:text-[54px] font-semibold text-center leading-snug">
        Finden Sie das passende Fahrzeug für Ihr Unternehmen
      </h1>

      <div className="flex items-center justify-center mt-0 sm:-mt-20  md:-mt-40">
        <img
          src="/images/veturat.png"
          alt="Auto Abo Pro"
          className="hidden lg:block w-[70%] h-auto"
        />
        <img
          src="/images/veturat.png"
          alt="Auto Abo Pro Mobile"
          className="block lg:hidden w-full h-auto"
        />
      </div>

      <div className="flex flex-row justify-center mt-5 md:-mt-25">
        <a href="/firmenkunden">
          <button
            className="rounded-xl bg-gradient-to-r text-[14px] md:text-[16px] from-[#0847A4] to-[#0a6fff] px-10 py-4 text-white
               shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            Fahrzeuge entdecken
          </button>
        </a>
      </div>
    </div>
  );
};

export default Dabei;
