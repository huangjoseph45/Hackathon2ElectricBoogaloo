import Header from "../components/header";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Map from "../components/map.jsx";
import useFetchProducts from "../customHooks/useFetchProducts";
import ItemList from "../../ItemList.jsx";
import Button from "../components/button.jsx";
import useCheckProducts from "../customHooks/useCheckProducts.js";
import { AnimatePresence, motion, time } from "framer-motion";
import useFetchLocations from "../customHooks/useFetchLocations";

const Home = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showDescription, setShowDescription] = useState("");
  const { isLoading, products, refetch } = useFetchProducts();
  const { isWaiting, results, recheckProducts, setWaiting } =
    useCheckProducts();
  const { locations, isPending, refetchLocations } = useFetchLocations();
  const [currLoc, setCurrLoc] = useState(null);
  const [markerName, setMarkerName] = useState(null);

  const sectionRef = useRef(null);

  // Add a product to the foodItems list
  const addFoodItem = (foodItem) => {
    if (!foodItems.includes(foodItem)) {
      setFoodItems((prevItems) => [...prevItems, foodItem]);
    }
  };

  const startup = async () => {
    const location = await getLocation();
    setCurrLoc({ lat: location.lat, lng: location.lng });
  };

  useEffect(() => {
    startup();
  }, []);

  // Remove a product from the foodItems list
  const removeFoodItem = (foodItemToRemove) => {
    setFoodItems((prevItems) =>
      prevItems.filter((foodItem) => foodItem._id !== foodItemToRemove._id)
    );
  };

  function getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(
          new Error("Geolocation is not supported by this browser.")
        );
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  const getNearbyFoodPantries = async () => {
    if ("geolocation" in navigator) {
      setWaiting(true);

      const location = await getLocation();

      console.log(location.lat, location.lng);
      refetchLocations(
        "food pantries, soup kitchen",
        location.lat,
        location.lng
      );
    } else {
      alert("Location is not available");
    }
    setWaiting(false);
  };
  useEffect(() => {
    if (locations && locations.length > 0 && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [locations]);

  const submitFunc = () => {
    console.log(foodItems);
    recheckProducts(foodItems);
  };

  useEffect(() => {
    console.log("Selected food items:", foodItems);
  }, [foodItems]);

  useEffect(() => {
    if (results)
      document.getElementById("sec2")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
  }, [results]);

  return (
    <>
      <Header />
      {/* Spinner Overlay */}
      {isWaiting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="text-slate-700"
          />
        </div>
      )}

      {/* Section 1 */}
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Expired Products */}
            <ItemList
              name="Products"
              isLoading={isLoading}
              products={products}
              clickFunc={addFoodItem}
              hoverColor="green"
            />

            {/* Arrow Icon (hidden on small screens) */}
            <FontAwesomeIcon
              icon={faArrowRight}
              className="hidden lg:block text-5xl text-slate-500"
            />

            {/* Products to Validate */}
            <ItemList
              name="Products to Validate"
              isLoading={isLoading}
              products={foodItems}
              clickFunc={removeFoodItem}
              hoverColor="red"
            />
          </div>

          {/* Hovered Item Details */}

          {/* Validate Button */}
          <div className="flex w-full items-center justify-center mt-6">
            <Button buttonName="Validate Food Items" buttonFunc={submitFunc} />
          </div>
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
            className="relative flex flex-col lg:flex-row items-center justify-center gap-8 bg-white py-8 w-full border-t border-gray-200 mb-[10rem] h-[100vh]"
          >
            {/* Results List */}
            <div className="relative flex flex-col items-center gap-4">
              <p className="text-2xl font-semibold text-slate-800">Results</p>
              <div className="border border-gray-300 rounded-md shadow-sm p-4 flex flex-col items-center mb-4 bg-white w-full max-w-[35rem] min-h-[20rem] overflow-scroll h-[35rem]">
                {/* Header Row */}
                <div className="w-full flex items-center gap-2 p-4 bg-gray-50 rounded-md mb-2">
                  <p className="w-12 font-semibold">Item</p>
                  <p className="w-12 mx-10 font-semibold">Rating</p>
                  <p className="mx-4 w-[10rem] font-semibold">Safe Until</p>
                </div>

                {/* Results Rows */}
                {results && results.length > 0 ? (
                  results.map((checkedItem) => (
                    <div
                      key={`${checkedItem._id}827498`}
                      onClick={() =>
                        setShowDescription(checkedItem.explanation)
                      }
                      className="w-full flex items-center gap-2 p-4 hover:bg-slate-100 rounded-sm cursor-pointer"
                    >
                      <p className="w-12 text-slate-700">
                        {checkedItem.foodName}
                      </p>
                      <div className="w-10 mx-10 flex items-center justify-center">
                        <p
                          className={`w-2 h-2 rounded-full ${
                            checkedItem.isSafe ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></p>
                      </div>
                      <p className="w-[10rem] mx-4 text-slate-700">
                        {checkedItem.estimatedSafetyDate}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-2xl text-slate-500">No Results</p>
                )}
              </div>
              <button
                className="absolute left-1/2 -translate-x-1/2 top-full w-1/2 border p-2 rounded-lg border-slate-800 hover:bg-slate-900 hover:text-white transition-all duration-200"
                onClick={getNearbyFoodPantries}
              >
                Find Nearby Food Pantries
              </button>
            </div>

            {/* Explanation or Image */}
            {showDescription && showDescription.length > 0 ? (
              <div className="flex flex-col gap-2 mx-4">
                <p className="text-xl font-semibold text-slate-800">
                  Explanation
                </p>
                <div className="border border-gray-300 bg-white rounded-md p-3 shadow-sm lg:w-[30rem] w-[20rem] text-slate-700">
                  {showDescription}
                </div>
              </div>
            ) : (
              <img
                src="public/stock1.jpg"
                alt="stock1"
                className="w-[35rem] h-fit max-h-[40rem] hidden lg:block rounded-md shadow-sm"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 3 */}
      <AnimatePresence>
        {locations && locations.length > 0 && (
          <motion.div
            ref={sectionRef}
            initial={{ opacity: 0.3, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.3, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="bg-[#efefed]"
          >
            <div className="flex flex-col lg:flex-row items-center justify-center p-6 pb-20 w-fit mx-auto gap-[4rem] h-[100vh]">
              <div className="flex-col relative">
                <p className="p-4 w-fit mx-auto text-xl font-semibold absolute top-0 -translate-y-16 left-1/2 -translate-x-1/2">
                  Nearby Food Pantries
                </p>
                <div className="flex flex-col overflow-y-scroll outline outline-black rounded-md whitespace-nowrap max-h-[30rem] overflow-scroll mx-auto bg-white">
                  {locations &&
                    locations.length > 0 &&
                    locations.map((location) => {
                      if (!location.business_status === "OPERATIONAL") return;

                      const shortenedName = location.name.split("-")[0];
                      const handleClicked = () => {
                        setMarkerName(shortenedName);
                        setCurrLoc(location.geometry.location);
                      };
                      return (
                        <li
                          key={location.place_id}
                          className="list-none p-2  cursor-pointer hover:bg-gray-200 rounded-lg w-[30rem]"
                          onClick={handleClicked}
                        >
                          {shortenedName}
                        </li>
                      );
                    })}
                </div>
              </div>

              <Map location={currLoc} markerName={markerName} />
            </div>
          </motion.div>
        )}{" "}
      </AnimatePresence>
    </>
  );
};

export default Home;
