// import React from 'react';
// import { FaUser } from 'react-icons/fa';
// import { BsChatLeftText } from 'react-icons/bs';
// import { FiCopy } from 'react-icons/fi';
// import { COLORS } from '../utils/constants';

// const MessageItem = ({ message, index, isLastMessage, copiedIndex, onCopy, lastMessageRef }) => {
//   const isUser = message.type === 'user';
  
//   return (
//     <div 
//       className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
//       ref={isLastMessage ? lastMessageRef : null}
//     >
//       <div 
//         className={`relative max-w-3xl p-4 rounded-2xl shadow-sm ${
//           isUser 
//             ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
//             : 'bg-gray-100 text-gray-800 border border-gray-200'
//         }`}
//       >
//         <div className="flex items-center mb-2">
//           <div 
//             className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 ${
//               isUser ? 'bg-blue-700' : 'bg-white'
//             }`}
//           >
//             {isUser ? (
//               <FaUser className="text-xs text-white" />
//             ) : (
//               <BsChatLeftText className="text-xs" style={{ color: COLORS.brandColor }} />
//             )}
//           </div>
//           <span className="font-semibold">
//             {isUser ? 'You' : 'Assistant'}
//           </span>
//         </div>
//         <div className="whitespace-pre-wrap">{message.text}</div>
        
//         {!isUser && (
//           <button
//             className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm hover:shadow"
//             onClick={() => onCopy(index)}
//             title="Copy message"
//           >
//             <FiCopy style={{ color: copiedIndex === index ? COLORS.brandColor : '' }} />
//             {copiedIndex === index && (
//               <span className="absolute -top-8 right-0 text-white text-xs py-1 px-2 rounded-md shadow-md" style={{ backgroundColor: COLORS.brandColor }}>
//                 Copied!
//               </span>
//             )}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageItem;




import React from 'react';
import { FaUser } from 'react-icons/fa';
import { FiCopy } from 'react-icons/fi';
import { COLORS } from '../utils/constants';
import swiggyLogo from '../assets/images/swiggyLogo.png'; // Swiggy logo import

const MessageItem = ({ message, index, isLastMessage, copiedIndex, onCopy, lastMessageRef }) => {
  const isUser = message.type === 'user';

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      ref={isLastMessage ? lastMessageRef : null}
    >
      <div 
        className={`relative max-w-3xl p-4 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
            : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}
      >
        <div className="flex items-center mb-2">
          <div 
            className={`flex items-center justify-center w-9 h-9 rounded-full mr-2 ${
              isUser ? 'bg-blue-700' : 'bg-white'
            }`}
          >
            {isUser ? (
              <FaUser className="text-sm text-white" />
            ) : (
              <img 
                src={swiggyLogo} 
                alt="Swiggy" 
                className="w-7 h-7 object-contain" 
              />
            )}
          </div>
          <span className="font-semibold">
            {isUser ? 'You' : 'Assistant'}
          </span>
        </div>
        
        <div className="whitespace-pre-wrap">{message.text}</div>
        
        {!isUser && (
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm hover:shadow"
            onClick={() => onCopy(index)}
            title="Copy message"
          >
            <FiCopy style={{ color: copiedIndex === index ? COLORS.brandColor : '' }} />
            {copiedIndex === index && (
              <span className="absolute -top-8 right-0 text-white text-xs py-1 px-2 rounded-md shadow-md" style={{ backgroundColor: COLORS.brandColor }}>
                Copied!
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
