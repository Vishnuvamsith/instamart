// import React, { useState, useRef } from 'react';
// import { FiSend, FiRefreshCw } from 'react-icons/fi';
// import { FaMicrophone } from 'react-icons/fa';
// import { COLORS } from '../utils/constants';
// import ErrorNotification from './ErrorNotification';

// const InputArea = ({ 
//   message, 
//   setMessage, 
//   handleSubmit, 
//   handleKeyPress, 
//   isRecording, 
//   toggleRecording,
//   loading, 
//   error,
//   conversations,
//   onNewSession
// }) => {
//   const [permissionError, setPermissionError] = useState(null);
//   const textareaRef = useRef(null);
//   const isLimitReached = conversations.length >= 25;

//   const handleRecordingClick = async () => {
//     if (isLimitReached) {
//       setPermissionError('Please start a new conversation to continue');
//       return;
//     }

//     try {
//       if (navigator.permissions) {
//         const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
//         if (permissionStatus.state === 'denied') {
//           setPermissionError('Microphone access is blocked. Please enable permissions.');
//           return;
//         }
//       }
      
//       setPermissionError(null);
//       toggleRecording();
      
//       if (!isRecording && textareaRef.current) {
//         textareaRef.current.focus();
//       }
//     } catch (err) {
//       console.error('Permission check failed:', err);
//       toggleRecording();
//     }
//   };

//   const handleSubmitClick = () => {
//     if (isLimitReached) {
//       onNewSession();
//     } else {
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
//       {isLimitReached && (
//         <div className="mb-3 p-3 bg-blue-50 text-blue-800 rounded-lg flex items-center justify-between">
//           <span>Conversation limit reached (25 messages). Please start a new one.</span>
//           <button 
//             onClick={onNewSession}
//             className="ml-4 px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
//           >
//             New Chat
//           </button>
//         </div>
//       )}
      
//       <ErrorNotification error={error || permissionError} />
      
//       <div className="flex items-center">
//         <textarea
//           ref={textareaRef}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={(e) => {
//             if (isLimitReached && e.key === 'Enter' && !e.shiftKey) {
//               e.preventDefault();
//               onNewSession();
//             } else {
//               handleKeyPress(e);
//             }
//           }}
//           className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
//           style={{ 
//             borderRadius: '0.5rem 0 0 0.5rem',
//             focusRing: COLORS.brandColorLight
//           }}
//           placeholder={isRecording ? "Listening... Speak now" : 
//                      isLimitReached ? "Press enter to start new chat" : 
//                      "Type your message here..."}
//           rows="2"
//         />
//         <div className="flex flex-col border-t border-r border-b border-gray-300 rounded-r-lg bg-gray-50 h-full">
//           <button
//             onClick={handleRecordingClick}
//             disabled={isLimitReached}
//             className={`px-4 py-3 border-b border-gray-300 transition-colors duration-200 ${
//               isRecording ? 'bg-red-50' : 
//               isLimitReached ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
//             }`}
//             style={{ 
//               color: isRecording ? 'red' : COLORS.brandColor,
//               borderRadius: '0 0.5rem 0 0'
//             }}
//             title={isLimitReached ? 'Start new conversation to use voice' : 
//                   isRecording ? 'Stop recording' : 'Start voice input'}
//             onMouseDown={(e) => e.preventDefault()}
//             type="button"
//           >
//             <FaMicrophone className={isRecording ? 'animate-pulse' : ''} />
//           </button>
//           <button
//             onClick={handleSubmitClick}
//             className={`px-4 py-3 transition-colors duration-200 ${
//               (message.trim() && !loading && !isLimitReached) ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
//             }`}
//             style={{ 
//               color: COLORS.brandColor,
//               borderRadius: '0 0 0.5rem 0'
//             }}
//             title={isLimitReached ? "Start new conversation" : "Send message"}
//             disabled={(!message.trim() || loading) && !isLimitReached}
//             type="button"
//           >
//             {isLimitReached ? <FiRefreshCw /> : <FiSend />}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InputArea;

import React, { useState, useRef } from 'react';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import { FaMicrophone } from 'react-icons/fa';
import { COLORS } from '../utils/constants';
import ErrorNotification from './ErrorNotification';
import { useTranslation } from 'react-i18next';

const InputArea = ({ 
  message, 
  setMessage, 
  handleSubmit, 
  handleKeyPress, 
  isRecording, 
  toggleRecording,
  loading, 
  error,
  conversations,
  onNewSession
}) => {
  const [permissionError, setPermissionError] = useState(null);
  const textareaRef = useRef(null);
  const isLimitReached = conversations.length >= 25;
  const { t } = useTranslation();

  const handleRecordingClick = async () => {
    if (isLimitReached) {
      setPermissionError('Please start a new conversation to continue');
      return;
    }

    try {
      if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        if (permissionStatus.state === 'denied') {
          setPermissionError('Microphone access is blocked. Please enable permissions.');
          return;
        }
      }
      
      setPermissionError(null);
      toggleRecording();
      
      if (!isRecording && textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      console.error('Permission check failed:', err);
      toggleRecording();
    }
  };

  const handleSubmitClick = () => {
    if (isLimitReached) {
      onNewSession();
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
      {isLimitReached && (
        <div className="mb-2 p-2 bg-blue-50 text-blue-800 rounded-md flex items-center justify-between text-sm">
          <span>{t("Limit reached (25 messages)")}</span>
          <button 
            onClick={onNewSession}
            className="ml-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors text-sm flex items-center gap-1"
          >
            <FiRefreshCw size={14} />
            {t("New Chat")}
          </button>
        </div>
      )}
      
      <ErrorNotification error={error || permissionError} />
      
      <div className="flex items-stretch gap-1">
        <div className="relative flex-grow">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (isLimitReached && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onNewSession();
              } else {
                handleKeyPress(e);
              }
            }}
            className="w-full border border-gray-300 rounded-l-lg p-2 pr-9 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-400 resize-none text-sm"
            placeholder={isRecording ? t("Listening...") : isLimitReached ? t("Press enter for new chat") : t("Type your message...")}
            rows="1"
            style={{
              minHeight: '40px',
              maxHeight: '120px'
            }}
          />
          
          <button
            onClick={handleRecordingClick}
            disabled={isLimitReached}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
              isRecording 
                ? 'text-red-500 animate-pulse' 
                : isLimitReached 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:text-blue-600'
            }`}
            title={isLimitReached ? 'Start new conversation to use voice' : 
                  isRecording ? 'Stop recording' : 'Start voice input'}
            type="button"
          >
            <FaMicrophone size={16} />
          </button>
        </div>

        <button
          onClick={handleSubmitClick}
          disabled={(!message.trim() || loading) && !isLimitReached}
          className={`px-3 rounded-r-lg flex items-center justify-center ${
            isLimitReached
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : message.trim() && !loading
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          style={{
            minWidth: '40px'
          }}
          title={isLimitReached ? "New chat" : "Send message"}
          type="button"
        >
          {isLimitReached ? (
            <FiRefreshCw size={16} />
          ) : loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <FiSend size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

export default InputArea;