// import React from 'react';
// import { BsChatLeftText } from 'react-icons/bs';
// import { COLORS } from '../utils/constants';

// const WelcomeMessage = ({ onSuggestionClick }) => {
//   const suggestions = [
//     "Check your leave balance",
//     "Know your employment benefits",
//     "Explain in brief about Swiggy's code of conduct"
//   ];

//   return (
//     <div className="flex justify-start">
//       <div className="bg-gray-100 p-5 rounded-2xl text-gray-800 border border-gray-200 shadow-sm max-w-3xl w-full">
//         <div className="flex items-center mb-2">
//           <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 bg-white">
//             <BsChatLeftText className="text-xs" style={{ color: COLORS.brandColor }} />
//           </div>
//           <span className="font-semibold">Assistant</span>
//         </div>

//         <div className="whitespace-pre-wrap mb-3">
//           Welcome back, Vishnu! 👋 How can I assist you today?
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {suggestions.map((suggestion, index) => (
//             <button
//               key={index}
//               onClick={() => onSuggestionClick(suggestion)}
//               className="text-sm bg-white border border-gray-300 hover:border-blue-400 px-3 py-1 rounded-full transition-colors shadow-sm"
//             >
//               {suggestion}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomeMessage;


import React from 'react';
import { BsChatLeftText } from 'react-icons/bs';
import { COLORS } from '../utils/constants';
import { FiZap } from 'react-icons/fi'; // Optional icon for suggestion buttons

const WelcomeMessage = ({ onSuggestionClick }) => {
  const suggestions = [
    "Check your leave balance",
    "Know your employment benefits",
    "Explain in brief about Swiggy's code of conduct"
  ];

  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 p-5 rounded-2xl text-gray-800 border border-gray-200 shadow-sm max-w-3xl w-full">
        {/* Assistant header */}
        <div className="flex items-center mb-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 bg-white">
            <BsChatLeftText className="text-xs" style={{ color: COLORS.brandColor }} />
          </div>
          <span className="font-semibold">Assistant</span>
        </div>

        {/* Welcome text */}
        <div className="whitespace-pre-wrap mb-3">
          Welcome back, Vishnu! 👋 How can I assist you today?
        </div>

        {/* Updated suggestion buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="flex items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 hover:border-blue-300 px-4 py-2 rounded-xl shadow-sm transition-all duration-200"
            >
              <FiZap className="text-blue-500 text-lg" />
              <span className="text-left">{suggestion}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
