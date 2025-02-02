import { useNavigate } from "react-router-dom"; // Note: usually from "react-router-dom"
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Typically, import from "framer-motion"

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate(); // Invoke useNavigate as a function

  return (
    <div
      className={`w-[100vw] sticky top-0 left-0 box-border outline outline-b outline-2 outline-gray-300 p-1 flex flex-row justify-between px-7 z-10 bg-amber-50`}
    >
      <img
        src="/logo.webp" // Adjust the path if necessary (usually use a relative path)
        alt="logo"
        className="h-[3.5rem] p-1 cursor-pointer rounded-full"
        onClick={() => navigate("/")}
      />
      <div
        className="items-center justify-center flex h-fit my-auto cursor-pointer"
        // You can move transition settings to a motion element if needed.
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? (
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
            width="3rem"
            height="3rem"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"
            />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
            width="3rem"
            height="3rem"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M21 5.25H3M21 12H3m18 6.75H3"
            />
          </svg>
        )}
      </div>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0.7, left: "100%" }}
            animate={{ opacity: 1, left: 0 }}
            exit={{ opacity: 0.7, left: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="top-[105%] left-0 w-full h-[100vh] flex flex-col absolute overflow-hidden bg-white my-[5rem] gap-4"
          >
            <li>Row E 1</li>
            <li>Row E 2</li>
            <li>Row E 3</li>
            <li>Row E 4</li>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
