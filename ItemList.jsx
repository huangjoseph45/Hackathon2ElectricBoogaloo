import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

// Mapping function that returns the corresponding Tailwind hover class for a given color.
const getHoverBgClass = (color) => {
  const colorMap = {
    blue: "hover:bg-blue-700",
    red: "hover:bg-red-700",
    green: "hover:bg-green-700",
    purple: "hover:bg-purple-700",
    // Add additional colors if needed.
  };
  return colorMap[color] || "";
};

function ItemList({
  isLoading,
  products,
  clickFunc,
  name,
  hoverColor, // Expected values: "blue", "red", "green", "purple", etc.
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const copyToClipBoard = async (textToCopy) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (err) {
        console.error("Error copying text via Clipboard API:", err);
      }
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-100 flex flex-col items-center ">
      <label className="text-xl font-semibold text-slate-900 mb-4">
        {name}
      </label>
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="w-[11rem] lg:w-[20rem] border border-slate-900 rounded-md h-[30rem] max-h-[60rem] p-2 overflow-x-auto bg-white shadow-md overflow-y-scroll">
          {isLoading ? (
            <p>Loading...</p>
          ) : !products || products.length < 1 ? (
            <p>No Food Items Found</p>
          ) : (
            products.map((product) => (
              <div key={`${product._id}-${hoverColor}`} className=" mb-2">
                <div
                  onMouseEnter={() => setHoveredItem(product)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`border rounded-sm bg-gray-50 cursor-pointer transition-all duration-200 hover:text-white w-[10rem] lg:w-[15rem] ${getHoverBgClass(
                    hoverColor
                  )}`}
                >
                  <div className="flex flex-row justify-between items-center">
                    <div
                      className="w-full h-full p-2 px-4"
                      onClick={() => clickFunc(product)}
                    >
                      {product.productName}
                    </div>
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="px-4 bg-gray-300 bg-opacity-25 hover:bg-gray-600 rounded cursor-pointer"
                      onClick={() => copyToClipBoard(product?._id)}
                    />
                  </div>
                </div>
                {hoveredItem && hoveredItem === product && (
                  <div className="absolute top-1/2 left-[5rem] -translate-y-1/2 w-[20rem] border border-gray-300 bg-white rounded-md shadow-md p-3 text-slate-700">
                    <ul className="space-y-1">
                      <li>
                        <span className="font-medium">Name:</span>{" "}
                        {hoveredItem.productName}
                      </li>
                      <li>
                        <span className="font-medium">ID:</span>{" "}
                        {hoveredItem._id}
                      </li>
                      <li>
                        <span className="font-medium">Category:</span>{" "}
                        {hoveredItem.category}
                      </li>
                      <li>
                        <span className="font-medium">Stock:</span>{" "}
                        {hoveredItem.stockQuantity}
                      </li>
                      <li>
                        <span className="font-medium">Price:</span>{" "}
                        {`$${hoveredItem.price}`}
                      </li>
                      <li>
                        <span className="font-medium">Expiration Date:</span>{" "}
                        {new Date(hoveredItem.expirationDate).toDateString()}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemList;
