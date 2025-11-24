import React, { useState } from "react";

const Unverbindlich = () => {
  const backendURL = import.meta.env.VITE_APP_API_URL;

  const [formData, setFormData] = useState({
    firma: "",
    ansprechperson: "",
    email: "",
    telefon: "",
    kategorie: "",
    dauer: "",
    nachricht: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, kategorie: category }));
    setIsDropdownOpen(false);
  };

  const categories = [
    "Kleinwagen",
    "Kompakt Classic",
    "Kompakt Premium",
    "Kombi Classic",
    "Elektro Classic",
    "Nutzfahrzeug Kompakt",
    "SUV Classic",
    "Nutzfahrzeug",
    "Elektro Premium",
    "Kombi Premium",
    "SUV Premium",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // UPDATED: All attributes are now included in the message body on new lines
    const formattedMessage = `
Firma: ${formData.firma}
Ansprechperson: ${formData.ansprechperson}
E-Mail: ${formData.email}
Telefon: ${formData.telefon}
Kategorie: ${formData.kategorie || "-"}
Dauer: ${formData.dauer || "-"}

Nachricht:
${formData.nachricht || "-"}
    `.trim();

    const apiPayload = {
      name: formData.ansprechperson,
      emailAddress: formData.email,
      phoneNumber: formData.telefon,
      message: formattedMessage,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${backendURL}/api/email-service/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Anfrage erfolgreich gesendet! Wir melden uns umgehend.",
        });
        setFormData({
          firma: "",
          ansprechperson: "",
          email: "",
          telefon: "",
          kategorie: "",
          dauer: "",
          nachricht: "",
        });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        let errorMessage = "Fehler beim Senden der Anfrage.";

        if (data?.error?.message) {
          errorMessage = data.error.message;
        } else if (typeof data.error === "string") {
          errorMessage = data.error;
        }

        setSubmitStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      let errorMessage = "Verbindungsfehler. Bitte erneut versuchen.";
      if (error.name === "AbortError")
        errorMessage = "Zeitüberschreitung. Server antwortet nicht.";

      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16">
      <div className="bg-[#0847A4] rounded-xl py-[50px] px-[20px] md:py-[100px] md:px-[65px] container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Text Section */}
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-2">
            Jetzt unverbindlich
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white/30 mb-8">
            anfragen
          </h2>
          <p className="text-lg md:text-xl mb-12 text-white">
            Teilen Sie uns kurz Ihre Anforderungen mit - wir melden uns <br />
            umgehend mit einem passenden Angebot.
          </p>
          <div className="space-y-6 mt-[112px]">
            <div>
              <p className="text-[20px] text-white/30 mb-1">E-Mail</p>
              <a
                href="mailto:info@navigas-mobility.ch"
                className="text-xl md:text-2xl text-white hover:underline"
              >
                info@navigas-mobility.ch
              </a>
            </div>
            <div>
              <p className="text-[20px] text-white/30 mb-1">Telefon</p>
              <a
                href="tel:0417803133"
                className="text-xl md:text-2xl text-white hover:underline"
              >
                041 780 31 33
              </a>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Message Area */}
            {submitStatus && (
              <div
                className={`rounded-lg p-4 text-center text-sm font-medium mb-6 ${
                  submitStatus.type === "success"
                    ? "bg-green-500/20 text-green-100 border border-green-500/30"
                    : "bg-red-500/20 text-red-100 border border-red-500/30"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm mb-2">Firma *</label>
                <input
                  type="text"
                  name="firma"
                  value={formData.firma}
                  onChange={handleChange}
                  placeholder="Firma Name"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors bg-[#0847A4] disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-2">
                  Ansprechperson *
                </label>
                <input
                  type="text"
                  name="ansprechperson"
                  value={formData.ansprechperson}
                  onChange={handleChange}
                  placeholder="Ansprechperson Name"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors bg-[#0847A4] disabled:opacity-70"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ihre E-Mail"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors bg-[#0847A4] disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  placeholder="Ihre Telefonnummer"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors bg-[#0847A4] disabled:opacity-70"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-white text-sm mb-2">
                  Kategorie
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 text-left border border-white/10 rounded-lg text-white bg-[#0847A4] hover:bg-[#0a52be] focus:outline-none focus:border-blue-400 transition-colors flex justify-between items-center disabled:opacity-70"
                >
                  <span
                    className={
                      formData.kategorie ? "text-white" : "text-gray-400"
                    }
                  >
                    {formData.kategorie || "Fahrzeugkategorie wählen"}
                  </span>
                  <svg
                    className={`w-5 h-5 text-white transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && !isSubmitting && (
                  <div className="absolute z-50 w-full mt-2 bg-[#003380] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className="px-4 py-3 text-white hover:bg-[#0847A4] cursor-pointer transition-colors border-b border-white/5 last:border-none"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Dauer</label>
                <input
                  type="text"
                  name="dauer"
                  value={formData.dauer}
                  onChange={handleChange}
                  placeholder="Monate"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors bg-[#0847A4] disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm mb-2">Nachricht</label>
              <textarea
                name="nachricht"
                value={formData.nachricht}
                onChange={handleChange}
                placeholder="Haben Sie besondere Wünsche?"
                rows="4"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none bg-[#0847A4] disabled:opacity-70"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-[#0047AB] tracking-[4px] font-bold text-sm py-4 rounded-full hover:bg-gray-100 transition-colors uppercase flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "WIRD GESENDET..." : "ANFRAGE SENDEN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Unverbindlich;
