import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCat } from "@fortawesome/free-solid-svg-icons";

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
        className="cursor-pointer flex items-center justify-center gap-8 px-4"
        onClick={() => setShowMenu(!showMenu)}
      >
        <a
          href="https://dorahacks.io/hackathon/hackru-s25/hackers"
          target="_blank"
          className="text-black"
        >
          <FontAwesomeIcon icon={faCat} size="2x" />
        </a>
        <a
          href="https://github.com/huangjoseph45/Hackathon2ElectricBoogaloo"
          target="_blank"
          className="text-fuchsia-700"
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
      </div>

      {/* Slide-in Menu */}
    </header>
  );
};

export default Header;
