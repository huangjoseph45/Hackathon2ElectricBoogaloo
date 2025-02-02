import { useState, useEffect } from "react";

const useFetchProducts = () => {
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    setLoading(false);
  }, []);

  return { isLoading, products, refetch: fetchProducts };
};

export default useFetchProducts;
