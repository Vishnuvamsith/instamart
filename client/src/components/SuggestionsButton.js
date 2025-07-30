// import React, { useState } from 'react';
// import { FiZap } from 'react-icons/fi';

// const SuggestionsButton = ({ onSuggestionClick }) => {
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const suggestions = [
//     "Check your leave balance",
//     "Know your employment benefits",
//     "Explain in brief about Swiggy's code of conduct"
//   ];

//   return (
//     <>
//       {/* Floating bulb button */}
//       <button
//         className="fixed bottom-24 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition duration-300"
//         onClick={() => setShowSuggestions(!showSuggestions)}
//       >
//         <FiZap className="text-xl" />
//       </button>

//       {/* Suggestions Panel */}
//       {showSuggestions && (
//         <div className="fixed bottom-36 right-6 z-50 bg-white border border-gray-300 shadow-lg rounded-xl p-4 w-72 space-y-3">
//           {suggestions.map((text, index) => (
//             <button
//               key={index}
//               className="w-full text-left text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl transition-all"
//               onClick={() => {
//                 onSuggestionClick(text);
//                 setShowSuggestions(false);
//               }}
//             >
//               {text}
//             </button>
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// export default SuggestionsButton;
// import React, { useState, useEffect, useRef } from 'react';
// import { FiZap } from 'react-icons/fi';

// const SuggestionsButton = ({ onSuggestionClick, animationType = 'spin' }) => {
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [animate, setAnimate] = useState(false);
//   const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 120 });

//   const buttonRef = useRef(null);
//   const panelRef = useRef(null);
//   const dragging = useRef(false);
//   const offset = useRef({ x: 0, y: 0 });

//   const suggestions = [
//     "Check your leave balance",
//     "Know your employment benefits",
//     "Explain in brief about Swiggy's code of conduct"
//   ];

//   // Animate periodically
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setAnimate(true);
//       setTimeout(() => setAnimate(false), 1500);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   // Detect outside click to close suggestions
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         showSuggestions &&
//         panelRef.current &&
//         !panelRef.current.contains(e.target) &&
//         !buttonRef.current.contains(e.target)
//       ) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     document.addEventListener('touchstart', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('touchstart', handleClickOutside);
//     };
//   }, [showSuggestions]);

//   // Dragging
//   const handleMouseDown = (e) => {
//     dragging.current = true;
//     const rect = buttonRef.current.getBoundingClientRect();
//     offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseup', handleMouseUp);
//   };

//   const handleMouseMove = (e) => {
//     if (dragging.current) {
//       const newX = e.clientX - offset.current.x;
//       const newY = e.clientY - offset.current.y;
//       setPosition({ x: newX, y: newY });
//     }
//   };

//   const handleMouseUp = () => {
//     dragging.current = false;
//     document.removeEventListener('mousemove', handleMouseMove);
//     document.removeEventListener('mouseup', handleMouseUp);
//   };

//   const handleTouchStart = (e) => {
//     const touch = e.touches[0];
//     dragging.current = true;
//     const rect = buttonRef.current.getBoundingClientRect();
//     offset.current = {
//       x: touch.clientX - rect.left,
//       y: touch.clientY - rect.top,
//     };
//     document.addEventListener('touchmove', handleTouchMove);
//     document.addEventListener('touchend', handleTouchEnd);
//   };

//   const handleTouchMove = (e) => {
//     if (dragging.current) {
//       const touch = e.touches[0];
//       const newX = touch.clientX - offset.current.x;
//       const newY = touch.clientY - offset.current.y;
//       setPosition({ x: newX, y: newY });
//     }
//   };

//   const handleTouchEnd = () => {
//     dragging.current = false;
//     document.removeEventListener('touchmove', handleTouchMove);
//     document.removeEventListener('touchend', handleTouchEnd);
//   };

//   const getAnimationClass = () => {
//     if (!animate) return '';
//     switch (animationType) {
//       case 'pulse': return 'animate-pulse-custom';
//       case 'spin': return 'animate-spin-custom';
//       case 'shake':
//       default:
//         return 'animate-shake';
//     }
//   };

//   return (
//     <>
//       {/* Floating Button */}
//       <button
//         ref={buttonRef}
//         title="Need help? Try these suggestions"
//         className={`fixed z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition duration-300 ${getAnimationClass()}`}
//         style={{ left: position.x, top: position.y }}
//         onClick={() => setShowSuggestions(!showSuggestions)}
//         onMouseDown={handleMouseDown}
//         onTouchStart={handleTouchStart}
//       >
//         <FiZap className="text-xl" />
//       </button>

//       {/* Suggestion Panel */}
//       {showSuggestions && (
//         <div
//           ref={panelRef}
//           className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-lg rounded-xl p-4 w-72 space-y-3"
//         >
//           {suggestions.map((text, index) => (
//             <button
//               key={index}
//               className="w-full text-left text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl transition-all"
//               onClick={() => {
//                 onSuggestionClick(text);
//                 setShowSuggestions(false);
//               }}
//             >
//               {text}
//             </button>
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// export default SuggestionsButton;


import React, { useState, useEffect, useRef } from 'react';
import { FiZap } from 'react-icons/fi';

const SuggestionsButton = ({ onSuggestionClick, animationType = 'spin' }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 120 });

  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const suggestions = [
    "Check your leave balance",
    "Know your employment benefits",
    "Explain in brief about Swiggy's code of conduct"
  ];

  // Animate periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1500);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Detect outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSuggestions &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showSuggestions]);

  // Dragging logic
  const handleMouseDown = (e) => {
    dragging.current = true;
    const rect = buttonRef.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (dragging.current) {
      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    dragging.current = true;
    const rect = buttonRef.current.getBoundingClientRect();
    offset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    if (dragging.current) {
      const touch = e.touches[0];
      const newX = touch.clientX - offset.current.x;
      const newY = touch.clientY - offset.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    dragging.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const getAnimationClass = () => {
    if (!animate) return '';
    switch (animationType) {
      case 'pulse': return 'animate-pulse-custom';
      case 'spin': return 'animate-spin-custom';
      case 'shake':
      default:
        return 'animate-shake';
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        ref={buttonRef}
        title="Need help? Try these suggestions"
        className={`fixed z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition duration-300 ${getAnimationClass()}`}
        style={{ left: position.x, top: position.y }}
        onClick={() => setShowSuggestions(!showSuggestions)}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <FiZap className="text-xl" />
      </button>

      {/* Blur Backdrop */}
      {showSuggestions && (
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-40 backdrop-blur-sm bg-black/10 transition-all duration-300"></div>
      )}

      {/* Suggestion Panel (Centered) */}
      {showSuggestions && (
        <div
          ref={panelRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-lg rounded-xl p-4 w-72 space-y-3"
        >
          {suggestions.map((text, index) => (
            <button
              key={index}
              className="w-full text-left text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl transition-all"
              onClick={() => {
                onSuggestionClick(text);
                setShowSuggestions(false);
              }}
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default SuggestionsButton;
