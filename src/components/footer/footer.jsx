function Footer({ sidebarOpen }) {
    console.log("Sidebar Open:", sidebarOpen); // Debugging
    return (
      <Footer
        className={`fixed bottom-0 left-0 bg-white py-2 border-t border-gray-300 transition-all duration-300 ${
          sidebarOpen ? "ml-80 w-[calc(100%-320px)]" : "ml-0 w-full"
        }`}
      >
        <p className="text-gray-600 text-center">RLEGS TR4 - Dashboard Large Enterprise Government Service © 2024</p>
      </Footer>
    );
  }
  
  export default Footer;
  