import { useState } from "react";

const accordionItems = [
  {
    id: 1,
    title: "Versicherung & Carcare",
    icon: <img src="/images/icons11.svg" alt="" />,
    // We changed this from a string to a JSX object
    content: (
      <div className="space-y-2">
        <p className="font-semibold">Wir bieten Ihnen bestmöglichen Schutz:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Haftpflichtversicherung mit einem Selbstbehalt von CHF 0</li>
          <li>Grobfahrlässigkeitsschutz mit Kostendach</li>
          <li>
            Kollisionsschutz mit einem Selbstbehalt von CHF 500 (Geschäftskunden
            CHF 1'000)
          </li>
          <li>
            Schutz bei Glasbruch, Feuer, Diebstahl sowie Elementar- und
            Parkschäden mit einem Selbstbehalt von CHF 0
          </li>
          <li>
            Schutz bei Parkschäden (2 Ereignisse pro Jahr mit unbegrenzter
            Schadenhöhe)
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 2,
    title: "Wartung & Reparaturen",
    icon: <img src="/images/icons22.svg" alt="" />,
    // Simple strings still work fine with this method
    content:
      "Ist ein Service oder eine Reparatur nötig? Keine Sorgen. Alle Wartungs- und Reparaturarbeiten sind im Paket eingeschlossen. Nutzen Sie unser breites Partnernetzwerk von offiziellen Markenvertretungen.",
  },
  {
    id: 3,
    title: "Fahrzeugsteuer",
    icon: <img src="/images/icons33.svg" alt="" />,
    content:
      "Das Fahrzeug wird in Ihrem Wohnkanton eingelöst. Sie haben keinen Aufwand und keine Extrakosten und Sie erhalten keine Rechnung.",
  },
  {
    id: 4,
    title: "Assistance",
    icon: <img src="/images/icons44.svg" alt="" />,
    content:
      "Sie erhalten bei einer Panne oder einem Unfall garantiert vollumfängliche Unterstützung. Die Experten von Arval Assistance sind 7/24h telefonisch erreichbar. Der Pannen- und Unfalldienst ist für Sie in ganz Europa erreichbar.",
  },
  {
    id: 5,
    title: "Ersatzfahrzeug",
    icon: <img src="/images/icons55.svg" alt="" />,
    content:
      "Ihr Auto ist im Service oder in der Reparatur und Sie benötigen ein Ersatzfahrzeug? Das ist bei uns im Paketpreis inkludiert.",
  },
  {
    id: 6,
    title: "Fahrzeugnutzung",
    icon: <img src="/images/icons66.svg" alt="" />,
    content:
      "Am Vertragsende geben Sie Ihr Auto ganz einfach zurück. Sie tragen kein Risiko, dass Ihr Auto an Wert verloren hat und Sie dieses nun zu einem niedrigen Preis verkaufen müssten.",
  },
  {
    id: 7,
    title: "Zulassung",
    icon: <img src="/images/icons77.svg" alt="" />,
    content:
      "Ihr neues Auto wird in Ihrem Wohnkanton eingelöst. Die Nummernschilder und der Fahrzeugausweis werden für Sie organisiert. Sie haben keinen Aufwand und Null Zusatzkosten.",
  },
];

const AccordionItem = ({ item, isOpen, onToggle }) => {
  const { icon, title, content, id } = item;

  return (
    <div className="py-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left focus:outline-none group"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
      >
        <div className="flex items-center sm:gap-8">
          <div className="flex-shrink-0 border border-[#CEDAED] rounded-2xl p-3 mr-4 group-hover:border-blue-400 transition-colors">
            {icon}
          </div>
          <span className="text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
            {title}
          </span>
        </div>
        <div className="flex items-center">
          {/* Changed fixed width to flex-grow to avoid layout shifts */}
          <div className="hidden sm:block w-32 lg:w-45 xl:w-55 border-b-2 border-gray-200 mx-4"></div>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      <div
        id={`accordion-content-${id}`}
        // Increased max-h to ensure the list fits when open
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        {/* Removed the <p> tag wrapper so we can render divs/uls validly */}
        <div className="pt-4 text-gray-600 text-sm leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default function Accordion() {
  const [openId, setOpenId] = useState(null);

  const leftColumnItems = accordionItems.filter((_, index) => index % 2 === 0);
  const rightColumnItems = accordionItems.filter((_, index) => index % 2 !== 0);

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full container mx-auto bg-white font-sans md:mt-10 mt-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16 gap-y-4">
        <div>
          {leftColumnItems.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
        <div>
          {rightColumnItems.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
