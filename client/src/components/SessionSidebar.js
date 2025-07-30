


// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   FiSearch, 
//   FiX, 
//   FiChevronDown, 
//   FiChevronUp, 
//   FiPlus, 
//   FiTrash2, 
//   FiLogOut,
//   FiUser,
//   FiSettings 
// } from 'react-icons/fi';
// import { BsChatLeftText } from 'react-icons/bs';

// const SessionSidebar = ({ 
//   sessions, 
//   onSelectSession, 
//   onCreateNew, 
//   currentSessionId, 
//   onDeleteSession, 
//   onLogout,
//   userProfile = { name: 'Vishnu Kumar', initial: 'V' }
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [groupExpanded, setGroupExpanded] = useState({});
//   const [dateGroups, setDateGroups] = useState({});
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const profileMenuRef = useRef(null);

//   // Group sessions by date
//   useEffect(() => {
//     const grouped = sessions.reduce((acc, session) => {
//       const date = new Date(session.created_at);
//       const dateStr = date.toLocaleDateString('en-US', { 
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//       });
      
//       if (!acc[dateStr]) acc[dateStr] = [];
//       acc[dateStr].push(session);
//       return acc;
//     }, {});

//     // Initialize expanded state for groups
//     const expanded = {};
//     Object.keys(grouped).forEach(date => {
//       expanded[date] = true;
//     });
    
//     setGroupExpanded(expanded);
//     setDateGroups(grouped);
//   }, [sessions]);

//   // Close profile menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const toggleGroup = (date) => {
//     setGroupExpanded(prev => ({
//       ...prev,
//       [date]: !prev[date]
//     }));
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Filter sessions based on search term
//   const filteredGroups = Object.entries(dateGroups).reduce((acc, [date, groupSessions]) => {
//     const filtered = groupSessions.filter(session => 
//       session.first_question && session.first_question.toLowerCase().includes(searchTerm.toLowerCase())
//     );
    
//     if (filtered.length > 0) {
//       acc[date] = filtered;
//     }
//     return acc;
//   }, {});

//   return (
//     <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-64">
//       <div className="p-4">
//         <button 
//           onClick={onCreateNew}
//           className="flex items-center justify-center w-full p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors mb-4"
//         >
//           <FiPlus className="mr-2" />
//           New chat
//         </button>
        
//         <div className="relative mb-4">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search conversations..."
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               <FiX className="text-gray-400 hover:text-gray-500" />
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {Object.entries(filteredGroups).map(([date, groupSessions]) => (
//           <div key={date} className="mb-2">
//             <button
//               onClick={() => toggleGroup(date)}
//               className="flex items-center justify-between w-full px-3 py-2 text-left text-xs font-semibold text-gray-500 hover:bg-gray-100"
//             >
//               <span>{date}</span>
//               {groupExpanded[date] ? <FiChevronUp /> : <FiChevronDown />}
//             </button>
            
//             {groupExpanded[date] && groupSessions.map((session) => (
//               <div 
//                 key={session.session_id}
//                 className={`flex items-center p-3 mx-2 rounded-md cursor-pointer hover:bg-gray-100 group ${
//                   currentSessionId === session.session_id ? 'bg-gray-200' : ''
//                 }`}
//               >
//                 <BsChatLeftText className="mr-3 text-gray-500" />
//                 <div 
//                   className="flex-1 min-w-0"
//                   onClick={() => onSelectSession(session.session_id)}
//                 >
//                   <p className="text-sm font-medium text-gray-900 truncate">
//                     {session.first_question || "New conversation"}
//                   </p>
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs text-gray-500">
//                       {formatTime(session.created_at)}
//                     </p>
//                     {session.language && (
//                       <span className="text-xs px-1 bg-gray-200 rounded text-gray-600">
//                         {session.language.toUpperCase()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onDeleteSession(session.session_id);
//                   }}
//                   className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition-all"
//                 >
//                   <FiTrash2 size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         ))}
        
//         {Object.keys(filteredGroups).length === 0 && (
//           <div className="p-4 text-center text-gray-500">
//             {searchTerm ? 'No matching conversations' : 'No conversations yet'}
//           </div>
//         )}
//       </div>

//       <div className="p-4 border-t border-gray-200 relative" ref={profileMenuRef}>
//         <div 
//           className="flex items-center cursor-pointer"
//           onClick={() => setShowProfileMenu(!showProfileMenu)}
//         >
//           <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
//             {userProfile.initial}
//           </div>
//           <span className="text-sm font-medium">{userProfile.name}</span>
//         </div>

//         {showProfileMenu && (
//           <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//             <div className="py-1">
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   // Add your profile navigation logic here
//                 }}
//               >
//                 <FiUser className="mr-2" />
//                 Profile
//               </button>
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   // Add your settings navigation logic here
//                 }}
//               >
//                 <FiSettings className="mr-2" />
//                 Settings
//               </button>
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   onLogout();
//                 }}
//               >
//                 <FiLogOut className="mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SessionSidebar;


// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   FiSearch, 
//   FiX, 
//   FiChevronDown, 
//   FiChevronUp, 
//   FiPlus, 
//   FiTrash2, 
//   FiLogOut,
//   FiUser,
//   FiSettings,
//   FiHelpCircle 
// } from 'react-icons/fi';
// import { BsChatLeftText } from 'react-icons/bs';

// const SessionSidebar = ({ 
//   sessions, 
//   onSelectSession, 
//   onCreateNew, 
//   currentSessionId, 
//   onDeleteSession, 
//   onLogout,
//   onNavigateToProfile,       // new prop
//   onNavigateToSettings,      // new prop
//   onNavigateToSupport,       // new prop
//   userProfile = { name: 'Vishnu Kumar', initial: 'V' }
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [groupExpanded, setGroupExpanded] = useState({});
//   const [dateGroups, setDateGroups] = useState({});
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const profileMenuRef = useRef(null);

//   // Group sessions by date
//   useEffect(() => {
//     const grouped = sessions.reduce((acc, session) => {
//       const date = new Date(session.created_at);
//       const dateStr = date.toLocaleDateString('en-US', { 
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//       });
      
//       if (!acc[dateStr]) acc[dateStr] = [];
//       acc[dateStr].push(session);
//       return acc;
//     }, {});

//     const expanded = {};
//     Object.keys(grouped).forEach(date => {
//       expanded[date] = true;
//     });
    
//     setGroupExpanded(expanded);
//     setDateGroups(grouped);
//   }, [sessions]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const toggleGroup = (date) => {
//     setGroupExpanded(prev => ({
//       ...prev,
//       [date]: !prev[date]
//     }));
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const filteredGroups = Object.entries(dateGroups).reduce((acc, [date, groupSessions]) => {
//     const filtered = groupSessions.filter(session => 
//       session.first_question && session.first_question.toLowerCase().includes(searchTerm.toLowerCase())
//     );
    
//     if (filtered.length > 0) {
//       acc[date] = filtered;
//     }
//     return acc;
//   }, {});

//   return (
//     <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-64">
//       <div className="p-4">
//         <button 
//           onClick={onCreateNew}
//           className="flex items-center justify-center w-full p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors mb-4"
//         >
//           <FiPlus className="mr-2" />
//           New chat
//         </button>
        
//         <div className="relative mb-4">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search conversations..."
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               <FiX className="text-gray-400 hover:text-gray-500" />
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {Object.entries(filteredGroups).map(([date, groupSessions]) => (
//           <div key={date} className="mb-2">
//             <button
//               onClick={() => toggleGroup(date)}
//               className="flex items-center justify-between w-full px-3 py-2 text-left text-xs font-semibold text-gray-500 hover:bg-gray-100"
//             >
//               <span>{date}</span>
//               {groupExpanded[date] ? <FiChevronUp /> : <FiChevronDown />}
//             </button>
            
//             {groupExpanded[date] && groupSessions.map((session) => (
//               <div 
//                 key={session.session_id}
//                 className={`flex items-center p-3 mx-2 rounded-md cursor-pointer hover:bg-gray-100 group ${
//                   currentSessionId === session.session_id ? 'bg-gray-200' : ''
//                 }`}
//               >
//                 <BsChatLeftText className="mr-3 text-gray-500" />
//                 <div 
//                   className="flex-1 min-w-0"
//                   onClick={() => onSelectSession(session.session_id)}
//                 >
//                   <p className="text-sm font-medium text-gray-900 truncate">
//                     {session.first_question || "New conversation"}
//                   </p>
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs text-gray-500">
//                       {formatTime(session.created_at)}
//                     </p>
//                     {session.language && (
//                       <span className="text-xs px-1 bg-gray-200 rounded text-gray-600">
//                         {session.language.toUpperCase()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onDeleteSession(session.session_id);
//                   }}
//                   className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition-all"
//                 >
//                   <FiTrash2 size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         ))}
        
//         {Object.keys(filteredGroups).length === 0 && (
//           <div className="p-4 text-center text-gray-500">
//             {searchTerm ? 'No matching conversations' : 'No conversations yet'}
//           </div>
//         )}
//       </div>

//       <div className="p-4 border-t border-gray-200 relative" ref={profileMenuRef}>
//         <div 
//           className="flex items-center cursor-pointer"
//           onClick={() => setShowProfileMenu(!showProfileMenu)}
//         >
//           <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
//             {userProfile.initial}
//           </div>
//           <span className="text-sm font-medium">{userProfile.name}</span>
//         </div>

//         {showProfileMenu && (
//           <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//             <div className="py-1">
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   onNavigateToProfile();
//                 }}
//               >
//                 <FiUser className="mr-2" />
//                 Profile
//               </button>
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   onNavigateToSettings();
//                 }}
//               >
//                 <FiSettings className="mr-2" />
//                 Settings
//               </button>
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   onNavigateToSupport();
//                 }}
//               >
//                 <FiHelpCircle className="mr-2" />
//                 Support Tickets
//               </button>
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   onLogout();
//                 }}
//               >
//                 <FiLogOut className="mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SessionSidebar;



// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   FiSearch, 
//   FiX, 
//   FiChevronDown, 
//   FiChevronUp, 
//   FiPlus, 
//   FiTrash2, 
//   FiLogOut,
//   FiUser,
//   FiSettings,
//   FiHelpCircle 
// } from 'react-icons/fi';
// import { BsChatLeftText } from 'react-icons/bs';

// const SessionSidebar = ({ 
//   sessions, 
//   onSelectSession, 
//   onCreateNew, 
//   currentSessionId, 
//   onDeleteSession,
//   userProfile = { name: 'Vishnu Kumar', initial: 'V' }
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [groupExpanded, setGroupExpanded] = useState({});
//   const [dateGroups, setDateGroups] = useState({});
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const profileMenuRef = useRef(null);
//   const navigate = useNavigate();

//   // Group sessions by date
//   useEffect(() => {
//     const grouped = sessions.reduce((acc, session) => {
//       const date = new Date(session.created_at);
//       const dateStr = date.toLocaleDateString('en-US', { 
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//       });
      
//       if (!acc[dateStr]) acc[dateStr] = [];
//       acc[dateStr].push(session);
//       return acc;
//     }, {});

//     const expanded = {};
//     Object.keys(grouped).forEach(date => {
//       expanded[date] = true;
//     });
    
//     setGroupExpanded(expanded);
//     setDateGroups(grouped);
//   }, [sessions]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const toggleGroup = (date) => {
//     setGroupExpanded(prev => ({
//       ...prev,
//       [date]: !prev[date]
//     }));
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const filteredGroups = Object.entries(dateGroups).reduce((acc, [date, groupSessions]) => {
//     const filtered = groupSessions.filter(session => 
//       session.first_question && session.first_question.toLowerCase().includes(searchTerm.toLowerCase())
//     );
    
//     if (filtered.length > 0) {
//       acc[date] = filtered;
//     }
//     return acc;
//   }, {});

//   const handleLogout = () => {
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("session_id");
//     localStorage.removeItem("user_data");
//     navigate("/login");
//   };

//   return (
//     <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-64">
//       <div className="p-4">
//         <button 
//           onClick={onCreateNew}
//           className="flex items-center justify-center w-full p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors mb-4"
//         >
//           <FiPlus className="mr-2" />
//           New chat
//         </button>
        
//         <div className="relative mb-4">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search conversations..."
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               <FiX className="text-gray-400 hover:text-gray-500" />
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {Object.entries(filteredGroups).map(([date, groupSessions]) => (
//           <div key={date} className="mb-2">
//             <button
//               onClick={() => toggleGroup(date)}
//               className="flex items-center justify-between w-full px-3 py-2 text-left text-xs font-semibold text-gray-500 hover:bg-gray-100"
//             >
//               <span>{date}</span>
//               {groupExpanded[date] ? <FiChevronUp /> : <FiChevronDown />}
//             </button>
            
//             {groupExpanded[date] && groupSessions.map((session) => (
//               <div 
//                 key={session.session_id}
//                 className={`flex items-center p-3 mx-2 rounded-md cursor-pointer hover:bg-gray-100 group ${
//                   currentSessionId === session.session_id ? 'bg-gray-200' : ''
//                 }`}
//               >
//                 <BsChatLeftText className="mr-3 text-gray-500" />
//                 <div 
//                   className="flex-1 min-w-0"
//                   onClick={() => onSelectSession(session.session_id)}
//                 >
//                   <p className="text-sm font-medium text-gray-900 truncate">
//                     {session.first_question || "New conversation"}
//                   </p>
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs text-gray-500">
//                       {formatTime(session.created_at)}
//                     </p>
//                     {session.language && (
//                       <span className="text-xs px-1 bg-gray-200 rounded text-gray-600">
//                         {session.language.toUpperCase()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onDeleteSession(session.session_id);
//                   }}
//                   className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition-all"
//                 >
//                   <FiTrash2 size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         ))}
        
//         {Object.keys(filteredGroups).length === 0 && (
//           <div className="p-4 text-center text-gray-500">
//             {searchTerm ? 'No matching conversations' : 'No conversations yet'}
//           </div>
//         )}
//       </div>

//       <div className="p-4 border-t border-gray-200 relative" ref={profileMenuRef}>
//         <div 
//           className="flex items-center cursor-pointer"
//           onClick={() => setShowProfileMenu(!showProfileMenu)}
//         >
//           <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
//             {userProfile.initial}
//           </div>
//           <span className="text-sm font-medium">{userProfile.name}</span>
//         </div>

//         {showProfileMenu && (
//           <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//             <div className="py-1">
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   navigate('/profile');
//                 }}
//               >
//                 <FiUser className="mr-2" />
//                 Profile
//               </button>
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   navigate('/settings');
//                 }}
//               >
//                 <FiSettings className="mr-2" />
//                 Settings
//               </button>
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   navigate('/support');
//                 }}
//               >
//                 <FiHelpCircle className="mr-2" />
//                 Support Tickets
//               </button>
//               <button 
//                 className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                 onClick={() => {
//                   setShowProfileMenu(false);
//                   handleLogout();
//                 }}
//               >
//                 <FiLogOut className="mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SessionSidebar;



// Replace this entire file with the following:

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   FiSearch, FiX, FiChevronDown, FiChevronUp, 
//   FiPlus, FiTrash2, FiLogOut, FiUser, FiSettings, FiHelpCircle 
// } from 'react-icons/fi';
// import { BsChatLeftText } from 'react-icons/bs';
// import ProfilePage from './ProfileModal';
// import SettingsPage from './SettingsModal';
// import SupportTicketsPage from './SupportTicketsModal';

// const SessionSidebar = ({ 
//   sessions, 
//   onSelectSession, 
//   onCreateNew, 
//   currentSessionId, 
//   onDeleteSession,
//   userProfile = { name: 'Vishnu Kumar', initial: 'V' }
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [groupExpanded, setGroupExpanded] = useState({});
//   const [dateGroups, setDateGroups] = useState({});
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showSettingsModal, setShowSettingsModal] = useState(false);
//   const [showSupportModal, setShowSupportModal] = useState(false);
//   const profileMenuRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const grouped = sessions.reduce((acc, session) => {
//       const date = new Date(session.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
//       if (!acc[date]) acc[date] = [];
//       acc[date].push(session);
//       return acc;
//     }, {});

//     setGroupExpanded(Object.keys(grouped).reduce((acc, date) => ({ ...acc, [date]: true }), {}));
//     setDateGroups(grouped);
//   }, [sessions]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const filteredGroups = Object.entries(dateGroups).reduce((acc, [date, groupSessions]) => {
//     const filtered = groupSessions.filter(session =>
//       session.first_question?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     if (filtered.length > 0) acc[date] = filtered;
//     return acc;
//   }, {});

//   return (
//     <>
//       <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-64">
//         <div className="p-4">
//           <button 
//             onClick={onCreateNew}
//             className="flex items-center justify-center w-full p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors mb-4"
//           >
//             <FiPlus className="mr-2" />
//             New chat
//           </button>
//           <div className="relative mb-4">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm('')}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               >
//                 <FiX className="text-gray-400 hover:text-gray-500" />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {Object.entries(filteredGroups).map(([date, groupSessions]) => (
//             <div key={date} className="mb-2">
//               <button
//                 onClick={() => setGroupExpanded(prev => ({ ...prev, [date]: !prev[date] }))}
//                 className="flex items-center justify-between w-full px-3 py-2 text-left text-xs font-semibold text-gray-500 hover:bg-gray-100"
//               >
//                 <span>{date}</span>
//                 {groupExpanded[date] ? <FiChevronUp /> : <FiChevronDown />}
//               </button>
//               {groupExpanded[date] && groupSessions.map((session) => (
//                 <div 
//                   key={session.session_id}
//                   className={`flex items-center p-3 mx-2 rounded-md cursor-pointer hover:bg-gray-100 group ${
//                     currentSessionId === session.session_id ? 'bg-gray-200' : ''
//                   }`}
//                 >
//                   <BsChatLeftText className="mr-3 text-gray-500" />
//                   <div 
//                     className="flex-1 min-w-0"
//                     onClick={() => onSelectSession(session.session_id)}
//                   >
//                     <p className="text-sm font-medium text-gray-900 truncate">
//                       {session.first_question || "New conversation"}
//                     </p>
//                     <div className="flex justify-between items-center">
//                       <p className="text-xs text-gray-500">
//                         {new Date(session.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                       {session.language && (
//                         <span className="text-xs px-1 bg-gray-200 rounded text-gray-600">
//                           {session.language.toUpperCase()}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDeleteSession(session.session_id);
//                     }}
//                     className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition-all"
//                   >
//                     <FiTrash2 size={16} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ))}
//           {Object.keys(filteredGroups).length === 0 && (
//             <div className="p-4 text-center text-gray-500">
//               {searchTerm ? 'No matching conversations' : 'No conversations yet'}
//             </div>
//           )}
//         </div>

//         <div className="p-4 border-t border-gray-200 relative" ref={profileMenuRef}>
//           <div 
//             className="flex items-center cursor-pointer"
//             onClick={() => setShowProfileMenu(!showProfileMenu)}
//           >
//             <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
//               {userProfile.initial}
//             </div>
//             <span className="text-sm font-medium">{userProfile.name}</span>
//           </div>

//           {showProfileMenu && (
//             <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//               <div className="py-1">
//                 <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}>
//                   <FiUser className="mr-2" /> Profile
//                 </button>
//                 <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setShowProfileMenu(false); setShowSettingsModal(true); }}>
//                   <FiSettings className="mr-2" /> Settings
//                 </button>
//                 <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setShowProfileMenu(false); setShowSupportModal(true); }}>
//                   <FiHelpCircle className="mr-2" /> Support Tickets
//                 </button>
//                 <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={() => { setShowProfileMenu(false); handleLogout(); }}>
//                   <FiLogOut className="mr-2" /> Logout
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {showProfileModal && <ProfilePage onClose={() => setShowProfileModal(false)} />}
//       {showSettingsModal && <SettingsPage onClose={() => setShowSettingsModal(false)} />}
//       {showSupportModal && <SupportTicketsPage onClose={() => setShowSupportModal(false)} />}
//     </>
//   );
// };

// export default SessionSidebar;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiX, FiChevronDown, FiChevronUp, 
  FiPlus, FiTrash2, FiLogOut, FiUser, FiSettings, FiHelpCircle 
} from 'react-icons/fi';
import { BsChatLeftText } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

const SessionSidebar = ({ 
  sessions, 
  onSelectSession, 
  onCreateNew, 
  currentSessionId, 
  onDeleteSession,
  onShowProfile,
  onShowSettings,
  onShowTickets,
  // userProfile = { name: 'Vishnu Kumar', initial: 'V' }
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupExpanded, setGroupExpanded] = useState({});
  const [dateGroups, setDateGroups] = useState({});
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

    useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://127.0.0.1:5020/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          const name = data.Name || 'User';
          setUserProfile({
            name: name,
            initial: name.split(' ').map(n => n[0]).join(''),
            phone: data.Phone_no,
            status: 'Active',
            memberSince: 'Jan 2024'
          });
        } else {
          console.error('Failed to fetch profile:', data.message);
          // Fallback to default profile if API fails
          setUserProfile({
            name: 'User',
            initial: 'U',
            phone: 'N/A',
            status: 'Active',
            memberSince: 'N/A'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to default profile on error
        setUserProfile({
          name: 'User',
          initial: 'U',
          phone: 'N/A',
          status: 'Active',
          memberSince: 'N/A'
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);
  


  useEffect(() => {
    const grouped = sessions.reduce((acc, session) => {
      const date = new Date(session.timestamp).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(session);
      return acc;
    }, {});
    setGroupExpanded(Object.keys(grouped).reduce((acc, date) => ({ ...acc, [date]: true }), {}));
    setDateGroups(grouped);
  }, [sessions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredGroups = Object.entries(dateGroups).reduce((acc, [date, groupSessions]) => {
    const filtered = groupSessions.filter(session =>
      session.first_question?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) acc[date] = filtered;
    return acc;
  }, {});
  if (loadingProfile || !userProfile) {
    return (
      <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-64">
        <div className="p-4">
          <button className="flex items-center justify-center w-full p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors mb-4 opacity-50">
            <FiPlus className="mr-2" />
            {t("New chat")}
          </button>
          <div className="relative mb-4 opacity-50">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t("Search conversations...")}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
              disabled
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse mr-2"></div>
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-64">
      <div className="p-4">
        <button 
          onClick={onCreateNew}
          className="flex items-center justify-center w-full p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors mb-4"
        >
          <FiPlus className="mr-2" />
          {t("New chat")}
        </button>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t("Search conversations...")}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredGroups).map(([date, groupSessions]) => (
          <div key={date} className="mb-2">
            <button
              onClick={() => setGroupExpanded(prev => ({ ...prev, [date]: !prev[date] }))}
              className="flex items-center justify-between w-full px-3 py-2 text-left text-xs font-semibold text-gray-500 hover:bg-gray-100"
            >
              <span>{date}</span>
              {groupExpanded[date] ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {groupExpanded[date] && groupSessions.map((session) => (
              <div 
                key={session.session_id}
                className={`flex items-center p-3 mx-2 rounded-md cursor-pointer hover:bg-gray-100 group ${
                  currentSessionId === session.session_id ? 'bg-gray-200' : ''
                }`}
              >
                <BsChatLeftText className="mr-3 text-gray-500" />
                <div 
                  className="flex-1 min-w-0"
                  onClick={() => onSelectSession(session.session_id)}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.first_question || "New conversation"}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      {new Date(session.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {session.language && (
                      <span className="text-xs px-1 bg-gray-200 rounded text-gray-600">
                        {session.language.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.session_id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition-all"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ))}
        {Object.keys(filteredGroups).length === 0 && (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No matching conversations' : 'No conversations yet'}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 relative" ref={profileMenuRef}>
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
            {userProfile.initial}
          </div>
          <span className="text-sm font-medium">{userProfile.name}</span>
        </div>

        {showProfileMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setShowProfileMenu(false); onShowProfile(); }}>
                <FiUser className="mr-2" /> {t("Profile")}
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setShowProfileMenu(false); onShowSettings(); }}>
                <FiSettings className="mr-2" /> {t("Settings")}
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setShowProfileMenu(false); onShowTickets(); }}>
                <FiHelpCircle className="mr-2" /> {t("Support Tickets")}
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={() => { setShowProfileMenu(false); handleLogout(); }}>
                <FiLogOut className="mr-2" /> {t("Logout")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSidebar;

