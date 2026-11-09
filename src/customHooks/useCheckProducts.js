import { useState } from "react";
import API_BASE from "../config";
import {
  demoJudgmentsFor,
  markDemoMode,
  clearDemoMode,
} from "../data/demoCatalog";

const useCheckProducts = () => {
  const [isWaiting, setWaiting] = useState(false);
  const [results, setResults] = useState(null);

  const checkProducts = async (productsToCheck) => {
    if (!productsToCheck || productsToCheck.length < 1) return;
    try {
      setWaiting(true);
      const response = await fetch(`${API_BASE}/product/check-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productsToCheck),
      });

      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("application/json")
      ) {
        // Live backend unreachable: answer with the sample judgments for
        // the selected demo products. These are labeled as samples in the
        // UI; they are not AI assessments.
        setResults(demoJudgmentsFor(productsToCheck));
        markDemoMode();
        setWaiting(false);
        return;
      }

      const data = await response.json();
      clearDemoMode();
      setResults(data.expirationInfo);
      setWaiting(false);
    } catch (error) {
      setWaiting(false);
      setResults(demoJudgmentsFor(productsToCheck));
      markDemoMode();
      console.warn("Live backend unreachable, serving demo judgments:", error);
    }
  };

  const handleRecheck = async (productsToCheck) => {
    await checkProducts(productsToCheck);
  };

  return { isWaiting, results, recheckProducts: handleRecheck, setWaiting };
};

export default useCheckProducts;
