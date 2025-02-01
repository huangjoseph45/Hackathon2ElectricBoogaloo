import { useEffect } from "react";
import "./App.css";

function App() {
  const createProduct = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/product/create-product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productName: "Milk", category: "Dairy" }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    createProduct();
  });

  return <h1 className="text-1xl font-bold underline">Hello world!</h1>;
}

export default App;
