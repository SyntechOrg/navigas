import React, { useId, useMemo, useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { PRICING_TYPE } from "./Constans";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function Dropdown({ name, label, options, value, onChange }) {
  const id = useId();
  const handleChange = useCallback((e) => onChange(e.target.value), [onChange]);
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-sm text-gray-600">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-600"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ImageWithFallback({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const handleError = useCallback(() => setFailed(true), []);
  return failed ? (
    <div
      aria-label="image unavailable"
      className={cx(
        "grid place-items-center bg-gray-100 text-gray-400",
        className
      )}
    >
      <span className="text-xs">No image</span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={handleError}
      className={cx("h-full w-full object-cover", className)}
    />
  );
}

export default function PolestarCard({
  title = "Polestar 2",
  subtitle = "Long Range Dual Motor",
  images = [],
  kmPricingOptions = [],
  termPricingOptions = [],
  basePrice = 749,
  buttonLabel = "Jetzt wählen",
  carData,
  onSelect,
  pricingType = PRICING_TYPE.NORMAL,
}) {
  const [imageIndex, setImageIndex] = useState(0);

  // Helper to find default or fallback
  const getDefaultKm = useCallback(
    () =>
      kmPricingOptions.some((o) => o.km === 5000)
        ? 5000
        : kmPricingOptions[0]?.km || 5000,
    [kmPricingOptions]
  );

  const getDefaultTerm = useCallback(
    () =>
      termPricingOptions.some((o) => o.months === 48)
        ? 48
        : termPricingOptions[0]?.months || 24,
    [termPricingOptions]
  );

  const [selectedKm, setSelectedKm] = useState(getDefaultKm);
  const [selectedTerm, setSelectedTerm] = useState(getDefaultTerm);

  const imagesKey = useMemo(() => images.map((i) => i.src).join(","), [images]);
  const gallery = useMemo(
    () => (images.length ? images : [{ src: "", alt: "placeholder" }]),
    [imagesKey]
  );

  useEffect(() => setImageIndex(0), [imagesKey]);

  useEffect(() => {
    if (kmPricingOptions.length) {
      setSelectedKm(getDefaultKm());
    }
  }, [kmPricingOptions, getDefaultKm]);

  useEffect(() => {
    if (termPricingOptions.length) {
      setSelectedTerm(getDefaultTerm());
    }
  }, [termPricingOptions, getDefaultTerm]);

  // UPDATED: Fixed pricing lookup function (no calculations)
  const getPriceForCombination = useCallback(
    (term, km) => {
      if (!carData?.pricing) {
        console.warn("No pricing data available, using basePrice");
        return basePrice;
      }

      const key = `${term}-${km}`;
      const price = carData.pricing[key];

      if (price === undefined || price === null) {
        console.warn(
          `No price found for combination: ${term} months, ${km} km`
        );
        return basePrice;
      }

      return Number(price);
    },
    [carData, basePrice]
  );

  // UPDATED: Direct lookup - no additions or calculations
  const finalPrice = useMemo(
    () => getPriceForCombination(selectedTerm, selectedKm),
    [selectedTerm, selectedKm, getPriceForCombination]
  );

  const thumbnails = useMemo(() => {
    const len = gallery.length;
    if (len <= 1) return [];
    return gallery
      .map((_, idx) => idx)
      .filter((i) => i !== imageIndex)
      .slice(0, 2)
      .map((idx) => ({ idx, ...gallery[idx], key: `thumb-${idx}` }));
  }, [gallery, imageIndex]);

  const taxLabel =
    pricingType === PRICING_TYPE.COMPANY ? "exkl. MwSt." : "inkl. MwSt.";

  const handleSubmit = useCallback(() => {
    onSelect({
      kmPerYear: selectedKm,
      termMonths: selectedTerm,
      imageIndex,
      finalPrice,
    });
  }, [onSelect, selectedKm, selectedTerm, imageIndex, finalPrice]);

  const next = () => setImageIndex((i) => (i + 1) % gallery.length);
  const prev = () =>
    setImageIndex((i) => (i - 1 + gallery.length) % gallery.length);

  const handleKmChange = (v) => setSelectedKm(Number(v));
  const handleTermChange = (v) => setSelectedTerm(Number(v));

  const getImageBase64 = useCallback((url) => {
    return new Promise((res, rej) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        c.getContext("2d").drawImage(img, 0, 0);
        res(c.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => rej("Image load failed");
      img.src = url;
    });
  }, []);

  const richTextToLines = useCallback((content) => {
    if (!content) return [];

    if (Array.isArray(content)) {
      const combined = content
        .map((block) => {
          if (typeof block === "string") return block;
          if (block?.children && Array.isArray(block.children)) {
            return block.children.map((c) => c.text || "").join("");
          }
          return block?.text || "";
        })
        .filter(Boolean)
        .join("\n");

      return combined
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean);
    }

    if (typeof content === "string") {
      const normalized = content
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|li|ul|ol)>/gi, "\n")
        .replace(/<li[^>]*>/gi, "")
        .replace(/<[^>]+>/g, "");

      return normalized
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean);
    }

    return [String(content)];
  }, []);

  const featureSections = useMemo(() => {
    if (Array.isArray(carData?.features) && carData.features.length) {
      return carData.features
        .map((section) => {
          const title = section.title || section.Title || "Ausstattung";
          const lines = richTextToLines(section.features || section.Features);
          return { title, lines };
        })
        .filter((s) => s.lines.length || s.title);
    }

    if (Array.isArray(carData?.ausstattungen) && carData.ausstattungen.length) {
      return carData.ausstattungen
        .map((group) => {
          const title = group.title || group.Title || "Ausstattung";
          const lines = (group.items || [])
            .map((item) => (typeof item === "string" ? item : item?.text || ""))
            .filter(Boolean);
          return { title, lines };
        })
        .filter((s) => s.lines.length || s.title);
    }

    return [];
  }, [carData, richTextToLines]);

  const handleDownloadPDF = useCallback(async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Header
    doc.setFillColor(8, 71, 164);
    doc.rect(0, 0, w, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text(title, w / 2, 12, { align: "center" });
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text(subtitle, w / 2, 20, { align: "center" });
    doc.setFontSize(8);
    doc.text("Sofort verfügbar", w / 2, 26, { align: "center" });

    let y = 38;

    // Image
    try {
      const data = await getImageBase64(gallery[0].src);
      const imgProps = doc.getImageProperties(data);

      const maxWidth = 120; // Set your maximum width
      const imgWidth = maxWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width; // Calculate height based on aspect ratio

      const w = doc.internal.pageSize.getWidth();
      const x = (w - imgWidth) / 2;

      doc.setDrawColor(8, 71, 164).setLineWidth(0.5);
      doc.roundedRect(x - 2, y - 2, imgWidth + 4, imgHeight + 4, 3, 3);
      doc.addImage(data, "JPEG", x, y, imgWidth, imgHeight);

      y += imgHeight + 12; // Update y position based on the new calculated height
    } catch (e) {
      console.error(e);
      y += 45;
    }

    // Configuration section
    // --- Modern Configuration Section ---

    // 1. Header with a modern accent bar (Visual Anchor)
    doc.setDrawColor(8, 71, 164).setLineWidth(1);
    doc.line(20, y, 20, y + 5); // Blue vertical accent line
    doc.setFontSize(12).setFont(undefined, "bold").setTextColor(30, 30, 30);
    doc.text("Ihre Konfiguration", 24, y + 4); // Text offset from line

    y += 10;

    // 2. Container Box (Lighter, cleaner background)
    const boxHeight = 35;
    doc.setFillColor(248, 249, 252); // Very light blue/gray
    doc.setDrawColor(230, 230, 230); // Subtle border
    doc.roundedRect(20, y, w - 40, boxHeight, 3, 3, "FD");

    // 3. Grid Layout Calculation
    // We split the width into 3 equal columns for better symmetry
    const contentStart = 20;
    const contentWidth = w - 40;
    const colWidth = contentWidth / 3;

    // Helper to center text in a column
    const getColCenter = (colIndex) =>
      contentStart + colWidth * colIndex + colWidth / 2;
    const labelY = y + 10;
    const valueY = y + 22;

    // --- Column 1: Laufzeit (Term) ---
    doc.setFontSize(9).setFont(undefined, "normal").setTextColor(100, 100, 100); // Muted Label
    doc.text("LAUFZEIT", getColCenter(0), labelY, { align: "center" });

    doc.setFontSize(12).setFont(undefined, "bold").setTextColor(50, 50, 50); // Dark Value
    doc.text(`${selectedTerm} Monate`, getColCenter(0), valueY, {
      align: "center",
    });

    // Vertical Divider 1
    doc.setDrawColor(220, 220, 220).setLineWidth(0.1);
    doc.line(
      contentStart + colWidth,
      y + 8,
      contentStart + colWidth,
      y + boxHeight - 8
    );

    // --- Column 2: Laufleistung (KM) ---
    doc.setFontSize(9).setFont(undefined, "normal").setTextColor(100, 100, 100);
    doc.text("LAUFLEISTUNG", getColCenter(1), labelY, { align: "center" });

    doc.setFontSize(12).setFont(undefined, "bold").setTextColor(50, 50, 50);
    doc.text(
      `${selectedKm.toLocaleString("de-CH")} km/Jahr`,
      getColCenter(1),
      valueY,
      { align: "center" }
    );

    // Vertical Divider 2
    doc.line(
      contentStart + colWidth * 2,
      y + 8,
      contentStart + colWidth * 2,
      y + boxHeight - 8
    );

    // --- Column 3: Preis (Price) - The "Hero" Element ---
    doc.setFontSize(9).setFont(undefined, "normal").setTextColor(100, 100, 100);
    doc.text("MONATLICHE RATE", getColCenter(2), labelY, { align: "center" });

    // Make price larger and use brand color
    doc.setFontSize(14).setFont(undefined, "bold").setTextColor(8, 71, 164);
    doc.text(`CHF ${finalPrice.toFixed(2)}`, getColCenter(2), valueY, {
      align: "center",
    });

    // Move cursor down for next section
    y += boxHeight + 15;

    // Technical specs
    const specs = [
      { label: "Schaltung", val: carData.Getriebe },
      { label: "Reichweite", val: carData.reichweite },
      {
        label: "Leistung",
        val: carData.leistung ? `${carData.leistung} PS` : null,
      },
      {
        label: "Verbrauch",
        val: carData.verbrauch ? `${carData.verbrauch} L/100km` : null,
      },
      { label: "Türen", val: carData.turen },
      { label: "Treibstoff", val: carData.Treibstoff },
      // FIX: Changed from "CO₂-Kategorie" to "CO2-Kategorie" to prevent pdf spacing issues
      { label: "CO2-Kategorie", val: carData.COKategorie },
    ].filter((s) => s.val && s.val !== "N/A");

    if (specs.length > 0) {
      // 1. Consistent Section Header (Blue Accent Line)
      // This matches the "Ihre Konfiguration" header style
      doc.setDrawColor(8, 71, 164).setLineWidth(1);
      doc.line(20, y, 20, y + 5);
      doc.setFontSize(12).setFont(undefined, "bold").setTextColor(30, 30, 30);
      doc.text("Technische Daten", 24, y + 4);
      y += 12;

      // 2. Grid Configuration
      const contentStart = 20;
      const gap = 5; // Gap between cards
      const totalWidth = w - 40;
      const colCount = 3;
      // Calculate exact width for 3 cards + gaps
      const cardWidth = (totalWidth - gap * (colCount - 1)) / colCount;
      const cardHeight = 24; // Taller for better breathing room

      let row = 0;
      let col = 0;

      specs.forEach((s) => {
        const x = contentStart + col * (cardWidth + gap);
        const yy = y + row * (cardHeight + gap);

        // Card Background: Flat, Light Gray, No Border
        doc.setFillColor(248, 249, 252);
        doc.roundedRect(x, yy, cardWidth, cardHeight, 2, 2, "F");

        // Label: Uppercase, Small, Muted Gray, Centered
        doc
          .setFontSize(7)
          .setFont(undefined, "normal")
          .setTextColor(130, 130, 130);
        doc.text(s.label.toUpperCase(), x + cardWidth / 2, yy + 9, {
          align: "center",
        });

        // Value: Larger, Bold, Dark Gray, Centered
        doc.setFontSize(10).setFont(undefined, "bold").setTextColor(50, 50, 50);
        // Ensure value is a string to prevent errors
        doc.text(String(s.val), x + cardWidth / 2, yy + 17, {
          align: "center",
        });

        col++;
        if (col === colCount) {
          col = 0;
          row++;
        }
      });

      // Calculate total height used
      const totalRows = Math.ceil(specs.length / colCount);
      y += totalRows * (cardHeight + gap) + 15;
    }

    // ========== Ausstattung Features Section ==========
    // ... previous code (Technische Daten) ...

    // ========== Ausstattung Features Section (UPDATED) ==========
    if (featureSections.length > 0) {
      // We loop through sections immediately.
      // We do NOT print a generic "Ausstattung" header anymore.

      featureSections.forEach((section) => {
        // Check for page break
        if (y > h - 40) {
          doc.addPage();
          y = 20;
        }

        // Render the Title in the "Main Section" style (Vertical Blue Line + Bold Text)
        if (section.title) {
          doc.setDrawColor(8, 71, 164).setLineWidth(1);
          doc.line(20, y, 20, y + 5); // The Blue Vertical Accent

          doc
            .setFontSize(12)
            .setFont(undefined, "bold")
            .setTextColor(30, 30, 30);
          // Render the specific section title (e.g. "Multimedia") instead of generic "Ausstattung"
          doc.text(section.title, 24, y + 4);

          y += 10; // Add breathing room after the header
        }

        // Render the content lines
        if (section.lines.length) {
          doc
            .setFontSize(9)
            .setFont(undefined, "normal")
            .setTextColor(60, 60, 60);

          const textBlock = section.lines.map((line) => `- ${line}`).join("\n");
          const wrapped = doc.splitTextToSize(textBlock, w - 40);
          doc.text(wrapped, 24, y);

          const dimensions = doc.getTextDimensions(wrapped);
          const blockHeight =
            (dimensions && dimensions.h) || wrapped.length * 5 || 8;

          // Add extra space between this section and the next
          y += blockHeight + 12;
        } else {
          y += 3;
        }
      });
    }

    // ========== END: Ausstattung Features Section ==========

    // ========== Beschreibung (Editorial Style) ==========
    if (carData.beschreibung) {
      // Check page space
      if (y > h - 60) {
        doc.addPage();
        y = 20;
      }

      // Header
      doc.setDrawColor(8, 71, 164).setLineWidth(1);
      doc.line(20, y, 20, y + 5);
      doc.setFontSize(12).setFont(undefined, "bold").setTextColor(30, 30, 30);
      doc.text("Beschreibung", 24, y + 4);
      y += 10;

      // Content with subtle gray side-line (Editorial look)
      doc.setFontSize(9).setFont(undefined, "normal").setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(carData.beschreibung, w - 45);

      // Draw a thin gray line alongside the text
      const textHeight = descLines.length * 4.5;
      doc.setDrawColor(220, 220, 220).setLineWidth(0.5);
      doc.line(24, y, 24, y + textHeight); // Indented guide line

      // Text indented slightly from the gray line
      doc.text(descLines, 28, y + 3.5);

      y += textHeight + 20;
    }

    // Footer
    const fy = h - 30;
    doc
      .setDrawColor(8, 71, 164)
      .setLineWidth(0.3)
      .line(20, fy, w - 20, fy);
    doc
      .setFillColor(243, 245, 250)
      .roundedRect(15, fy + 3, w - 30, 22, 2, 2, "F");

    const date = new Date().toLocaleDateString("de-CH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc
      .setFontSize(8)
      .setTextColor(80, 80, 80)
      .setFont(undefined, "normal")
      .text(`Erstellt am ${date}`, 20, fy + 15)
      .text(`Alle Preise ${taxLabel}`, w / 2, fy + 15, { align: "center" })
      .setFont(undefined, "bold")
      .setFontSize(9)
      .setTextColor(8, 71, 164)
      .text("www.navigas-mobility.ch", w - 20, fy + 15, { align: "right" })
      .setFont(undefined, "italic")
      .setFontSize(7)
      .setTextColor(120, 120, 120);

    doc.save(`${title.replace(/\s/g, "_")}_Datenblatt.pdf`);
  }, [
    title,
    subtitle,
    gallery,
    selectedKm,
    selectedTerm,
    finalPrice,
    carData,
    featureSections,
    getImageBase64,
    taxLabel,
  ]);

  return (
    <section className="mx-auto rounded-xl container">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-[65%] w-full">
          <div className="grid gap-3 md:grid-cols-1">
            <div className="relative md:cols-span-2">
              <div className="aspect-[5/3] overflow-hidden rounded-lg bg-gray-100">
                <ImageWithFallback
                  src={
                    gallery[imageIndex].formats?.large?.url ||
                    gallery[imageIndex].src
                  }
                  alt={gallery[imageIndex].alt}
                  className="h-full w-full object-cover"
                />
              </div>
              {gallery.length > 1 && (
                <div className="absolute bottom-8 right-6 flex gap-4 pointer-events-none px-2">
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={prev}
                    className="pointer-events-auto flex h-10 w-13 items-center justify-center bg-[#0847A4] text-white rounded-full hover:bg-transparent transition"
                  >
                    ❮
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={next}
                    className="pointer-events-auto flex h-10 w-13 items-center justify-center bg-[#0847A4] text-white rounded-full hover:bg-transparent transition"
                  >
                    ❯
                  </button>
                </div>
              )}
            </div>
            {thumbnails.length > 0 && (
              <div className="grid grid-cols-2 gap-3 max-md:hidden">
                {thumbnails.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setImageIndex(t.idx)}
                    className="overflow-hidden rounded-lg ring-1 ring-gray-200 hover:ring-gray-300 transition"
                  >
                    <div className="aspect-[4/3]">
                      <ImageWithFallback src={t.src} alt={t.alt} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:w-[30%] w-full">
          <div className="mt-7 flex flex-col gap-2">
            <p className="text-xs text-[#0847A4] bg-[#0847A41A] py-1 px-4 rounded-xl w-fit">
              Sofort verfügbar
            </p>
            <h1 className="mt-1 lg:text-[40px] text-[30px] font-semibold text-gray-900">
              {title}
            </h1>
            <p className="text-[20px] text-black">{subtitle}</p>
          </div>
          <hr className="text-gray-300 mt-10" />
          <div className="grid gap-6 w-[60%] pt-7 pb-10">
            <Dropdown
              name="km"
              label="Km / Jahr"
              value={selectedKm}
              onChange={handleKmChange}
              options={kmPricingOptions.map((o) => ({
                value: o.km,
                label: `${o.km.toLocaleString("de-CH")} km`,
              }))}
            />
            <Dropdown
              name="term"
              label="Laufzeit"
              value={selectedTerm}
              onChange={handleTermChange}
              options={termPricingOptions.map((o) => ({
                value: o.months,
                label: `${o.months} Monate`,
              }))}
            />
          </div>
          <hr className="text-gray-300 mt-5" />
          <div className="mt-6 flex flex-col gap-4 pt-4 w-full">
            <div className="text-[#0847A4] font-semibold text-[28px] lg:text-[34px]">
              {finalPrice.toLocaleString("de-CH", {
                style: "currency",
                currency: "CHF",
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="text-[14px] font-light text-black">
              pro Monat {taxLabel}
            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 w-full rounded-md bg-[#0847A4] px-6 py-3 text-sm font-medium text-white hover:bg-black transition"
            >
              {buttonLabel}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="mt-2 w-full rounded-md border border-[#0847A4] px-6 py-3 text-sm font-medium text-[#0847A4] hover:bg-black hover:text-white transition inline-flex items-center justify-center"
            >
              <img src="/images/pdf.svg" alt="" className="mr-3" />
              Datenblatt PDF
            </button>
            <div className="mt-4 text-[14px] text-[#0847A4] font-medium">
              {carData?.extraPreisAutos}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
