// import React, { useState, useEffect } from 'react';
// import { FiSearch, FiX, FiChevronDown, FiChevronUp, FiPlus } from 'react-icons/fi';
// import { BsChatLeftText } from 'react-icons/bs';

// // SessionSidebar component with enhanced features
// const SessionSidebar = ({ sessions, onSelectSession, onCreateNew, currentSessionId }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [groupExpanded, setGroupExpanded] = useState({});
//   const [dateGroups, setDateGroups] = useState({});

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
//                 onClick={() => onSelectSession(session.session_id)}
//                 className={`flex items-center p-3 mx-2 rounded-md cursor-pointer hover:bg-gray-100 ${
//                   currentSessionId === session.session_id ? 'bg-gray-200' : ''
//                 }`}
//               >
//                 <BsChatLeftText className="mr-3 text-gray-500" />
//                 <div className="flex-1 min-w-0">
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

//       <div className="p-4 border-t border-gray-200">
//         <div className="flex items-center">
//           <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
//             V
//           </div>
//           <span className="text-sm font-medium">Vishnu Kumar</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SessionSidebar;


import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiChevronDown, FiChevronUp, FiPlus, FiTrash2 } from 'react-icons/fi';
import { BsChatLeftText } from 'react-icons/bs';
import UserProfileDropdown from './UserProfileDropdown';

// SessionSidebar component with enhanced features including deletion
const SessionSidebar = ({ sessions, onSelectSession, onCreateNew, currentSessionId, onDeleteSession }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupExpanded, setGroupExpanded] = useState({});
  const [dateGroups, setDateGroups] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deletingSession, setDeletingSession] = useState(false);

  // Group sessions by date
  useEffect(() => {
    const grouped = sessions.reduce((acc, session) => {
      const date = new Date(session.created_at);
      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(session);
      return acc;
    }, {});

    // Initialize expanded state for groups
    const expanded = {};
    Object.keys(grouped).forEach(date => {
      expanded[date] = true;
    });
    
    setGroupExpanded(expanded);
    setDateGroups(grouped);
  }, [sessions]);

  const toggleGroup = (date) => {
    setGroupExpanded(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteClick = (sessionId, e) => {
    e.stopPropagation();
    setShowDeleteConfirm(sessionId);
  };

  const handleConfirmDelete = async (sessionId, e) => {
    e.stopPropagation();
    setDeletingSession(true);
    
    try {
      await onDeleteSession(sessionId);
      setShowDeleteConfirm(null);
      
      // If the deleted session was the current one, create a new session
      if (sessionId === currentSessionId && onCreateNew) {
        onCreateNew();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setDeletingSession(false);
    }
  };


  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };

  // Filter sessions based on search term
  const filteredGroups = Object.entries(dateGroups).reduce((acc, [date, groupSessions]) => {
    const filtered = groupSessions.filter(session => 
      session.first_question && session.first_question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[date] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-64">
      <div className="p-4">
        <button 
          onClick={onCreateNew}
          className="flex items-center justify-center w-full p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors mb-4"
        >
          <FiPlus className="mr-2" />
          New chat
        </button>
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
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
              onClick={() => toggleGroup(date)}
              className="flex items-center justify-between w-full px-3 py-2 text-left text-xs font-semibold text-gray-500 hover:bg-gray-100"
            >
              <span>{date}</span>
              {groupExpanded[date] ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {groupExpanded[date] && groupSessions.map((session) => (
              <div 
                key={session.session_id}
                onClick={() => onSelectSession(session.session_id)}
                className={`relative flex items-center p-3 mx-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                  currentSessionId === session.session_id ? 'bg-gray-200' : ''
                }`}
              >
                <BsChatLeftText className="mr-3 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.first_question || "New conversation"}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      {formatTime(session.created_at)}
                    </p>
                    {session.language && (
                      <span className="text-xs px-1 bg-gray-200 rounded text-gray-600">
                        {session.language.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Delete button */}
                {showDeleteConfirm !== session.session_id && (
                  <button 
                    onClick={(e) => handleDeleteClick(session.session_id, e)}
                    className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200"
                    title="Delete conversation"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
                
                {/* Delete confirmation overlay */}
                {showDeleteConfirm === session.session_id && (
                  <div className="absolute inset-0 bg-white bg-opacity-90 rounded-md flex items-center justify-center p-2 z-10">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-sm text-gray-700 font-medium text-center">Delete this conversation?</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleConfirmDelete(session.session_id, e)}
                          disabled={deletingSession}
                          className={`px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 
                            ${deletingSession ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {deletingSession ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                          onClick={handleCancelDelete}
                          className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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

      <div className="p-4 border-t border-gray-200">
        <UserProfileDropdown />
      </div>
    </div>
  );
};

export default SessionSidebar;