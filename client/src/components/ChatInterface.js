// import React, { useState, useRef, useEffect } from 'react';
// import { FiCopy, FiSend } from 'react-icons/fi';
// import { FaMicrophone } from 'react-icons/fa';
// import { BsChatLeftText } from 'react-icons/bs';
// import SessionSidebar from './SessionSidebar';

// function ChatInterface() {
//   const [message, setMessage] = useState('');
//   const [conversations, setConversations] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [activeSession, setActiveSession] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState(null);
//   const [loadingMessage, setLoadingMessage] = useState(false);
//   const [loadingSessions, setLoadingSessions] = useState(false);
//   const [loadingConversation, setLoadingConversation] = useState(false);
//   const [copiedIndex, setCopiedIndex] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const lastMessageRef = useRef(null);
//   const recognitionRef = useRef(null);

//   const API_URL = 'http://127.0.0.1:5020';
//   const ANSWER_ENDPOINT = `${API_URL}/api/answer`;

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   useEffect(() => {
//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onresult = (event) => {
//         setMessage(event.results[0][0].transcript);
//         setIsRecording(false);
//         setShowWelcome(false);
//       };

//       recognition.onerror = () => {
//         setError('Speech recognition error');
//         setIsRecording(false);
//       };

//       recognitionRef.current = recognition;
//     } else {
//       setError('Speech recognition not supported in this browser.');
//     }
//   }, []);

//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [conversations]);

//   useEffect(() => {
//     if (message.length > 0) {
//       setShowWelcome(false);
//     }
//   }, [message]);

//   const fetchSessions = async () => {
//     try {
//       setLoadingSessions(true);
//       const response = await fetch(`${API_URL}/api/sessions/ids-with-questions`);
//       const data = await response.json();
//       setSessions(data.sessions || []);
//       if (data.sessions.length > 0) {
//         setActiveSession(data.sessions[0].session_id);
//         fetchConversation(data.sessions[0].session_id);
//       }
//     } catch (error) {
//       console.error('Error fetching sessions:', error);
//       setError('Error fetching sessions.');
//     } finally {
//       setLoadingSessions(false);
//     }
//   };

//   const fetchConversation = async (sessionId) => {
//     try {
//       setLoadingConversation(true);
//       const response = await fetch(`${API_URL}/api/conversations/${sessionId}`);
//       const data = await response.json();
//       setConversations(data.conversations || []);
//     } catch (error) {
//       console.error('Error fetching conversation:', error);
//       setError('Error fetching conversation.');
//     } finally {
//       setLoadingConversation(false);
//     }
//   };

//   const handleAudioInput = () => {
//     if (!recognitionRef.current) return setError('Speech recognition not available');
//     isRecording ? recognitionRef.current.stop() : recognitionRef.current.start();
//     setIsRecording(!isRecording);
//   };

//   const handleSubmit = async () => {
//     if (!message.trim()) return;

//     setError(null);
//     setLoadingMessage(true);
//     setShowWelcome(false);

//     try {
//       const userMessage = { type: 'user', text: message };
//       setConversations((prev) => [...prev, userMessage]);

//       const response = await fetch(ANSWER_ENDPOINT, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ question: message, session_id: activeSession }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//       const data = await response.json();
//       if (data.status !== 'success') throw new Error(data.message || 'Failed to get answer');

//       const botResponse = { type: 'bot', text: data.response.answer };
//       setConversations((prev) => [...prev, botResponse]);
//       setMessage('');
//     } catch (error) {
//       setError(`An error occurred: ${error.message}`);
//     } finally {
//       setLoadingMessage(false);
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

//   const handleSessionSelect = (sessionId) => {
//     setActiveSession(sessionId);
//     fetchConversation(sessionId);
//   };

//   const handleNewSession = async () => {
//     try {
//       // Create a new session
//       const response = await fetch(`${API_URL}/api/session/new`, { method: 'POST' });
//       const data = await response.json();
//       if (!data.session_id) throw new Error('Failed to create new session');
//       const newSessionObj = {
//         session_id: data.session_id,
//         first_question: "", // or null if no first question yet
//       };

//       setSessions((prev) => [newSessionObj, ...prev]);
//       setActiveSession(data.session_id);
//       setConversations([]);
//       setMessage('');
//     } catch (error) {
//       console.error('Error creating new session:', error);
//       setError('Error creating new session.');
//     }
//   };

//   const filteredSessions = sessions.filter((session) =>
//     (session.first_question || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <SessionSidebar
//         sessions={filteredSessions}
//         onSelectSession={handleSessionSelect}
//         onCreateNew={handleNewSession}
//         loading={loadingSessions}
//       />

//       {/* Chat Section */}
//       <div className="flex flex-col flex-grow bg-gray-50">
//         <header className="bg-white p-4 shadow-md border-b-2 border-orange-300">
//           <div className="container mx-auto flex items-center">
//             <BsChatLeftText className="text-2xl text-orange-500 mr-3" />
//             <h1 className="text-xl font-bold text-gray-800">Swiggy Instamart</h1>
//           </div>
//         </header>

//         <div className="flex-grow overflow-hidden container mx-auto flex flex-col p-4">
//           <div className="flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow-md border border-gray-100">
//             {loadingConversation ? (
//               <div className="text-center text-gray-500">Loading conversation...</div>
//             ) : (
//               conversations.map((convo, index) => (
//                 <div key={index} className={`flex ${convo.type === 'user' ? 'justify-end' : 'justify-start'}`} ref={index === conversations.length - 1 ? lastMessageRef : null}>
//                   <div className={`relative max-w-3xl p-4 rounded-2xl shadow-sm ${convo.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
//                     <div className="flex items-center mb-2">
//                       {convo.type === 'bot' && <BsChatLeftText className="text-xs text-orange-500 mr-2" />}
//                       <span className="font-semibold">{convo.type === 'user' ? 'You' : 'Assistant'}</span>
//                     </div>
//                     <div className="whitespace-pre-wrap">{convo.text}</div>
//                     {convo.type === 'bot' && (
//                       <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1" onClick={() => handleCopy(index)}>
//                         <FiCopy style={{ color: copiedIndex === index ? 'orange' : '' }} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Input Section */}
//           <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 flex">
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="flex-grow border border-gray-300 rounded-l-lg p-3 resize-none"
//               placeholder="Type your message..."
//             />
//             <button onClick={handleAudioInput} className="px-4 py-3 border-l border-gray-300">
//               <FaMicrophone className={isRecording ? 'text-red-500 animate-pulse' : 'text-orange-500'} />
//             </button>
//             <button onClick={handleSubmit} className="px-4 py-3 bg-orange-500 text-white rounded-r-lg disabled:opacity-50" disabled={!message.trim() || loadingMessage}>
//               {loadingMessage ? <span className="animate-spin">⏳</span> : <FiSend />}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatInterface;


// import React, { useState, useRef, useEffect } from 'react';
// import { FiCopy, FiSend, FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
// import { FaMicrophone, FaUser, FaBars } from 'react-icons/fa';
// import { BsChatLeftText } from 'react-icons/bs';
// import SessionSidebar from './SessionSidebar';

// // Main ChatInterface component
// function ChatInterface() {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [conversations, setConversations] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [copiedIndex, setCopiedIndex] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [sessions, setSessions] = useState([]);
//   const [currentSessionId, setCurrentSessionId] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isLoadingSessions, setIsLoadingSessions] = useState(true);
//   const lastMessageRef = useRef(null);
//   const recognitionRef = useRef(null);

//   // const API_URL = 'https://instamart-bq8h.onrender.com';
//   const API_URL = 'http://127.0.0.1:5020';
//   const ANSWER_ENDPOINT = `${API_URL}/api/answer`;
//   const SESSIONS_ENDPOINT = `${API_URL}/api/sessions/ids-with-questions`;

//   const brandColor = '#fe5005';
//   const brandColorLight = '#ff8f5a';
//   const brandColorVeryLight = '#fff1eb';

//   // Fetch sessions
//   const fetchSessions = async () => {
//     try {
//       setIsLoadingSessions(true);
//       const response = await fetch(SESSIONS_ENDPOINT);
//       const data = await response.json();
//       if (data.status === 'success') {
//         setSessions(data.sessions);
//         if (data.sessions.length > 0 && !currentSessionId) {
//           setCurrentSessionId(data.sessions[0].session_id);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching sessions:", err);
//       setError('Failed to load conversations');
//     } finally {
//       setIsLoadingSessions(false);
//     }
//   };

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   // Handle new messages
//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [conversations]);

//   // Speech recognition setup
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
//         setShowWelcome(false);
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

//   const handleNewSession = async () => {
//     setConversations([]);
//     setShowWelcome(true);
//     try {
//       const response = await fetch(`${API_URL}/api/session/new`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//       });
      
//       // First await the response.json() Promise
//       const data = await response.json();
//       console.log(data);
      
//       // Then access the session_id from the parsed data
//       setCurrentSessionId(data.session_id);
//     }
//     catch(error) {
//       setCurrentSessionId(`temp_${Date.now()}`);
//     }
//     setMessage('');
// };

// // Fix for handleSelectSession function in ChatInterface.js

// const handleSelectSession = async (sessionId) => {
//   try {
//     setLoading(true);
    
//     // Fetch the session data
//     const response = await fetch(`${API_URL}/api/conversations/${sessionId}`);
//     const data = await response.json();
//     console.log(data);
    
//     // Check if the response is successful and contains conversations
//     if (!data || data.status !== "success" || !data.conversations) {
//       console.error("Invalid session data:", data);
//       setError("Could not load session data. Invalid response format.");
//       setLoading(false);
//       return;
//     }
    
//     // Map the conversations to your message format
//     const formattedMessages = data.conversations.map((msg) => ({
//       type: msg.type, // Keep the original type ('user' or 'bot')
//       text: msg.text
//     }));
    
//     // Update the conversations state with the loaded session data
//     setConversations(formattedMessages);
//     setCurrentSessionId(sessionId);
//     setShowWelcome(false); // Hide the welcome message when a session is loaded
    
//     // Clear any previous errors
//     setError(null);
    
//     setLoading(false);
//   } catch (error) {
//     console.error("Error loading session:", error);
//     setError("Failed to load chat session");
//     setLoading(false);
//   }
// };

//   const handleSubmit = async () => {
//     if (!message.trim()) return;
    
//     setError(null);
//     setLoading(true);
//     setShowWelcome(false);

//     try {
//       const userMessage = {
//         type: 'user',
//         text: message
//       };
      
//       setConversations(prev => [...prev, userMessage]);
      
//       const response = await fetch(ANSWER_ENDPOINT, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ 
//           question: message,
//           session_id: currentSessionId
//         })
//       });
//       console.log(currentSessionId)
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.status !== 'success') {
//         throw new Error(data.message || 'Failed to get answer');
//       }
      
//       const botResponse = {
//         type: 'bot',
//         text: data.response.answer
//       };
      
//       setConversations(prev => [...prev, botResponse]);
      
//       // Refresh sessions to get the latest
//       if (!currentSessionId || currentSessionId.startsWith('temp_')) {
//         await fetchSessions();
//       }
//     } catch (error) {
//       console.error("Error processing message:", error);
//       setError(`An error occurred: ${error.message}`);
//     } finally {
//       setLoading(false);
//       setMessage('');
//     }
//   };

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
//     <div className="flex h-screen bg-gray-50">
//       {/* Mobile sidebar toggle */}
//       <button 
//         className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         <FaBars className="text-gray-600" />
//       </button>

//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//         md:translate-x-0 transform transition-transform duration-200 ease-in-out 
//         fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200`}
//       >
//         <SessionSidebar 
//           sessions={sessions}
//           onSelectSession={handleSelectSession}
//           onCreateNew={handleNewSession}
//           currentSessionId={currentSessionId}
//         />
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div 
//           className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main chat area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="bg-white p-4 shadow-md" style={{ borderBottom: `3px solid ${brandColorLight}` }}>
//           <div className="container mx-auto flex items-center">
//             <button 
//               className="md:hidden mr-3"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//               <FaBars className="text-xl" />
//             </button>
//             <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: brandColorVeryLight }}>
//               <BsChatLeftText className="text-2xl" style={{ color: brandColor }} />
//             </div>
//             <h1 className="text-xl font-bold text-gray-800">Swiggy Instamart</h1>
//           </div>
//         </header>

//         <div className="flex-grow overflow-hidden container mx-auto flex flex-col p-4">
//           <div className="flex-grow overflow-y-auto mb-4 rounded-lg bg-white shadow-md border border-gray-100">
//             <div className="p-4 space-y-6">
//               {showWelcome && (
//                 <div className="flex justify-start">
//                   <div className="bg-gray-100 p-5 rounded-2xl text-gray-800 border border-gray-200 shadow-sm max-w-3xl">
//                     <div className="flex items-center mb-2">
//                       <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 bg-white">
//                         <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
//                       </div>
//                       <span className="font-semibold">Assistant</span>
//                     </div>
//                     <div className="whitespace-pre-wrap">
//                       Welcome back, Vishnu! 👋 How can I assist you today?
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {conversations.length === 0 && !showWelcome ? (
//                 <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
//                   <div 
//                     className="flex items-center justify-center w-20 h-20 rounded-full mb-4" 
//                     style={{ backgroundColor: brandColorVeryLight }}
//                   >
//                     <BsChatLeftText className="text-5xl" style={{ color: brandColorLight }} />
//                   </div>
//                   <p className="text-lg">No messages yet. Start a conversation!</p>
//                 </div>
//               ) : (
//                 conversations.map((convo, index) => (
//                   <div 
//                     key={index} 
//                     className={`flex ${convo.type === 'user' ? 'justify-end' : 'justify-start'}`}
//                     ref={index === conversations.length - 1 ? lastMessageRef : null}
//                   >
//                     <div 
//                       className={`relative max-w-3xl p-4 rounded-2xl shadow-sm ${
//                         convo.type === 'user' 
//                           ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
//                           : 'bg-gray-100 text-gray-800 border border-gray-200'
//                       }`}
//                     >
//                       <div className="flex items-center mb-2">
//                         <div 
//                           className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 ${
//                             convo.type === 'user' ? 'bg-blue-700' : 'bg-white'
//                           }`}
//                         >
//                           {convo.type === 'user' ? (
//                             <FaUser className="text-xs text-white" />
//                           ) : (
//                             <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
//                           )}
//                         </div>
//                         <span className="font-semibold">
//                           {convo.type === 'user' ? 'You' : 'Assistant'}
//                         </span>
//                       </div>
//                       <div className="whitespace-pre-wrap">{convo.text}</div>
                      
//                       {convo.type === 'bot' && (
//                         <button
//                           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm hover:shadow"
//                           onClick={() => handleCopy(index)}
//                           title="Copy message"
//                         >
//                           <FiCopy style={{ color: copiedIndex === index ? brandColor : '' }} />
//                           {copiedIndex === index && (
//                             <span className="absolute -top-8 right-0 text-white text-xs py-1 px-2 rounded-md shadow-md" style={{ backgroundColor: brandColor }}>
//                               Copied!
//                             </span>
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//               {loading && (
//                 <div className="flex justify-start">
//                   <div className="bg-gray-100 p-5 rounded-2xl text-gray-800 border border-gray-200 shadow-sm">
//                     <div className="flex items-center">
//                       <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 bg-white">
//                         <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
//                       </div>
//                       <span className="font-semibold mr-3">Assistant</span>
//                       <div className="loader">
//                         <div className="flex space-x-2">
//                           <div 
//                             className="w-3 h-3 rounded-full animate-bounce" 
//                             style={{ 
//                               backgroundColor: brandColor,
//                               animationDelay: '0s',
//                               animationDuration: '0.6s'
//                             }}
//                           ></div>
//                           <div 
//                             className="w-3 h-3 rounded-full animate-bounce" 
//                             style={{ 
//                               backgroundColor: brandColor,
//                               animationDelay: '0.2s',
//                               animationDuration: '0.6s'
//                             }}
//                           ></div>
//                           <div 
//                             className="w-3 h-3 rounded-full animate-bounce" 
//                             style={{ 
//                               backgroundColor: brandColor,
//                               animationDelay: '0.4s',
//                               animationDuration: '0.6s'
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
//             {error && (
//               <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-3 rounded">
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   <p>{error}</p>
//                 </div>
//               </div>
//             )}
//             <div className="flex items-center">
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
//                 style={{ 
//                   borderRadius: '0.5rem 0 0 0.5rem',
//                   focusRing: brandColorLight
//                 }}
//                 placeholder="Type your message here..."
//                 rows="2"
//               />
//               <div className="flex flex-col border-t border-r border-b border-gray-300 rounded-r-lg bg-gray-50 h-full">
//                 <button
//                   onClick={handleAudioInput}
//                   className="px-4 py-3 border-b border-gray-300 hover:bg-gray-100 transition-colors duration-200"
//                   style={{ 
//                     color: isRecording ? 'red' : brandColor,
//                     borderRadius: '0 0.5rem 0 0'
//                   }}
//                   title={isRecording ? 'Stop recording' : 'Start voice input'}
//                 >
//                   <FaMicrophone className={isRecording ? 'animate-pulse' : ''} />
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   className={`px-4 py-3 transition-colors duration-200 ${message.trim() && !loading ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
//                   style={{ 
//                     color: brandColor,
//                     borderRadius: '0 0 0.5rem 0'
//                   }}
//                   title="Send message"
//                   disabled={!message.trim() || loading}
//                 >
//                   <FiSend />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatInterface;



// import React, { useState, useRef, useEffect } from 'react';
// import { FiCopy, FiSend, FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
// import { FaMicrophone, FaUser, FaBars } from 'react-icons/fa';
// import { BsChatLeftText } from 'react-icons/bs';
// import SessionSidebar from './SessionSidebar';

// // Main ChatInterface component
// function ChatInterface() {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [conversations, setConversations] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [copiedIndex, setCopiedIndex] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [sessions, setSessions] = useState([]);
//   const [currentSessionId, setCurrentSessionId] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isLoadingSessions, setIsLoadingSessions] = useState(true);
//   const lastMessageRef = useRef(null);
//   const recognitionRef = useRef(null);

//   // const API_URL = 'https://instamart-bq8h.onrender.com';
//   const API_URL = 'http://127.0.0.1:5020';
//   const ANSWER_ENDPOINT = `${API_URL}/api/answer`;
//   const SESSIONS_ENDPOINT = `${API_URL}/api/sessions/ids-with-questions`;
//   const DELETE_SESSION_ENDPOINT = `${API_URL}/api/sessions`;

//   const brandColor = '#fe5005';
//   const brandColorLight = '#ff8f5a';
//   const brandColorVeryLight = '#fff1eb';

//   // Fetch sessions
//   const fetchSessions = async () => {
//     try {
//       setIsLoadingSessions(true);
//       const response = await fetch(SESSIONS_ENDPOINT);
//       const data = await response.json();
//       if (data.status === 'success') {
//         setSessions(data.sessions);
//         if (data.sessions.length > 0 && !currentSessionId) {
//           setCurrentSessionId(data.sessions[0].session_id);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching sessions:", err);
//       setError('Failed to load conversations');
//     } finally {
//       setIsLoadingSessions(false);
//     }
//   };

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   // Handle new messages
//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [conversations]);

//   // Speech recognition setup
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
//         setShowWelcome(false);
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

//   const handleNewSession = async () => {
//     setConversations([]);
//     setShowWelcome(true);
//     try {
//       const response = await fetch(`${API_URL}/api/session/new`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//       });
      
//       // First await the response.json() Promise
//       const data = await response.json();
//       console.log(data);
      
//       // Then access the session_id from the parsed data
//       setCurrentSessionId(data.session_id);
//     }
//     catch(error) {
//       setCurrentSessionId(`temp_${Date.now()}`);
//     }
//     setMessage('');
//   };

//   const handleDeleteSession = async (sessionId) => {
//     try {
//       const response = await fetch(`${DELETE_SESSION_ENDPOINT}/${sessionId}/delete`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
      
//       const data = await response.json();
      
//       if (data.status === 'success' || data.status === 'warning') {
//         // Show a brief success message
//         setError({
//           type: 'success',
//           message: 'Session deleted successfully'
//         });
        
//         // Clear current session if it was the deleted one
//         if (currentSessionId === sessionId) {
//           setConversations([]);
//           setShowWelcome(true);
//           setCurrentSessionId(null);
//         }
        
//         // Refresh the sessions list
//         await fetchSessions();
        
//         // Clear success message after a delay
//         setTimeout(() => {
//           setError(null);
//         }, 3000);
        
//         return true;
//       } else {
//         throw new Error(data.message || 'Failed to delete session');
//       }
//     } catch (error) {
//       console.error("Error deleting session:", error);
//       setError({
//         type: 'error',
//         message: `Failed to delete session: ${error.message}`
//       });
//       return false;
//     }
//   };

//   const handleSelectSession = async (sessionId) => {
//     try {
//       setLoading(true);
      
//       // Fetch the session data
//       const response = await fetch(`${API_URL}/api/conversations/${sessionId}`);
//       const data = await response.json();
//       console.log(data);
      
//       // Check if the response is successful and contains conversations
//       if (!data || data.status !== "success" || !data.conversations) {
//         console.error("Invalid session data:", data);
//         setError({
//           type: 'error',
//           message: "Could not load session data. Invalid response format."
//         });
//         setLoading(false);
//         return;
//       }
      
//       // Map the conversations to your message format
//       const formattedMessages = data.conversations.map((msg) => ({
//         type: msg.type, // Keep the original type ('user' or 'bot')
//         text: msg.text
//       }));
      
//       // Update the conversations state with the loaded session data
//       setConversations(formattedMessages);
//       setCurrentSessionId(sessionId);
//       setShowWelcome(false); // Hide the welcome message when a session is loaded
      
//       // Clear any previous errors
//       setError(null);
      
//       setLoading(false);
//     } catch (error) {
//       console.error("Error loading session:", error);
//       setError({
//         type: 'error',
//         message: "Failed to load chat session"
//       });
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!message.trim()) return;
    
//     setError(null);
//     setLoading(true);
//     setShowWelcome(false);

//     try {
//       const userMessage = {
//         type: 'user',
//         text: message
//       };
      
//       setConversations(prev => [...prev, userMessage]);
      
//       const response = await fetch(ANSWER_ENDPOINT, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ 
//           question: message,
//           session_id: currentSessionId
//         })
//       });
//       console.log(currentSessionId);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.status !== 'success') {
//         throw new Error(data.message || 'Failed to get answer');
//       }
      
//       const botResponse = {
//         type: 'bot',
//         text: data.response.answer
//       };
      
//       setConversations(prev => [...prev, botResponse]);
      
//       // Refresh sessions to get the latest
//       if (!currentSessionId || currentSessionId.startsWith('temp_')) {
//         await fetchSessions();
//       }
//     } catch (error) {
//       console.error("Error processing message:", error);
//       setError({
//         type: 'error',
//         message: `An error occurred: ${error.message}`
//       });
//     } finally {
//       setLoading(false);
//       setMessage('');
//     }
//   };

//   const handleAudioInput = () => {
//     if (!recognitionRef.current) {
//       setError({
//         type: 'error',
//         message: 'Speech recognition not available'
//       });
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
//     <div className="flex h-screen bg-gray-50">
//       {/* Mobile sidebar toggle */}
//       <button 
//         className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         <FaBars className="text-gray-600" />
//       </button>

//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//         md:translate-x-0 transform transition-transform duration-200 ease-in-out 
//         fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200`}
//       >
//         <SessionSidebar 
//           sessions={sessions}
//           onSelectSession={handleSelectSession}
//           onCreateNew={handleNewSession}
//           currentSessionId={currentSessionId}
//           onDeleteSession={handleDeleteSession}
//         />
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div 
//           className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main chat area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="bg-white p-4 shadow-md" style={{ borderBottom: `3px solid ${brandColorLight}` }}>
//           <div className="container mx-auto flex items-center">
//             <button 
//               className="md:hidden mr-3"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//               <FaBars className="text-xl" />
//             </button>
//             <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: brandColorVeryLight }}>
//               <BsChatLeftText className="text-2xl" style={{ color: brandColor }} />
//             </div>
//             <h1 className="text-xl font-bold text-gray-800">Swiggy Instamart</h1>
//           </div>
//         </header>

//         <div className="flex-grow overflow-hidden container mx-auto flex flex-col p-4">
//           <div className="flex-grow overflow-y-auto mb-4 rounded-lg bg-white shadow-md border border-gray-100">
//             <div className="p-4 space-y-6">
//               {showWelcome && (
//                 <div className="flex justify-start">
//                   <div className="bg-gray-100 p-5 rounded-2xl text-gray-800 border border-gray-200 shadow-sm max-w-3xl">
//                     <div className="flex items-center mb-2">
//                       <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 bg-white">
//                         <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
//                       </div>
//                       <span className="font-semibold">Assistant</span>
//                     </div>
//                     <div className="whitespace-pre-wrap">
//                       Welcome back, Vishnu! 👋 How can I assist you today?
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {conversations.length === 0 && !showWelcome ? (
//                 <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
//                   <div 
//                     className="flex items-center justify-center w-20 h-20 rounded-full mb-4" 
//                     style={{ backgroundColor: brandColorVeryLight }}
//                   >
//                     <BsChatLeftText className="text-5xl" style={{ color: brandColorLight }} />
//                   </div>
//                   <p className="text-lg">No messages yet. Start a conversation!</p>
//                 </div>
//               ) : (
//                 conversations.map((convo, index) => (
//                   <div 
//                     key={index} 
//                     className={`flex ${convo.type === 'user' ? 'justify-end' : 'justify-start'}`}
//                     ref={index === conversations.length - 1 ? lastMessageRef : null}
//                   >
//                     <div 
//                       className={`relative max-w-3xl p-4 rounded-2xl shadow-sm ${
//                         convo.type === 'user' 
//                           ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
//                           : 'bg-gray-100 text-gray-800 border border-gray-200'
//                       }`}
//                     >
//                       <div className="flex items-center mb-2">
//                         <div 
//                           className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 ${
//                             convo.type === 'user' ? 'bg-blue-700' : 'bg-white'
//                           }`}
//                         >
//                           {convo.type === 'user' ? (
//                             <FaUser className="text-xs text-white" />
//                           ) : (
//                             <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
//                           )}
//                         </div>
//                         <span className="font-semibold">
//                           {convo.type === 'user' ? 'You' : 'Assistant'}
//                         </span>
//                       </div>
//                       <div className="whitespace-pre-wrap">{convo.text}</div>
                      
//                       {convo.type === 'bot' && (
//                         <button
//                           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 bg-white rounded-full shadow-sm hover:shadow"
//                           onClick={() => handleCopy(index)}
//                           title="Copy message"
//                         >
//                           <FiCopy style={{ color: copiedIndex === index ? brandColor : '' }} />
//                           {copiedIndex === index && (
//                             <span className="absolute -top-8 right-0 text-white text-xs py-1 px-2 rounded-md shadow-md" style={{ backgroundColor: brandColor }}>
//                               Copied!
//                             </span>
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//               {loading && (
//                 <div className="flex justify-start">
//                   <div className="bg-gray-100 p-5 rounded-2xl text-gray-800 border border-gray-200 shadow-sm">
//                     <div className="flex items-center">
//                       <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 bg-white">
//                         <BsChatLeftText className="text-xs" style={{ color: brandColor }} />
//                       </div>
//                       <span className="font-semibold mr-3">Assistant</span>
//                       <div className="loader">
//                         <div className="flex space-x-2">
//                           <div 
//                             className="w-3 h-3 rounded-full animate-bounce" 
//                             style={{ 
//                               backgroundColor: brandColor,
//                               animationDelay: '0s',
//                               animationDuration: '0.6s'
//                             }}
//                           ></div>
//                           <div 
//                             className="w-3 h-3 rounded-full animate-bounce" 
//                             style={{ 
//                               backgroundColor: brandColor,
//                               animationDelay: '0.2s',
//                               animationDuration: '0.6s'
//                             }}
//                           ></div>
//                           <div 
//                             className="w-3 h-3 rounded-full animate-bounce" 
//                             style={{ 
//                               backgroundColor: brandColor,
//                               animationDelay: '0.4s',
//                               animationDuration: '0.6s'
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
//             {error && (
//               <div className={`${error.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'} border-l-4 p-3 mb-3 rounded flex items-center`}>
//                 {error.type === 'success' ? (
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                 ) : (
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                 )}
//                 <p>{error.message}</p>
//               </div>
//             )}
//             <div className="flex items-center">
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
//                 style={{ 
//                   borderRadius: '0.5rem 0 0 0.5rem',
//                   focusRing: brandColorLight
//                 }}
//                 placeholder="Type your message here..."
//                 rows="2"
//               />
//               <div className="flex flex-col border-t border-r border-b border-gray-300 rounded-r-lg bg-gray-50 h-full">
//                 <button
//                   onClick={handleAudioInput}
//                   className="px-4 py-3 border-b border-gray-300 hover:bg-gray-100 transition-colors duration-200"
//                   style={{ 
//                     color: isRecording ? 'red' : brandColor,
//                     borderRadius: '0 0.5rem 0 0'
//                   }}
//                   title={isRecording ? 'Stop recording' : 'Start voice input'}
//                 >
//                   <FaMicrophone className={isRecording ? 'animate-pulse' : ''} />
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   className={`px-4 py-3 transition-colors duration-200 ${message.trim() && !loading ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
//                   style={{ 
//                     color: brandColor,
//                     borderRadius: '0 0 0.5rem 0'
//                   }}
//                   title="Send message"
//                   disabled={!message.trim() || loading}
//                 >
//                   <FiSend />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatInterface;



// import React, { useState } from 'react';
// import { FaBars } from 'react-icons/fa';
// import SessionSidebar from './SessionSidebar';
// import Header from './Header';
// import MessageList from './MessageList';
// import InputArea from './InputArea';
// import useSession from '../hooks/useSession';
// import useChat from '../hooks/useChat';
// import useSpeechRecognition from '../hooks/useSpeechRecognition';

// function ChatInterface() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
  
//   const { 
//     sessions,
//     currentSessionId,
//     conversations,
//     setConversations,
//     showWelcome,
//     setShowWelcome,
//     error,
//     setError,
//     loading,
//     setLoading,
//     refreshSessions,
//     handleNewSession,
//     handleDeleteSession,
//     handleSelectSession
//   } = useSession();
  
//   const {
//     message,
//     setMessage,
//     copiedIndex,
//     handleSubmit,
//     handleCopy,
//     handleKeyPress
//   } = useChat(
//     conversations, 
//     setConversations, 
//     currentSessionId, 
//     setError, 
//     setLoading, 
//     setShowWelcome, 
//     refreshSessions
//   );
  
//   const { isRecording, toggleRecording } = useSpeechRecognition((transcript) => {
//     setMessage(transcript);
//     setShowWelcome(false);
//   });
  
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Mobile sidebar toggle */}
//       <button 
//         className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
//         onClick={toggleSidebar}
//       >
//         <FaBars className="text-gray-600" />
//       </button>

//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//         md:translate-x-0 transform transition-transform duration-200 ease-in-out 
//         fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200`}
//       >
//         <SessionSidebar 
//           sessions={sessions}
//           onSelectSession={handleSelectSession}
//           onCreateNew={handleNewSession}
//           currentSessionId={currentSessionId}
//           onDeleteSession={handleDeleteSession}
//         />
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div 
//           className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={toggleSidebar}
//         />
//       )}

//       {/* Main chat area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header toggleSidebar={toggleSidebar} />

//         <div className="flex-grow overflow-hidden container mx-auto flex flex-col p-4">
//           <div className="flex-grow overflow-y-auto mb-4 rounded-lg bg-white shadow-md border border-gray-100">
//             <MessageList 
//               conversations={conversations}
//               showWelcome={showWelcome}
//               loading={loading}
//               copiedIndex={copiedIndex}
//               handleCopy={handleCopy}
//             />
//           </div>

//           <InputArea 
//             message={message}
//             setMessage={setMessage}
//             handleSubmit={handleSubmit}
//             handleKeyPress={handleKeyPress}
//             isRecording={isRecording}
//             toggleRecording={toggleRecording}
//             loading={loading}
//             error={error}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatInterface;


// import React, { useState } from 'react';
// import { FaBars } from 'react-icons/fa';
// import SessionSidebar from './SessionSidebar';
// import Header from './Header';
// import MessageList from './MessageList';
// import InputArea from './InputArea';
// import useSession from '../hooks/useSession';
// import useChat from '../hooks/useChat';
// import useSpeechRecognition from '../hooks/useSpeechRecognition';

// function ChatInterface() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
  
//   const { 
//     sessions,
//     currentSessionId,
//     conversations,
//     setConversations,
//     showWelcome,
//     setShowWelcome,
//     error,
//     setError,
//     loading,
//     setLoading,
//     refreshSessions,
//     handleNewSession,
//     handleDeleteSession,
//     handleSelectSession
//   } = useSession();
  
//   const {
//     message,
//     setMessage,
//     copiedIndex,
//     handleSubmit,
//     handleCopy,
//     handleKeyPress
//   } = useChat(
//     conversations, 
//     setConversations, 
//     currentSessionId, 
//     setError, 
//     setLoading, 
//     setShowWelcome, 
//     refreshSessions,
//     handleNewSession // Added handleNewSession to useChat
//   );
  
//   const { isRecording, toggleRecording } = useSpeechRecognition((transcript) => {
//     setMessage(transcript);
//     setShowWelcome(false);
//   });
  
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Mobile sidebar toggle */}
//       <button 
//         className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
//         onClick={toggleSidebar}
//       >
//         <FaBars className="text-gray-600" />
//       </button>

//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//         md:translate-x-0 transform transition-transform duration-200 ease-in-out 
//         fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200`}
//       >
//         <SessionSidebar 
//           sessions={sessions}
//           onSelectSession={handleSelectSession}
//           onCreateNew={handleNewSession}
//           currentSessionId={currentSessionId}
//           onDeleteSession={handleDeleteSession}
//         />
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div 
//           className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={toggleSidebar}
//         />
//       )}

//       {/* Main chat area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header toggleSidebar={toggleSidebar} />

//         <div className="flex-grow overflow-hidden container mx-auto flex flex-col p-4">
//           <div className="flex-grow overflow-y-auto mb-4 rounded-lg bg-white shadow-md border border-gray-100">
//             <MessageList 
//               conversations={conversations}
//               showWelcome={showWelcome}
//               loading={loading}
//               copiedIndex={copiedIndex}
//               handleCopy={handleCopy}
//               setMessage={setMessage}
//               handleSubmit={handleSubmit}
//             />
//           </div>

//           <InputArea 
//             message={message}
//             setMessage={setMessage}
//             handleSubmit={handleSubmit}
//             handleKeyPress={handleKeyPress}
//             isRecording={isRecording}
//             toggleRecording={toggleRecording}
//             loading={loading}
//             error={error}
//             conversations={conversations}
//             onNewSession={handleNewSession}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatInterface;

// import React, { useState, useEffect, useCallback } from 'react';
// import { FaBars } from 'react-icons/fa';
// import SessionSidebar from './SessionSidebar';
// import Header from './Header';
// import MessageList from './MessageList';
// import InputArea from './InputArea';
// import useSession from '../hooks/useSession';
// import useChat from '../hooks/useChat';
// import useSpeechRecognition from '../hooks/useSpeechRecognition';

// function ChatInterface() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
  
//   const {
//     sessions,
//     currentSessionId,
//     conversations,
//     setConversations,
//     showWelcome,
//     setShowWelcome,
//     error,
//     setError,
//     loading,
//     setLoading,
//     refreshSessions,
//     handleNewSession,
//     handleDeleteSession,
//     handleSelectSession
//   } = useSession();
  
//   // Initialize chat with the proper session ID
//   const {
//     message,
//     setMessage,
//     copiedIndex,
//     handleSubmit: originalHandleSubmit,
//     handleCopy,
//     handleKeyPress
//   } = useChat(
//     conversations, 
//     setConversations, 
//     currentSessionId, 
//     setError, 
//     setLoading, 
//     setShowWelcome, 
//     refreshSessions,
//     handleNewSession
//   );
  
//   // Wrap the handleSubmit to ensure we have a valid session ID
//   const handleSubmit = useCallback(async (e) => {
//     if (e) e.preventDefault();
    
//     // If no current session, create one first
//     let sessionIdToUse = currentSessionId;
    
//     if (!sessionIdToUse) {
//       console.log("No session ID found, creating new session before submitting message");
//       try {
//         sessionIdToUse = await handleNewSession();
//         console.log("Created new session:", sessionIdToUse);
//       } catch (err) {
//         console.error("Failed to create session before submitting message:", err);
//         setError({
//           type: 'error',
//           message: 'Failed to create chat session. Please try again.'
//         });
//         return;
//       }
//     }
    
//     // Now call the original submit handler
//     return originalHandleSubmit(e, sessionIdToUse);
//   }, [currentSessionId, originalHandleSubmit, handleNewSession, setError]);

//   const { isRecording, toggleRecording } = useSpeechRecognition((transcript) => {
//     setMessage(transcript);
//     setShowWelcome(false);
//   });
  
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Mobile sidebar toggle */}
//       <button 
//         className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
//         onClick={toggleSidebar}
//       >
//         <FaBars className="text-gray-600" />
//       </button>
      
//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//         md:translate-x-0 transform transition-transform duration-200 ease-in-out 
//         fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200`}
//       >
//         <SessionSidebar 
//           sessions={sessions}
//           onSelectSession={handleSelectSession}
//           onCreateNew={handleNewSession}
//           currentSessionId={currentSessionId}
//           onDeleteSession={handleDeleteSession}
//         />
//       </div>
      
//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div 
//           className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={toggleSidebar}
//         />
//       )}
      
//       {/* Main chat area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header toggleSidebar={toggleSidebar} />
//         <div className="flex-grow overflow-hidden container mx-auto flex flex-col p-4">
//           <div className="flex-grow overflow-y-auto mb-4 rounded-lg bg-white shadow-md border border-gray-100">
//             <MessageList 
//               conversations={conversations}
//               showWelcome={showWelcome}
//               loading={loading}
//               copiedIndex={copiedIndex}
//               handleCopy={handleCopy}
//               setMessage={setMessage}
//               handleSubmit={handleSubmit}
//             />
//           </div>
//           <InputArea 
//             message={message}
//             setMessage={setMessage}
//             handleSubmit={handleSubmit}
//             handleKeyPress={handleKeyPress}
//             isRecording={isRecording}
//             toggleRecording={toggleRecording}
//             loading={loading}
//             error={error}
//             conversations={conversations}
//             onNewSession={handleNewSession}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatInterface;


import React, { useState, useEffect, useCallback } from 'react';
import { FaBars } from 'react-icons/fa';
import SessionSidebar from './SessionSidebar';
import Header from './Header';
import MessageList from './MessageList';
import InputArea from './InputArea';
import useSession from '../hooks/useSession';
import useChat from '../hooks/useChat';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

// NEW: Import modal components
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';
import SupportTicketsModal from './SupportTicketsModal';

function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // NEW: Modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);

  const {
    sessions,
    currentSessionId,
    conversations,
    setConversations,
    showWelcome,
    setShowWelcome,
    error,
    setError,
    loading,
    setLoading,
    refreshSessions,
    handleNewSession,
    handleDeleteSession,
    handleSelectSession
  } = useSession();

  const {
    message,
    setMessage,
    copiedIndex,
    handleSubmit: originalHandleSubmit,
    handleCopy,
    handleKeyPress
  } = useChat(
    conversations,
    setConversations,
    currentSessionId,
    setError,
    setLoading,
    setShowWelcome,
    refreshSessions,
    handleNewSession
  );

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    let sessionIdToUse = currentSessionId;

    if (!sessionIdToUse) {
      try {
        sessionIdToUse = await handleNewSession();
      } catch (err) {
        setError({ type: 'error', message: 'Failed to create chat session. Please try again.' });
        return;
      }
    }

    return originalHandleSubmit(e, sessionIdToUse);
  }, [currentSessionId, originalHandleSubmit, handleNewSession, setError]);

  const { isRecording, toggleRecording } = useSpeechRecognition((transcript) => {
    setMessage(transcript);
    setShowWelcome(false);
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={toggleSidebar}
      >
        <FaBars className="text-gray-600" />
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transform transition-transform duration-200 ease-in-out 
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200`}
      >
        <SessionSidebar 
          sessions={sessions}
          onSelectSession={handleSelectSession}
          onCreateNew={handleNewSession}
          currentSessionId={currentSessionId}
          onDeleteSession={handleDeleteSession}

          // NEW: handlers passed to Sidebar
          onShowProfile={() => setShowProfileModal(true)}
          onShowSettings={() => setShowSettingsModal(true)}
          onShowTickets={() => setShowTicketsModal(true)}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-grow overflow-hidden container mx-auto flex flex-col p-4">
          <div className="flex-grow overflow-y-auto mb-4 rounded-lg bg-white shadow-md border border-gray-100">
            <MessageList 
              conversations={conversations}
              showWelcome={showWelcome}
              loading={loading}
              copiedIndex={copiedIndex}
              handleCopy={handleCopy}
              setMessage={setMessage}
              handleSubmit={handleSubmit}
            />
          </div>
          <InputArea 
            message={message}
            setMessage={setMessage}
            handleSubmit={handleSubmit}
            handleKeyPress={handleKeyPress}
            isRecording={isRecording}
            toggleRecording={toggleRecording}
            loading={loading}
            error={error}
            conversations={conversations}
            onNewSession={handleNewSession}
          />
        </div>
      </div>

      {/* NEW: Modal Renderings */}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
      {showTicketsModal && <SupportTicketsModal onClose={() => setShowTicketsModal(false)} />}
    </div>
  );
}

export default ChatInterface;
