"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "how-it-works", label: "How It Works" },
  { id: "architecture", label: "Architecture" },
  { id: "guardrails", label: "Guardrails" },
  { id: "cases", label: "Use Cases" },
  { id: "summary", label: "Summary" }
];

export default function QueryMindScrollSpy() {
  const [active, setActive] = useState("how-it-works");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="hidden xl:block fixed right-10 top-1/2 -translate-y-1/2 z-40">
      <ul className="space-y-4 text-sm">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`transition-colors ${
                active === s.id
                  ? "text-[#3b82f6]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
