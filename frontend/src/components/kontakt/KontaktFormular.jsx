import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function KontaktSection() {
  const backendURL = import.meta.env.VITE_APP_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    emailAddress: "",
    phoneNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Set a timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      console.log(JSON.stringify(formData));
      const response = await fetch(`${backendURL}/api/email-service/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Nachricht erfolgreich gesendet! Wir melden uns bald bei Ihnen.",
        });
        // Reset form on success - FIXED field names
        setFormData({
          name: "",
          emailAddress: "",
          phoneNumber: "",
          message: "",
        });

        // Auto-dismiss success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        // Handle specific HTTP error codes
        let errorMessage = "Fehler beim Senden der Nachricht.";

        if (response.status === 400) {
          errorMessage =
            data.error ||
            "Ungültige Eingabedaten. Bitte überprüfen Sie Ihre Angaben.";
        } else if (response.status === 500) {
          errorMessage = "Serverfehler. Bitte versuchen Sie es später erneut.";
        } else if (response.status === 503) {
          errorMessage =
            "Service vorübergehend nicht verfügbar. Bitte versuchen Sie es später.";
        } else {
          errorMessage = data.error || `Fehler: ${response.statusText}`;
        }

        setSubmitStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle different types of errors
      let errorMessage = "Verbindungsfehler. Bitte erneut versuchen.";

      if (error.name === "AbortError") {
        errorMessage =
          "Zeitüberschreitung. Der Server antwortet nicht. Bitte erneut versuchen.";
      } else if (error.message === "Failed to fetch") {
        errorMessage =
          "Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.";
      } else if (!navigator.onLine) {
        errorMessage =
          "Keine Internetverbindung. Bitte überprüfen Sie Ihre Verbindung.";
      }

      console.error("Form submission error:", error);

      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full">
      <img
        src="/images/KontaktBgg.png"
        alt=""
        className="hidden md:block h-[1200px] lg:h-[1100px] w-full xl:h-auto"
      />

      <img
        src="/images/form-mobile.png"
        alt=""
        className="block md:hidden h-[1400px] w-full"
      />

      <div className="absolute inset-0">
        <div className="mx-auto flex h-full w-full container flex-col justify-center gap-10 p-6 md:p-10">
          <div className="flex flex-row justify-between w-full items-center">
            <motion.div
              className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                className="mb-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex flex-row items-center justify-start gap-3">
                  <img src="/images/line.svg" alt="" />
                  <h1 className="text-[14px] uppercase text-[#0847A4]">
                    Die Fahrt beginnt hier
                  </h1>
                </div>
                <h1 className="text-[36px] font-semibold text-[#010101] md:text-[48px]">
                  Ihre Mobilität beginnt <br /> mit einem Klick
                </h1>
              </motion.div>

              <motion.div
                className="flex flex-col items-start justify-between gap-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="text-[#494B4E]">
                  Ob Beratung, individuelles Angebot oder Fahrzeuganfrage, wir
                  sind für Sie da. <br /> Füllen Sie das Formular aus, und wir
                  melden uns schnellstmöglich persönlich bei Ihnen.
                </p>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="rounded-3xl bg-[#000815CC]/90 p-6 backdrop-blur-xl ring-1 ring-white/10 md:p-8 lg:p-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Message Display */}
              <AnimatePresence mode="wait">
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl p-4 text-center font-medium ${
                      submitStatus.type === "success"
                        ? "bg-green-500/20 text-green-200 ring-1 ring-green-500/30"
                        : "bg-red-500/20 text-red-200 ring-1 ring-red-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {submitStatus.type === "success" ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span>{submitStatus.message}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="grid grid-cols-1 gap-5 md:grid-cols-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {[
                  {
                    label: "Name",
                    name: "name",
                    type: "text",
                    placeholder: "Geben Sie Ihren vollständigen Namen ein",
                    autoComplete: "name",
                  },
                  {
                    label: "Email Address",
                    name: "emailAddress",
                    type: "email",
                    placeholder: "Geben Sie Ihre E‑Mail‑Adresse ein",
                    autoComplete: "email",
                  },
                  {
                    label: "Phone Number",
                    name: "phoneNumber",
                    type: "tel",
                    placeholder: "Geben Sie Ihre Telefonnummer ein",
                    autoComplete: "tel",
                  },
                ].map((field, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <label className="text-white/90 mb-4 font-semibold">
                      {field.label}
                    </label>
                    <motion.input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="h-12 w-full rounded-xl px-4 text-white placeholder:text-white/50 placeholder:text-[12px] ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 bg-transparent transition-all"
                      autoComplete={field.autoComplete}
                      required
                      disabled={isSubmitting}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="text-sm text-white/90 mb-5 font-semibold">
                  Nachricht
                </label>
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Haben Sie besondere Wünsche?"
                  className="w-full rounded-xl p-4 text-white placeholder:text-white/50 ring-1 ring-white/10 placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-white/30 bg-transparent transition-all"
                  required
                  disabled={isSubmitting}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <motion.div
                className="pt-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[#0847A4] py-4 tracking-[0.4em] text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{
                    backgroundColor: isSubmitting ? "#0847A4" : "#0A5AC2",
                    scale: isSubmitting ? 1 : 1.02,
                  }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSubmitting ? "WIRD GESENDET..." : "SENDEN"}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
