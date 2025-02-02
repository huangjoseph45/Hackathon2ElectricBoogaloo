import { useState, useEffect } from "react";

const useCheckProducts = () => {
  const [isWaiting, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const checkProducts = async (productsToCheck) => {
    if (!productsToCheck || productsToCheck.length < 1) return;
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/product/check-product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productsToCheck),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.expirationInfo);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.message);
    }
  };

  const handleRecheck = async (productsToCheck) => {
    await checkProducts(productsToCheck);
  };

  return { isWaiting, results, recheckProducts: handleRecheck };
};

export default useCheckProducts;
