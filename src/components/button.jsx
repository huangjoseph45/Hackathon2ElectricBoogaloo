const Button = ({ buttonName, buttonFunc }) => {
  return (
    <button
      className="px-4 py-2 outline outline-black rounded-sm hover:bg-slate-900 hover:text-white transition-all duration-200"
      onClick={() => buttonFunc()}
    >
      {buttonName}
    </button>
  );
};

export default Button;
