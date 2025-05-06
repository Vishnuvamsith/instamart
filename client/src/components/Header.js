import React from 'react';
import { FaBars } from 'react-icons/fa';
import { COLORS } from '../utils/constants';
import swiggyLogo from '../assets/images/swiggyLogo.png';
const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white p-4 shadow-md" style={{ borderBottom: `3px solid ${COLORS.brandColorLight}` }}>
      <div className="container mx-auto flex items-center">
        <button 
          className="md:hidden mr-3"
          onClick={toggleSidebar}
        >
          <FaBars className="text-xl" />
        </button>
        <div className="flex items-center mr-3">
            <img src={swiggyLogo} alt="Swiggy Logo" className="h-8 w-auto" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">Instamart</h1>
      </div>
    </header>
  );
};

export default Header;