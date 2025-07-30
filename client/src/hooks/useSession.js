// import { useState, useEffect } from 'react';
// import { fetchSessions, createNewSession, deleteSession, fetchSessionConversations } from '../api/chatApi';

// const useSession = () => {
//   const [sessions, setSessions] = useState([]);
//   const [currentSessionId, setCurrentSessionId] = useState(null);
//   const [isLoadingSessions, setIsLoadingSessions] = useState(true);
//   const [conversations, setConversations] = useState([]);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const refreshSessions = async () => {
//     try {
//       setIsLoadingSessions(true);
//       const data = await fetchSessions();
//       if (data.status === 'success') {
//         setSessions(data.sessions);
//         if (data.sessions.length > 0 && !currentSessionId) {
//           setCurrentSessionId(data.sessions[0].session_id);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching sessions:", err);
//       setError({
//         type: 'error',
//         message: 'Failed to load conversations'
//       });
//     } finally {
//       setIsLoadingSessions(false);
//     }
//   };

//   useEffect(() => {
//     refreshSessions();
//   }, []);

//   const handleNewSession = async () => {
//     setConversations([]);
//     setShowWelcome(true);
//     try {
//       const data = await createNewSession();
//       setCurrentSessionId(data.session_id);
//     } catch (error) {
//       setCurrentSessionId(`temp_${Date.now()}`);
//     }
//   };

//   const handleDeleteSession = async (sessionId) => {
//     try {
//       const data = await deleteSession(sessionId);
      
//       if (data.status === 'success' || data.status === 'warning') {
//         setError({
//           type: 'success',
//           message: 'Session deleted successfully'
//         });
        
//         if (currentSessionId === sessionId) {
//           setConversations([]);
//           setShowWelcome(true);
//           setCurrentSessionId(null);
//         }
        
//         await refreshSessions();
        
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
      
//       const data = await fetchSessionConversations(sessionId);
      
//       if (!data || data.status !== "success" || !data.conversations) {
//         console.error("Invalid session data:", data);
//         setError({
//           type: 'error',
//           message: "Could not load session data. Invalid response format."
//         });
//         setLoading(false);
//         return;
//       }
      
//       const formattedMessages = data.conversations.map((msg) => ({
//         type: msg.type,
//         text: msg.text
//       }));
      
//       setConversations(formattedMessages);
//       setCurrentSessionId(sessionId);
//       setShowWelcome(false);
      
//       setError(null);
      
//     } catch (error) {
//       console.error("Error loading session:", error);
//       setError({
//         type: 'error',
//         message: "Failed to load chat session"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     sessions,
//     currentSessionId,
//     isLoadingSessions,
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
//   };
// };

// export default useSession;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSessions, createNewSession, deleteSession, fetchSessionConversations } from '../api/chatApi';

const useSession = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use a ref to track if we're already creating a session to prevent duplicates
  const isCreatingSession = useRef(false);
  const initializationInProgress = useRef(false);

  // Log data format for debugging
  const logDataFormat = (data, source) => {
    console.log(`Data structure from ${source}:`, {
      hasSessionsProperty: !!data.sessions,
      sessionsType: data.sessions ? typeof data.sessions : 'undefined',
      nestedSessionsArray: data.sessions && data.sessions.sessions ? 
        `Array with ${data.sessions.sessions.length} items` : 'N/A',
      directSessionsArray: Array.isArray(data.sessions) ? 
        `Array with ${data.sessions.length} items` : 'N/A'
    });
  };

  // Extract sessions from the API response
  const extractSessions = (data) => {
    if (!data) return [];
    
    // Log the structure for debugging
    logDataFormat(data, 'API Response');
    
    if (data.sessions && data.sessions.sessions && Array.isArray(data.sessions.sessions)) {
      return data.sessions.sessions;
    } else if (Array.isArray(data.sessions)) {
      return data.sessions;
    } else if (data.sessions && typeof data.sessions === 'object') {
      // Try to extract sessions if it's an object with session data
      const sessionsArray = Object.values(data.sessions).filter(item => 
        item && typeof item === 'object' && item.session_id
      );
      if (sessionsArray.length > 0) {
        return sessionsArray;
      }
    }
    return [];
  };

  // Refreshes the sessions list from the API
  const refreshSessions = useCallback(async () => {
    try {
      setIsLoadingSessions(true);
      const data = await fetchSessions();
      console.log("Fetched sessions data:", data);
      
      if (data.status === 'success') {
        const extractedSessions = extractSessions(data);
        console.log("Extracted sessions:", extractedSessions);
        setSessions(extractedSessions);
        return extractedSessions;
      }
      return [];
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError({
        type: 'error',
        message: 'Failed to load conversations'
      });
      return [];
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  // Handles creating a new session
  const handleNewSession = useCallback(async () => {
    // Prevent multiple simultaneous session creation
    if (isCreatingSession.current) {
      console.log("Session creation already in progress, skipping duplicate request");
      return null;
    }

    try {
      isCreatingSession.current = true;
      setLoading(true);
      setConversations([]);
      setShowWelcome(true);
      
      const data = await createNewSession();
      console.log("New session created:", data.session_id);
      
      if (data && data.session_id) {
        const newSessionId = data.session_id;
        setCurrentSessionId(newSessionId);
        localStorage.setItem('session_id', newSessionId);
        
        // Add the new session to our state immediately instead of waiting for refresh
        setSessions(prevSessions => {
          // Check if the session already exists to avoid duplicates
          const exists = prevSessions.some(s => s.session_id === newSessionId);
          if (!exists) {
            return [...prevSessions, {
              session_id: newSessionId,
              created_at: new Date().toISOString(),
              first_question: null
            }];
          }
          return prevSessions;
        });
        
        // Still refresh from the API to get any updated data
        await refreshSessions();
        return newSessionId;
      } else {
        throw new Error("Failed to create session - no session ID returned");
      }
    } catch (error) {
      console.error("Error creating new session:", error);
      setError({
        type: 'error',
        message: 'Failed to create new chat'
      });
      // Generate a temporary ID if API fails
      const tempId = `temp_${Date.now()}`;
      setCurrentSessionId(tempId);
      localStorage.setItem('session_id', tempId);
      return tempId;
    } finally {
      setLoading(false);
      isCreatingSession.current = false;
    }
  }, [refreshSessions]);

  // Handles selecting an existing session
  const handleSelectSession = useCallback(async (sessionId) => {
    if (!sessionId) {
      console.error("Invalid session ID provided to handleSelectSession");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Selecting session:", sessionId);

      const data = await fetchSessionConversations(sessionId);
      if (!data || data.status !== "success") {
        console.error("Invalid session data:", data);
        setError({
          type: 'error',
          message: "Could not load session data. Invalid response format."
        });
        return;
      }

      // Handle potential missing conversations array
      const conversationsData = data.conversations || [];
      
      const formattedMessages = conversationsData.map((msg) => ({
        type: msg.type,
        text: msg.text
      }));

      setConversations(formattedMessages);
      setCurrentSessionId(sessionId);
      localStorage.setItem('session_id', sessionId);
      setShowWelcome(formattedMessages.length === 0);
      setError(null);
      
      console.log("Session selected successfully:", sessionId);
    } catch (error) {
      console.error("Error loading session:", error);
      setError({
        type: 'error',
        message: "Failed to load chat session"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Handles deleting a session
  const handleDeleteSession = useCallback(async (sessionId) => {
    try {
      const data = await deleteSession(sessionId);
      if (data.status === 'success' || data.status === 'warning') {
        setError({ type: 'success', message: 'Session deleted successfully' });

        if (currentSessionId === sessionId) {
          setConversations([]);
          setShowWelcome(true);
          setCurrentSessionId(null);
          localStorage.removeItem('session_id');
        }

        await refreshSessions();

        setTimeout(() => setError(null), 3000);
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete session');
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      setError({
        type: 'error',
        message: `Failed to delete session: ${error.message}`
      });
      return false;
    }
  }, [currentSessionId, refreshSessions]);

  // Initialize sessions on component mount - this runs only once
  useEffect(() => {
    // Using a ref to ensure this only runs once across re-renders
    if (isInitialized || initializationInProgress.current) return;
    
    const initializeSessions = async () => {
      try {
        initializationInProgress.current = true;
        setIsLoadingSessions(true);
        
        // First, get the stored session ID
        const storedSessionId = localStorage.getItem('session_id');
        console.log("Stored session ID:", storedSessionId);
        
        // Get existing sessions
        const sessionsList = await refreshSessions();
        console.log("Available sessions:", sessionsList);
        
        // Check if the stored session ID exists in the sessions array
        const validStoredSession = storedSessionId && 
          sessionsList.find(s => s.session_id === storedSessionId);
        
        console.log("Valid stored session:", validStoredSession);

        if (storedSessionId && validStoredSession) {
          console.log("Selecting stored session:", storedSessionId);
          await handleSelectSession(storedSessionId);
        } else if (sessionsList && sessionsList.length > 0) {
          console.log("Selecting first available session:", sessionsList[0].session_id);
          await handleSelectSession(sessionsList[0].session_id);
        } else {
          console.log("No sessions available, creating new session");
          await handleNewSession();
        }
        
        setIsInitialized(true);
      } catch (err) {
        console.error("Error initializing sessions:", err);
        setError({
          type: 'error',
          message: 'Failed to initialize sessions'
        });
      } finally {
        setIsLoadingSessions(false);
        initializationInProgress.current = false;
      }
    };

    initializeSessions();
    
    // Clean up function - not strictly necessary but good practice
    return () => {
      initializationInProgress.current = false;
    };
  }, [refreshSessions, handleSelectSession, handleNewSession, isInitialized]);

  return {
    sessions,
    currentSessionId,
    isLoadingSessions,
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
  };
};

export default useSession;