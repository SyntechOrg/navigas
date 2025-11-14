import React, { useState } from "react";
import { Link } from "react-router-dom";

function Abonnieren() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:1337/api/email-service/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Website Subscriber",
            emailAdress: email,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(
          "Danke! Ihre Anfrage wurde erfolgreich übermittelt. Sie erhalten in Kürze eine Bestätigung per E-Mail."
        );
        setEmail("");
      } else {
        console.error(data);
        setMessage("Fehler: Bitte versuchen Sie es später erneut.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setMessage("Fehler: Bitte versuchen Sie es später erneut.");
    }
  };

  return (
    <div className="w-full bg-[#0847A4] border-t mt-0">
      <div className="container mx-auto flex flex-col xl:flex-row items-center lg:items-center justify-between py-[80px] lg:py-[140px] px-4 lg:px-0 gap-8 lg:gap-0">
        <div className="text-left">
          <h1 className="text-white font-bold text-[28px] mb-12 xl:mb-auto sm:text-[32px] lg:text-[36px] leading-tight text-center md:text-start">
            Abonnieren Sie die <br className="hidden xl:block" />
            exklusiven Updates!
          </h1>
        </div>

        <div className="w-full lg:w-auto">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-row gap-3 w-full items-center justify-between max-w-2xl">
              <div className="flex flex-col items-start justify-between w-full gap-[20px]">
                <div className="w-full">
                  <input
                    type="email"
                    placeholder="Geben Sie Ihre E-Mail Adresse ein"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 pl-4 py-3 w-full lg:w-[500px] border-b border-white text-[14px] sm:text-[16px] lg:text-[17px] text-white placeholder-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-row items-center justify-start gap-1">
                  <input type="checkbox" required />
                  <h1 className="text-[#879EC0] text-[10px] md:text-[14px]">
                    Ich stimme zu, dass die{" "}
                    <Link to="/datenschutz">
                      <span className="text-[#CAD9EF] underline">
                        Datenschutzrichtlinie .
                      </span>
                    </Link>
                  </h1>
                </div>
              </div>

              <button
                type="submit"
                className="flex flex-row items-center justify-center gap-3 px-5 py-3 bg-transparent text-white font-semibold text-[14px] whitespace-nowrap mt-2 sm:mt-0"
              >
                <img
                  src="/images/airoplani.svg"
                  alt="Subscribe"
                  className="w-8 h-8 md:w-5 md:h-5"
                />
                <h1 className="hidden md:block">Abonnieren</h1>
              </button>
            </div>

            {message && (
              <p className="text-white text-sm mt-2 max-w-[500px]">{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Abonnieren;
