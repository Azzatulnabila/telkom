const Navbar = ({ toggleMenu, menuOpen }) => {
  return (
    <header
      className={`fixed top-0 bg-gray-900 text-white p-4 flex justify-between items-center shadow z-50 transition-all duration-300 ${
        menuOpen ? "left-80 w-[calc(100%-320px)]" : "ml-0 w-full"
      }`}
    >
      <button onClick={toggleMenu} className="text-2xl focus:outline-none">
        ☰
      </button>
      <h1 className="text-xl font-bold">Dashboard</h1>
    </header>
  );
};

export default Navbar;
