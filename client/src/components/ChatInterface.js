// import React, { useState, useRef, useEffect } from 'react';
// import { FiCopy, FiSend } from 'react-icons/fi';
// import { FaMicrophone, FaUser } from 'react-icons/fa';
// import { BsChatLeftText } from 'react-icons/bs';

// function ChatInterface() {
//   const [message, setMessage] = useState('');
//   const [conversations, setConversations] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [copiedIndex, setCopiedIndex] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const lastMessageRef = useRef(null);
//   const recognitionRef = useRef(null);

//   // API endpoint
//   const API_URL = 'http://127.0.0.1:5020';
//   const ANSWER_ENDPOINT = `${API_URL}/api/answer`;

//   // Brand color style variables
//   const brandColor = '#fe5005';
//   const brandColorLight = '#ff8f5a';
//   const brandColorVeryLight = '#fff1eb';

//   // Set up speech recognition
//   useEffect(() => {
//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setMessage(transcript);
//         setIsRecording(false);
//       };

//       recognition.onerror = (event) => {
//         setError('Speech recognition error');
//         console.error('Speech recognition error:', event);
//         setIsRecording(false);
//       };

//       recognitionRef.current = recognition;
//     } else {
//       setError('Speech recognition not supported in this browser.');
//     }
//   }, []);

//   // Scroll to the latest message
//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [conversations]);

//   const handleAudioInput = () => {
//     if (!recognitionRef.current) {
//       setError('Speech recognition not available');
//       return;
//     }
    
//     if (isRecording) {
//       recognitionRef.current.stop();
//       setIsRecording(false);
//     } else {
//       recognitionRef.current.start();
//       setIsRecording(true);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!message.trim()) return;
    
//     setError(null);
//     setLoading(true);

//     try {
//       // Add user message to conversation
//       const userMessage = {
//         type: 'user',
//         text: message
//       };
      
//       setConversations(prev => [...prev, userMessage]);
      
//       // Call the actual API endpoint
//       const response = await fetch(ANSWER_ENDPOINT, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ question: message })
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.status !== 'success') {
//         throw new Error(data.message || 'Failed to get answer');
//       }
      
//       // Add bot response
//       const botResponse = {
//         type: 'bot',
//         text: data.response.answer
//       };
      
//       setConversations(prev => [...prev, botResponse]);
//       setLoading(false);

//       // Clear the input field
//       setMessage('');
//     } catch (error) {
//       console.error("Error processing message:", error);
//       setError(`An error occurred: ${error.message}`);
//       setLoading(false);
//     }
//   };

//   const handleCopy = (index) => {
//     navigator.clipboard.writeText(conversations[index].text);
//     setCopiedIndex(index);
//     setTimeout(() => setCopiedIndex(null), 3000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       {/* Header */}
//       <header 
//         className="bg-white p-4 shadow-md" 
//         style={{ borderBottom: `3px solid ${brandColorLight}` }}
//       >
//         <div className="container mx-auto flex items-center">
//           <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: brandColorVeryLight }}>
//             <BsChatLeftText className="text-2xl" style={{ color: brandColor }} />
//           </div>
//           <h1 className="text-xl font-bold text-gray-800">Swiggy Instamart</h1>
//         </div>
//       </header>

//       {/* Main chat area */}
//       <div className="flex-grow overflow-hidden container mx-auto flex flex-col p-4">
//         {/* Messages container */}
//         <div className="flex-grow overflow-y-auto mb-4 rounded-lg bg-white shadow-md border border-gray-100">
//           <div className="p-4 space-y-6">
//             {conversations.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
//                 <div 
//                   className="flex items-center justify-center w-20 h-20 rounded-full mb-4" 
//                   style={{ backgroundColor: brandColorVeryLight }}
//                 >
//                   <BsChatLeftText className="text-5xl" style={{ color: brandColorLight }} />
//                 </div>
//                 <p className="text-lg">No messages yet. Start a conversation!</p>
//               </div>
//             ) : (
//               conversations.map((convo, index) => (
//                 <div 
//                   key={index} 
//                   className={`flex ${convo.type === 'user' ? 'justify-end' : 'justify-start'}`}
//                   ref={index === conversations.length - 1 ? lastMessageRef : null}
//                 >
//                   <div 
//                     className={`relative max-w-3xl p-4 rounded-2xl shadow-sm ${
//                       convo.type === 'user' 
//                         ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
//                         : 'bg-gray-100 text-gray-800 border border-gray-200'
//                     }`}
//                   >
//                     <div className="flex items-center mb-2">
//                       <div 
//                         className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 ${
//                           convo.type === 'user' ? 'bg-blue-700' : 'bg-white'
//                         }`}
//                       >
//                         {convo.type === 'user' ? (
//                           <FaUser className="text-xs text-white" />
//                         ) : (
//                           <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
//                         )}
//                       </div>
//                       <span className="font-semibold">
//                         {convo.type === 'user' ? 'You' : 'Assistant'}
//                       </span>
//                     </div>
//                     <div className="whitespace-pre-wrap">{convo.text}</div>
                    
//                     {convo.type === 'bot' && (
//                       <button
//                         className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm hover:shadow"
//                         onClick={() => handleCopy(index)}
//                         title="Copy message"
//                       >
//                         <FiCopy style={{ color: copiedIndex === index ? brandColor : '' }} />
//                         {copiedIndex === index && (
//                           <span className="absolute -top-8 right-0 text-white text-xs py-1 px-2 rounded-md shadow-md" style={{ backgroundColor: brandColor }}>
//                             Copied!
//                           </span>
//                         )}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//             {loading && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-100 p-5 rounded-2xl text-gray-800 border border-gray-200 shadow-sm">
//                   <div className="flex items-center">
//                     <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 bg-white">
//                       <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
//                     </div>
//                     <span className="font-semibold mr-3">Assistant</span>
//                     <div className="loader">
//                       <div className="flex space-x-2">
//                         <div 
//                           className="w-3 h-3 rounded-full animate-bounce" 
//                           style={{ 
//                             backgroundColor: brandColor,
//                             animationDelay: '0s',
//                             animationDuration: '0.6s'
//                           }}
//                         ></div>
//                         <div 
//                           className="w-3 h-3 rounded-full animate-bounce" 
//                           style={{ 
//                             backgroundColor: brandColor,
//                             animationDelay: '0.2s',
//                             animationDuration: '0.6s'
//                           }}
//                         ></div>
//                         <div 
//                           className="w-3 h-3 rounded-full animate-bounce" 
//                           style={{ 
//                             backgroundColor: brandColor,
//                             animationDelay: '0.4s',
//                             animationDuration: '0.6s'
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Input area */}
//         <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
//           {error && (
//             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-3 rounded">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 <p>{error}</p>
//               </div>
//             </div>
//           )}
//           <div className="flex items-center">
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
//               style={{ 
//                 borderRadius: '0.5rem 0 0 0.5rem',
//                 focusRing: brandColorLight
//               }}
//               placeholder="Type your message here..."
//               rows="2"
//             />
//             <div className="flex flex-col border-t border-r border-b border-gray-300 rounded-r-lg bg-gray-50 h-full">
//               <button
//                 onClick={handleAudioInput}
//                 className="px-4 py-3 border-b border-gray-300 hover:bg-gray-100 transition-colors duration-200"
//                 style={{ 
//                   color: isRecording ? 'red' : brandColor,
//                   borderRadius: '0 0.5rem 0 0'
//                 }}
//                 title={isRecording ? 'Stop recording' : 'Start voice input'}
//               >
//                 <FaMicrophone className={isRecording ? 'animate-pulse' : ''} />
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className={`px-4 py-3 transition-colors duration-200 ${message.trim() && !loading ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
//                 style={{ 
//                   color: brandColor,
//                   borderRadius: '0 0 0.5rem 0'
//                 }}
//                 title="Send message"
//                 disabled={!message.trim() || loading}
//               >
//                 <FiSend />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatInterface;

import React, { useState, useRef, useEffect } from 'react';
import { FiCopy, FiSend } from 'react-icons/fi';
import { FaMicrophone, FaUser } from 'react-icons/fa';
import { BsChatLeftText } from 'react-icons/bs';

function ChatInterface() {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const lastMessageRef = useRef(null);
  const recognitionRef = useRef(null);

  const API_URL = 'https://instamart-bq8h.onrender.com';
  const ANSWER_ENDPOINT = `${API_URL}/api/answer`;

  const brandColor = '#fe5005';
  const brandColorLight = '#ff8f5a';
  const brandColorVeryLight = '#fff1eb';

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsRecording(false);
        setShowWelcome(false);
      };

      recognition.onerror = (event) => {
        setError('Speech recognition error');
        console.error('Speech recognition error:', event);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setError('Speech recognition not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations]);

  useEffect(() => {
    if (message.length > 0) {
      setShowWelcome(false);
    }
  }, [message]);

  const handleAudioInput = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not available');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setError(null);
    setLoading(true);
    setShowWelcome(false);

    try {
      const userMessage = {
        type: 'user',
        text: message
      };
      
      setConversations(prev => [...prev, userMessage]);
      
      const response = await fetch(ANSWER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: message })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to get answer');
      }
      
      const botResponse = {
        type: 'bot',
        text: data.response.answer
      };
      
      setConversations(prev => [...prev, botResponse]);
      setLoading(false);
      setMessage('');
    } catch (error) {
      console.error("Error processing message:", error);
      setError(`An error occurred: ${error.message}`);
      setLoading(false);
    }
  };

  const handleCopy = (index) => {
    navigator.clipboard.writeText(conversations[index].text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header 
        className="bg-white p-4 shadow-md" 
        style={{ borderBottom: `3px solid ${brandColorLight}` }}
      >
        <div className="container mx-auto flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: brandColorVeryLight }}>
            <BsChatLeftText className="text-2xl" style={{ color: brandColor }} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Swiggy Instamart</h1>
        </div>
      </header>

      <div className="flex-grow overflow-hidden container mx-auto flex flex-col p-4">
        <div className="flex-grow overflow-y-auto mb-4 rounded-lg bg-white shadow-md border border-gray-100">
          <div className="p-4 space-y-6">
            {showWelcome && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-5 rounded-2xl text-gray-800 border border-gray-200 shadow-sm max-w-3xl">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 bg-white">
                      <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
                    </div>
                    <span className="font-semibold">Assistant</span>
                  </div>
                  <div className="whitespace-pre-wrap">
                    Welcome back, Vishnu! 👋 How can I assist you today?
                  </div>
                </div>
              </div>
            )}

            {conversations.length === 0 && !showWelcome ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                <div 
                  className="flex items-center justify-center w-20 h-20 rounded-full mb-4" 
                  style={{ backgroundColor: brandColorVeryLight }}
                >
                  <BsChatLeftText className="text-5xl" style={{ color: brandColorLight }} />
                </div>
                <p className="text-lg">No messages yet. Start a conversation!</p>
              </div>
            ) : (
              conversations.map((convo, index) => (
                <div 
                  key={index} 
                  className={`flex ${convo.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  ref={index === conversations.length - 1 ? lastMessageRef : null}
                >
                  <div 
                    className={`relative max-w-3xl p-4 rounded-2xl shadow-sm ${
                      convo.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div 
                        className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 ${
                          convo.type === 'user' ? 'bg-blue-700' : 'bg-white'
                        }`}
                      >
                        {convo.type === 'user' ? (
                          <FaUser className="text-xs text-white" />
                        ) : (
                          <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
                        )}
                      </div>
                      <span className="font-semibold">
                        {convo.type === 'user' ? 'You' : 'Assistant'}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">{convo.text}</div>
                    
                    {convo.type === 'bot' && (
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm hover:shadow"
                        onClick={() => handleCopy(index)}
                        title="Copy message"
                      >
                        <FiCopy style={{ color: copiedIndex === index ? brandColor : '' }} />
                        {copiedIndex === index && (
                          <span className="absolute -top-8 right-0 text-white text-xs py-1 px-2 rounded-md shadow-md" style={{ backgroundColor: brandColor }}>
                            Copied!
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-5 rounded-2xl text-gray-800 border border-gray-200 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 bg-white">
                      <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
                    </div>
                    <span className="font-semibold mr-3">Assistant</span>
                    <div className="loader">
                      <div className="flex space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full animate-bounce" 
                          style={{ 
                            backgroundColor: brandColor,
                            animationDelay: '0s',
                            animationDuration: '0.6s'
                          }}
                        ></div>
                        <div 
                          className="w-3 h-3 rounded-full animate-bounce" 
                          style={{ 
                            backgroundColor: brandColor,
                            animationDelay: '0.2s',
                            animationDuration: '0.6s'
                          }}
                        ></div>
                        <div 
                          className="w-3 h-3 rounded-full animate-bounce" 
                          style={{ 
                            backgroundColor: brandColor,
                            animationDelay: '0.4s',
                            animationDuration: '0.6s'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-3 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
          <div className="flex items-center">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
              style={{ 
                borderRadius: '0.5rem 0 0 0.5rem',
                focusRing: brandColorLight
              }}
              placeholder="Type your message here..."
              rows="2"
            />
            <div className="flex flex-col border-t border-r border-b border-gray-300 rounded-r-lg bg-gray-50 h-full">
              <button
                onClick={handleAudioInput}
                className="px-4 py-3 border-b border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                style={{ 
                  color: isRecording ? 'red' : brandColor,
                  borderRadius: '0 0.5rem 0 0'
                }}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                <FaMicrophone className={isRecording ? 'animate-pulse' : ''} />
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-3 transition-colors duration-200 ${message.trim() && !loading ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
                style={{ 
                  color: brandColor,
                  borderRadius: '0 0 0.5rem 0'
                }}
                title="Send message"
                disabled={!message.trim() || loading}
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;