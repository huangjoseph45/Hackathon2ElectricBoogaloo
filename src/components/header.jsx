import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="w-full sticky top-0 left-0 border-b border-gray-200 bg-white md:p-3 flex items-center justify-between z-10 shadow-sm">
      {/* Logo */}
      <div className="flex flex-row gap-4">
        <img
          src="/logo.webp"
          alt="logo"
          className="h-12 w-auto cursor-pointer rounded-full"
          onClick={() => navigate("/")}
        />
        <div className="flex flex-col">
          <div className="flex flex-row text-2xl">
            <p>Shelf</p>
            <p className="">Life</p>
          </div>
          <p className="font-semibold">.TECH</p>
        </div>
      </div>

      {/* Hamburger / Close Icon */}
      <div
        className="cursor-pointer flex items-center justify-center"
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? (
          /* Close Icon */
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
            width="2.5rem"
            height="2.5rem"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"
            />
          </svg>
        ) : (
          /* Hamburger Icon */
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
            width="2.5rem"
            height="2.5rem"
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

      {/* Slide-in Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.nav
            initial={{ opacity: 0, left: "100%" }}
            animate={{ opacity: 1, left: 0 }}
            exit={{ opacity: 0, left: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-[4.3rem] left-0 w-full h-screen flex flex-col gap-4 p-6 bg-white border-t border-gray-200 z-20"
          >
            <ul className="flex flex-col gap-4 text-slate-700">
              <li className="cursor-pointer hover:text-slate-900">Row E 1</li>
              <li className="cursor-pointer hover:text-slate-900">Row E 2</li>
              <li className="cursor-pointer hover:text-slate-900">Row E 3</li>
              <li className="cursor-pointer hover:text-slate-900">Row E 4</li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
