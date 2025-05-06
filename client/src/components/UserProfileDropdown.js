// components/UserProfileDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import { FiChevronUp, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // <-- Add this line

  const user = {
    name: "Vishnu Kumar",
    phone: "+91 9876543210",
    avatar: "V"
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear any auth tokens or session data if needed
    // localStorage.removeItem('authToken');
    navigate('/login'); // <-- Redirect to login page
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center w-full p-2 rounded hover:bg-gray-100"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
          {user.avatar}
        </div>
        <span className="text-sm font-medium flex-1 text-left">{user.name}</span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 w-64 bg-white shadow-lg rounded-md p-4 z-20">
          <div className="mb-2">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.phone}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm text-red-600 hover:text-red-700"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
