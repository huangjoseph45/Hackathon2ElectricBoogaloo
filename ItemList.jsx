import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

function ItemList({
  isLoading,
  products,
  setHoveredItem,
  clickFunc,
  name,
  hoverColor,
}) {
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
    <div className="flex flex-col items-center justify-center mt-8 mb-4 gap-2">
      <label className="text-xl">{name}</label>
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="w-fit border border-[0.5rem] border-slate-900 rounded-lg h-[60vh] max-h-[60rem] p-2 overflow-x-auto min-w-[15rem]">
          {isLoading ? (
            <p>Loading...</p>
          ) : !products || products.length < 1 ? (
            <p>No Food Items Found</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                onMouseEnter={() => setHoveredItem(product)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`border rounded-lg bg-orange-300 cursor-pointer hover:bg-${hoverColor}-700 transition-all duration-200 hover:text-white`}
              >
                <div className="flex flex-row justify-between items-center">
                  <div
                    className="w-full h-full  p-2 px-4"
                    onClick={() => clickFunc(product)}
                  >
                    {" "}
                    {product.productName}
                  </div>
                  <FontAwesomeIcon
                    icon={faCopy}
                    className="px-4 bg-gray-300 bg-opacity-25 hover:bg-gray-600 rounded cursor-pointer"
                    onClick={() => copyToClipBoard(product?._id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemList;
