import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

// Mapping function that returns the corresponding Tailwind hover class for a given color.

function ItemList({ isLoading, products, clickFunc, name }) {
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
    <div className="flex flex-col items-center ">
      <label className="text-xl font-semibold text-slate-900 mb-4 whitespace-nowrap">
        {name}
      </label>
      <div className="flex flex-row items-center justify-center gap-4 relative">
        <div className="lg:w-[20rem] border border-slate-900 rounded-md h-[30rem] max-h-[60rem] p-4 overflow-x-auto bg-white shadow-md ">
          {isLoading ? (
            <p>Loading...</p>
          ) : !products || products.length < 1 ? (
            <p>No Food Items Found</p>
          ) : (
            products.map((product) => (
              // Wrap each item in a relative container to position the popup correctly.
              <div key={`${product._id}-${name}`} className="mb-2">
                <div
                  onMouseEnter={() => setHoveredItem(product)}
                  onMouseLeave={() => setHoveredItem(null)}
                  // Integrate the dynamic hover color.
                  className={`outline outline-gray-100 rounded-sm cursor-pointer transition-all duration-100 lg:w-full hover:outline-amber-400 hover:outline-[.2rem]`}
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
                      className="p-4 w-2 h-2 bg-gray-200 bg-opacity-15 hover:bg-gray-300 rounded cursor-pointer"
                      onClick={() => copyToClipBoard(product?._id)}
                    />
                  </div>
                </div>
                {/* Popup that appears on hover */}
                {hoveredItem && hoveredItem === product && (
                  <div className="-translate-x-[110%] -translate-y-[20%] w-[20rem] border border-gray-300 bg-white rounded-md shadow-md p-3 text-slate-700 absolute">
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
