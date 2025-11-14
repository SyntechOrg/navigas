import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("");

  const subscribe = async () => {
    if (!email) {
      setStatus("Bitte geben Sie Ihre E-Mail-Adresse ein.");
      return;
    }
    if (!agreed) {
      setStatus("Bitte stimmen Sie der Datenschutzrichtlinie zu.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Erfolgreich angemeldet!");
        setEmail("");
        setAgreed(false);
      } else {
        setStatus("Fehler beim Anmelden. Bitte versuchen Sie es später.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Fehler beim Anmelden. Bitte versuchen Sie es später.");
    }
  };

  return (
    <div className="bg-[#0A1424]">
      <hr className="w-full text-[#2860B7]" />

      {/* Social Links */}
      <div className="flex flex-row items-center justify-around w-full bg-[#0847A4] text-xs md:text-sm text-white">
        {/* Social links code remains unchanged */}
        <div className="px-full py-[40px] w-full">
          <a
            href="https://www.facebook.com/navigasmobility"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center justify-center transition-all duration-300 hover:scale-105 hover:opacity-80"
          >
            <img src="/images/fb.svg" alt="Facebook" />
            <h1>Facebook</h1>
          </a>
        </div>

        <div className="px-full py-[40px] border-[#2860B7] border-x w-full">
          <a
            href="https://x.com/navigasmobility"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center justify-center transition-all duration-300 hover:scale-105 hover:opacity-80"
          >
            <img src="/images/x.svg" alt="Twitter (X)" />
            <h1>Twitter (X)</h1>
          </a>
        </div>

        <div className="px-full py-[40px] border-gray-500 border-r w-full">
          <a
            href="https://linkedin.com/showcase/navigas-mobility"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center justify-center transition-all duration-300 hover:scale-105 hover:opacity-80"
          >
            <img src="/images/in.svg" alt="LinkedIn" />
            <h1>LinkedIn</h1>
          </a>
        </div>

        <div className="px-full py-[40px] w-full">
          <a
            href="https://www.instagram.com/navigas_mobility"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center justify-center transition-all duration-300 hover:scale-105 hover:opacity-80"
          >
            <img src="/images/insta.svg" alt="Instagram" />
            <h1>Instagram</h1>
          </a>
        </div>
      </div>

      {/* Footer Main Content */}
      <div className="container">
        <div className="grid xl:grid-cols-4 md:grid-cols-4 grid-cols-1 gap-12 md:gap-8 py-[100px] justify-items-center">
          {/* Logo */}
          <Link
            to="/"
            className="transition-transform duration-300 hover:scale-110"
          >
            <img src="/images/navigasLogo.svg" alt="Navigas Logo" />
          </Link>

          {/* Location & Contact */}
          <div className="flex flex-col items-center md:items-start gap-5">
            <a
              href="https://www.google.com/maps/place/Navigas+Services+GmbH/@47.0351554,7.3137264,372m/data=!3m1!1e3!4m15!1m8!3m7!1s0x478e3d6921830919:0x7d190d005a83c382!2sCh%C3%BCsseberg+19,+3267+Seedorf,+Switzerland!3b1!8m2!3d47.0356412!4d7.3152196!16s%2Fg%2F11kq0cqktw!3m5!1s0x479000492f8060ef:0xf5db510a1153c7fd!8m2!3d47.0356502!4d7.3152065!16s%2Fg%2F11hzvdrc9_?entry=ttu&g_ep=EgoyMDI1MTExMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <h1 className="text-[19px] font-medium text-white text-center md:text-start">
                Standort
              </h1>
              <p className="text-[#727578] text-[17px] text-center md:text-start group-hover:text-[#2860B7] transition-colors">
                Navigas Services GmbH
                <br />
                Chüsseberg 19
                <br />
                CH-3267 Seedorf BE
              </p>
            </a>
            <a
              href="mailto:info@navigas-mobility.ch"
              className="text-[#E8EBF1] group"
            >
              <p className="group-hover:text-[#2860B7] transition-colors">
                info@navigas-mobility.ch
              </p>
            </a>
            <a href="tel:+41417803133" className="text-[#E8EBF1] group">
              <p className="group-hover:text-[#2860B7] transition-colors">
                +41 (0) 41 780 31 33
              </p>
            </a>
          </div>

          {/* Quick Links */}
          <div className="text-[#E8EBF1] flex flex-col gap-5 text-center md:text-start">
            <h1 className="font-semibold">Schnellzugriffe</h1>
            {[
              { to: "/privatkunden", text: "Privatkunden" },
              { to: "/autoAboPro", text: "Auto Abo Pro" },
              { to: "/flexrent", text: "Flex Rent" },
              { to: "/uberuns", text: "Über Uns" },
              { to: "/faq", text: "FAQ" },
              { to: "/kontakt", text: "Kontakt" },
            ].map((link) => (
              <Link key={link.text} to={link.to} className="group">
                <p className="transition-all duration-300 group-hover:text-[#2860B7] group-hover:translate-x-1">
                  {link.text}
                </p>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div className="text-[#E8EBF1] text-center md:text-start">
            <h1>Newsletter</h1>
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-4 border-b border-[#999FA8] hover:border-[#2860B7] transition-colors">
                <input
                  placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                  type="email"
                  className="text-[#8E8E8E] w-full bg-transparent focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <img
                  src="/images/shigjeta.svg"
                  alt="submit"
                  onClick={subscribe}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="flex flex-row gap-2 mt-[20px] items-start">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />
                <h1 className="text-[#8E8E8E] text-[12px]">
                  Ich stimme zu, dass die{" "}
                  <Link
                    to="/datenschutz"
                    className="text-[#E8EBF1] underline hover:text-[#2860B7]"
                  >
                    Datenschutzrichtlinie
                  </Link>{" "}
                  gilt.
                </h1>
              </div>
              {status && (
                <p className="mt-2 text-sm text-[#E8EBF1]">{status}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col">
          <div className="h-[1px] w-full bg-[#273243]"></div>
          <div className="py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-10">
              <h1 className="text-[#8E8E8E] text-sm md:text-base">
                <span className="text-[#E8EBF1]">Navigas Services GmbH</span> ©
                2025. Alle Rechte vorbehalten.
              </h1>
              <a
                href="https://syn-tech.ch/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8E8E8E] hover:text-white transition-colors text-sm md:text-base"
              >
                Entworfen von: SyntechSolutions AG
              </a>
            </div>
            <div className="text-[#8E8E8E] flex flex-row items-center justify-center md:justify-end gap-5 text-sm md:text-base">
              <Link
                to="/datenschutz"
                className="hover:text-[#E8EBF1] transition-colors"
              >
                Datenschutz
              </Link>
              <Link
                to="/impressum"
                className="hover:text-[#E8EBF1] transition-colors"
              >
                Impressum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
