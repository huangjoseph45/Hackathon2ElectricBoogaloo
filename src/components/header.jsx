import { useNavigate } from "react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const nav = useNavigate;
  return (
    <div className="w-[100vw] border fixed top-0 left-0 border-none box-border outline outline-b outline-2 outline-gray-300 p-2 flex flex-row justify-between px-7 h-[10%]">
      <img
        src="public/logo.webp"
        alt="logo"
        className="h-[4.75rem] p-2 cursor-pointer rounded-full"
        onClick={() => nav("/")}
      />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="items-center justify-center flex h-fit my-auto cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? (
            <>
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
                ></path>
              </svg>
            </>
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
              ></path>
            </svg>
          )}
        </motion.div>
      </AnimatePresence>
      {showMenu && (
        <div className="top-[10%] left-0 w-[100vw] h-[100vh] flex flex-col absolute overflow-hidden bg-white">
          <li>Row E 1</li>
          <li>Row E 2</li>
          <li>Row E 3</li>
          <li>Row E 4</li>
        </div>
      )}
    </div>
  );
};

export default Header;
