import Header from "../components/header";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";

import useFetchProducts from "../customHooks/useFetchProducts";
import ItemList from "../../ItemList.jsx";
import Button from "../components/button.jsx";
import useCheckProducts from "../customHooks/useCheckProducts.js";
import { AnimatePresence, motion } from "framer-motion";

const Home = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { isLoading, products, refetch } = useFetchProducts();
  const { isWaiting, results, recheckProducts } = useCheckProducts();

  // Add a product to the foodItems list
  const addFoodItem = (foodItem) => {
    if (!foodItems.includes(foodItem))
      setFoodItems((prevItems) => [...prevItems, foodItem]);
  };

  // Remove a product from the foodItems list
  const removeFoodItem = (foodItemToRemove) => {
    setFoodItems((prevItems) =>
      prevItems.filter((foodItem) => foodItem._id !== foodItemToRemove._id)
    );
  };

  const submitFunc = () => {
    console.log(foodItems);
    recheckProducts(foodItems);
  };

  useEffect(() => {
    console.log("Selected food items:", foodItems);
  }, [foodItems]);

  useEffect(() => {
    console.log(results);
    document.getElementById("sec2").scrollIntoView({
      behavior: "smooth", // Enables smooth scroll transition
      block: "start", // Scrolls so that the start of the element is aligned
      inline: "nearest",
    });
  }, [results]);

  return (
    <>
      <Header />
      {/* Section 1 */}
      {isWaiting && (
        <div
          className="
        absolute
        left-1/2
        top-[88%]
        -translate-x-1/2
      "
        >
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        </div>
      )}
      <div className=" h-[100vh]">
        <div className="relative">
          <div className="flex flex-row items-center justify-center gap-8">
            {/* Expired Products Section */}
            <ItemList
              name="Expired Products"
              isLoading={isLoading}
              products={products}
              setHoveredItem={setHoveredItem}
              clickFunc={addFoodItem}
              hoverColor="green"
            />
            <FontAwesomeIcon icon={faArrowRight} className="text-[5rem]" />

            {/* Donatable Products Section */}
            <ItemList
              name="Products to Validate"
              isLoading={isLoading}
              products={foodItems}
              setHoveredItem={null}
              clickFunc={removeFoodItem}
              hoverColor="red"
            />
          </div>
          {hoveredItem && (
            <div className="list-none absolute top-1/2 left-[5rem] -translate-y-1/2 border p-2 rounded-lg outline outline-black w-[20rem]">
              <li className="">Name: {hoveredItem?.productName}</li>
              <li className="">ID: {hoveredItem?._id}</li>
              <li className="">Category: {hoveredItem?.category}</li>
              <li className="">Stock: {hoveredItem?.stockQuantity}</li>
              <li className="">
                Price: {hoveredItem && `$${hoveredItem?.price}`}
              </li>
              <li className="">
                Expiration Date:{" "}
                {new Date(hoveredItem?.expirationDate).toDateString()}
              </li>
            </div>
          )}
        </div>
        <div className="flex w-full items-center justify-center mt-2">
          <Button buttonName="Validate Food Items" buttonFunc={submitFunc} />
        </div>
      </div>

      {/* Section 2 */}

      <AnimatePresence>
        <span id="sec2"></span>
        {results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0.3, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.3, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="flex flex-row items-center justify-center gap-8 max-h-[40rem] bg-slate-100 py-4"
          >
            <div className="flex flex-col items-center gap-4">
              <p className=" text-2xl">Results</p>
              <div className="outline mx-auto p-4 flex flex-col items-center  mb-4 rounded-md w-[35rem] h-fit min-h-[20rem] bg-white scroll-auto">
                <li className="list-none w-full cursor-pointer flex items-center gap-2 p-4">
                  <p className="w-12"> Item</p>{" "}
                  <p className="w-12 mx-10">Rating</p>
                  <p className="mx-4 w-[10rem]">Safe Until</p>
                </li>
                {results && results.length > 0 ? (
                  results.map((checkedItem) => {
                    return (
                      <li
                        key={`${checkedItem._id}${checkedItem.foodName}`}
                        className="list-none w-full cursor-pointer flex items-center gap-2 p-4 hover:bg-slate-100 rounded-sm"
                      >
                        <p className="w-12"> {checkedItem.foodName}</p>
                        <div className="w-10 mx-10 items-center justify-center flex">
                          {" "}
                          <p
                            className={`w-2 h-2 rounded-full ${
                              checkedItem.isSafe ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></p>
                        </div>

                        <p className=" w-[10rem] mx-4">
                          {" "}
                          {checkedItem.estimatedSafetyDate}
                        </p>
                      </li>
                    );
                  })
                ) : (
                  <p className="text-2xl">No Results</p>
                )}
              </div>
            </div>
            <img
              src="public/stock1.jpg"
              alt="stock1"
              className="w-[35rem] h-fit max-h-40rem hidden lg:block"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;
