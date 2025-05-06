import { useState, useEffect } from 'react';
import { fetchSessions, createNewSession, deleteSession, fetchSessionConversations } from '../api/chatApi';

const useSession = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const data = await fetchSessions();
      if (data.status === 'success') {
        setSessions(data.sessions);
        if (data.sessions.length > 0 && !currentSessionId) {
          setCurrentSessionId(data.sessions[0].session_id);
        }
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError({
        type: 'error',
        message: 'Failed to load conversations'
      });
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    refreshSessions();
  }, []);

  const handleNewSession = async () => {
    setConversations([]);
    setShowWelcome(true);
    try {
      const data = await createNewSession();
      setCurrentSessionId(data.session_id);
    } catch (error) {
      setCurrentSessionId(`temp_${Date.now()}`);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const data = await deleteSession(sessionId);
      
      if (data.status === 'success' || data.status === 'warning') {
        setError({
          type: 'success',
          message: 'Session deleted successfully'
        });
        
        if (currentSessionId === sessionId) {
          setConversations([]);
          setShowWelcome(true);
          setCurrentSessionId(null);
        }
        
        await refreshSessions();
        
        setTimeout(() => {
          setError(null);
        }, 3000);
        
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
  };

  const handleSelectSession = async (sessionId) => {
    try {
      setLoading(true);
      
      const data = await fetchSessionConversations(sessionId);
      
      if (!data || data.status !== "success" || !data.conversations) {
        console.error("Invalid session data:", data);
        setError({
          type: 'error',
          message: "Could not load session data. Invalid response format."
        });
        setLoading(false);
        return;
      }
      
      const formattedMessages = data.conversations.map((msg) => ({
        type: msg.type,
        text: msg.text
      }));
      
      setConversations(formattedMessages);
      setCurrentSessionId(sessionId);
      setShowWelcome(false);
      
      setError(null);
      
    } catch (error) {
      console.error("Error loading session:", error);
      setError({
        type: 'error',
        message: "Failed to load chat session"
      });
    } finally {
      setLoading(false);
    }
  };

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