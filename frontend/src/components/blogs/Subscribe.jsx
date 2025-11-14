import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Custom hook to detect mobile screens
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");

    const onChange = () => {
      setIsMobile(window.innerWidth < 768);
    };

    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < 768);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};

const Subscribe = () => {
  const isMobile = useIsMobile();
  const Container = isMobile ? "div" : motion.div;
  const Image = isMobile ? "img" : motion.img;
  const Heading = isMobile ? "h1" : motion.h1;
  const Paragraph = isMobile ? "p" : motion.p;
  const InputWrapper = isMobile ? "div" : motion.div;
  const Input = isMobile ? "input" : motion.input;
  const Button = isMobile ? "button" : motion.button;

  // Newsletter subscription state
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = async () => {
    if (!email) {
      setStatus({
        message: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
        type: "error",
      });
      return;
    }
    if (!agreed) {
      setStatus({
        message: "Bitte stimmen Sie der Datenschutzrichtlinie zu.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const response = await fetch(
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

      const data = await response.json();

      if (response.ok) {
        setStatus({
          message: "✓ Erfolgreich angemeldet! Vielen Dank für Ihre Anmeldung.",
          type: "success",
        });
        setEmail("");
        setAgreed(false);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setStatus({ message: "", type: "" });
        }, 5000);
      } else {
        setStatus({
          message:
            data.message ||
            data.error ||
            "Fehler beim Anmelden. Bitte versuchen Sie es später.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      setStatus({
        message: "Fehler beim Anmelden. Bitte versuchen Sie es später.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get status styling
  const getStatusStyles = () => {
    switch (status.type) {
      case "success":
        return "text-green-600 bg-green-50 border-green-300";
      case "error":
        return "text-red-600 bg-red-50 border-red-300";
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-300";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row items-stretch gap-6 md:gap-[30px] h-auto md:h-[500px] mb-20 px-0 md:px-0">
      <Container
        className="border border-[#D3D3D3] p-4 md:p-[20px] w-full md:w-1/2 flex-1 flex flex-col overflow-hidden"
        {...(!isMobile && {
          initial: { opacity: 0, x: -50 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.7, ease: "easeOut" },
        })}
      >
        <Image
          src="/images/subPhoto.png"
          alt=""
          className="w-full h-auto md:h-full object-cover rounded-md"
          {...(!isMobile && {
            whileHover: { scale: 1.03 },
            transition: { duration: 0.4 },
          })}
        />
      </Container>

      <Container
        className="border border-[#D3D3D3] p-6 md:p-[30px] flex-1 flex flex-col items-start justify-between gap-[50px] 2xl:gap-[60px] w-full md:w-1/2"
        {...(!isMobile && {
          initial: { opacity: 0, x: 50 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.7, ease: "easeOut" },
        })}
      >
        <div>
          <Heading
            className="text-2xl xl:text-[40px] lg:text-[30px] md:text-[20px] text-black leading-snug md:leading-normal"
            {...(!isMobile && {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: 0.2 },
            })}
          >
            Bleiben Sie mit unserem <br />
            Newsletter auf dem Laufenden
          </Heading>

          <Paragraph
            className="text-base 2xl:text-[20px] xl:text-[18px] md:text-[16px] lg:text-[18px] mt-6 md:mt-[32px] leading-relaxed md:leading-loose"
            {...(!isMobile && {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: 0.3 },
            })}
          >
            Entdecken Sie die Welt der modernen Mobilität <br />
            —mit aktuellen News, spannenden Trends und praktischen Tipps, die{" "}
            <br />
            informieren, inspirieren und den Blick in die Zukunft ermöglichen
            anstatt öffnen.
          </Paragraph>
        </div>

        <div className="w-full">
          <InputWrapper
            className="flex flex-col sm:flex-row items-start gap-5 md:gap-2 md:items-center justify-between w-full 2xl:w-[70%]"
            {...(!isMobile && {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: 0.4 },
            })}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="rounded-md px-4 py-3 border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              {...(!isMobile && {
                whileFocus: { scale: 1.02 },
                transition: { duration: 0.2 },
              })}
            />

            <Button
              type="button"
              onClick={subscribe}
              disabled={isLoading}
              className="rounded-md px-8 py-3 bg-[#0A1424] text-white md:text-[10px] lg:text-[15px] xl:text-lg font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              {...(!isMobile && {
                whileHover: !isLoading
                  ? {
                      backgroundColor: "#1a2534",
                      scale: 1.05,
                    }
                  : {},
                whileTap: !isLoading ? { scale: 0.98 } : {},
                transition: { duration: 0.2 },
              })}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Subscribing...
                </span>
              ) : (
                "Subscribe Now"
              )}
            </Button>
          </InputWrapper>

          {/* Checkbox for privacy policy */}
          <div className="flex items-start gap-2 mt-4 w-full 2xl:w-[70%]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              disabled={isLoading}
              className="cursor-pointer mt-1 disabled:cursor-not-allowed"
            />
            <p className="text-sm text-gray-600">
              Ich stimme zu, dass die{" "}
              <Link
                to="/datenschutz"
                className="text-[#0A1424] underline hover:text-blue-600"
              >
                Datenschutzrichtlinie
              </Link>{" "}
              gilt.
            </p>
          </div>

          {/* Status Message */}
          {status.message && (
            <div
              className={`mt-4 p-3 rounded-md text-sm border w-full 2xl:w-[70%] ${getStatusStyles()}`}
              role="alert"
            >
              {status.message}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Subscribe;
