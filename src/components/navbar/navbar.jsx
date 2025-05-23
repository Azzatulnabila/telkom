const Navbar = ({ toggleMenu, menuOpen }) => {
  return (
    <header
      className={`fixed top-0 bg-gray-900 text-white p-4 flex justify-between items-center shadow z-50 transition-all duration-300 ${
        menuOpen ? 'w-[calc(100%-16rem)] left-64' : 'w-full left-0'
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
