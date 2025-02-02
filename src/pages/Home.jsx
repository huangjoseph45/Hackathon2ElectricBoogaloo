import Header from "../components/header";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import useFetchProducts from "../customHooks/useFetchProducts";
import ItemList from "../../ItemList.jsx";

const Home = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { isLoading, products, refetch } = useFetchProducts();

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

  useEffect(() => {
    console.log("Selected food items:", foodItems);
  }, [foodItems]);

  return (
    <>
      <Header />
      <div className="relative">
        {" "}
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
    </>
  );
};

export default Home;
