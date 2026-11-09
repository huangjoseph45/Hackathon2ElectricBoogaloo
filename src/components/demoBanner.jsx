import { useState } from "react";
import { isDemoMode } from "../data/demoCatalog";

// Shown while the app is serving demo data because the live backend is
// unreachable. The judgments are samples, so the banner says so plainly.
const DemoBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !isDemoMode()) return null;

  return (
    <div className="w-full bg-slate-900 text-white text-center text-sm px-4 py-2 flex items-center justify-center gap-3">
      <p>
        Demo mode — the live backend is offline, so you&apos;re seeing sample
        products, sample judgments, and sample pantries. Sample judgments are
        not safety assessments: never decide whether food is safe to eat or
        donate from this demo.
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss demo notice"
        className="shrink-0 underline underline-offset-2 hover:text-amber-400"
      >
        Dismiss
      </button>
    </div>
  );
};

export default DemoBanner;
