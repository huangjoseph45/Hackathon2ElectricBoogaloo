import { useState, useEffect } from "react";
import API_BASE from "../config";
import {
  demoProducts,
  markDemoMode,
  clearDemoMode,
} from "../data/demoCatalog";

const useFetchProducts = () => {
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("application/json")
      ) {
        // Live backend unreachable: serve the demo catalog instead of an
        // empty list. A down backend answers HTML pages, so only parse
        // the body when it is actually JSON.
        setProducts(demoProducts);
        markDemoMode();
        setLoading(false);
        return;
      }

      const data = await response.json();
      clearDemoMode();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setProducts(demoProducts);
      markDemoMode();
      console.warn("Live backend unreachable, serving demo products:", error);
    }
  };

  const handleRefetch = async () => {
    await fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { isLoading, products, refetch: handleRefetch };
};

export default useFetchProducts;
