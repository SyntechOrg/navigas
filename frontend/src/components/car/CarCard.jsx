import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PRICING_TYPE } from "./Constans";

export const CarCard = memo(({ car, pricingType = PRICING_TYPE.NORMAL }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/api/cars/${car.documentId}?pricing=${pricingType}`);
  }, [navigate, car.documentId, pricingType]);
  console.log("my car " + JSON.stringify(car, null, 2));

  const handleImgError = (e) => (e.target.src = "/images/car.png");

  return (
    <motion.div
      className="p-2 cursor-pointer"
      onClick={handleClick}
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-[#0A1424] rounded-xl  shadow-2xl overflow-hidden transition hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="relative overflow-hidden">
          <motion.img
            src={car.imageUrl}
            alt={`${car.marke} ${car.modell}`}
            className="w-full h-48 object-cover"
            loading="lazy"
            onError={handleImgError}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <div className="py-5 border-b border-[#152032] w-[90%] mx-auto flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-white font-medium text-[20px] tracking-[2px]">
              {car.displayPrice + " CHF"}
            </h1>
            <p className="text-white text-[10px]">
              pro Monat{" "}
              {pricingType === PRICING_TYPE.NORMAL
                ? "inkl. MwSt."
                : "exkl. MwSt."}
            </p>
          </div>
          <h1 className="text-white font-medium text-[15px] truncate">
            {car.marke} {car.modell}
          </h1>
          <h1 className="text-[#C0C0C1] text-[14px]">{car.Getriebe}</h1>
        </div>
        <div className="py-3 w-[80%] mx-auto flex justify-between">
          {[
            { icon: "/images/psIcon.svg", text: `${car.leistung} PS` },
            { icon: "/images/pumpIcon.svg", text: car.Treibstoff },
            { icon: "/images/typeIcon.svg", text: `${car.Getriebe} ` },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex flex-col-reverse items-center gap-2 transition-transform hover:-translate-y-1"
            >
              <p className="text-[#C0C0C1] text-[12px]">{stat.text}</p>
              <img
                src={stat.icon}
                alt=""
                className="w-7 transition-transform hover:scale-115 hover:rotate-6"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
