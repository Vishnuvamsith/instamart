import {
    API_URL,
    ANSWER_ENDPOINT,
    SESSIONS_ENDPOINT,
    DELETE_SESSION_ENDPOINT,
    NEW_SESSION_ENDPOINT,
    CONVERSATIONS_ENDPOINT
  } from '../utils/constants';
  
  export const fetchSessions = async () => {
    const response = await fetch(SESSIONS_ENDPOINT);
    const data = await response.json();
    return data;
  };
  
  export const createNewSession = async () => {
    try {
      const response = await fetch(NEW_SESSION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating new session:", error);
      return { session_id: `temp_${Date.now()}` };
    }
  };
  
  export const deleteSession = async (sessionId) => {
    const response = await fetch(`${DELETE_SESSION_ENDPOINT}/${sessionId}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  };
  
  export const fetchSessionConversations = async (sessionId) => {
    const response = await fetch(`${CONVERSATIONS_ENDPOINT}/${sessionId}`);
    const data = await response.json();
    return data;
  };
  
  export const sendMessage = async (message, sessionId) => {
    const response = await fetch(ANSWER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        question: message,
        session_id: sessionId
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  };
  