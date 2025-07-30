// import { useState } from 'react';
// import { sendMessage } from '../api/chatApi';

// const useChat = (conversations, setConversations, currentSessionId, setError, setLoading, setShowWelcome, refreshSessions) => {
//   const [message, setMessage] = useState('');
//   const [copiedIndex, setCopiedIndex] = useState(null);

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
      
//       const data = await sendMessage(message, currentSessionId);
      
//       if (data.status !== 'success') {
//         throw new Error(data.message || 'Failed to get answer');
//       }
      
//       const botResponse = {
//         type: 'bot',
//         text: data.response.answer
//       };
      
//       setConversations(prev => [...prev, botResponse]);
      
//       if (!currentSessionId || currentSessionId.startsWith('temp_')) {
//         await refreshSessions();
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

//   return {
//     message,
//     setMessage,
//     copiedIndex,
//     handleSubmit,
//     handleCopy,
//     handleKeyPress
//   };
// };

// export default useChat;


// This is a skeleton for the useChat hook that needs to be updated
// You'll need to modify your existing useChat.js to support the new features

import { useState, useCallback } from 'react';
import { sendMessage } from '../api/chatApi'; // Adjust import path as needed

const useChat = (
  conversations,
  setConversations,
  currentSessionId,
  setError,
  setLoading,
  setShowWelcome,
  refreshSessions,
  handleNewSession
) => {
  const [message, setMessage] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = useCallback(async (e, sessionIdOverride = null) => {
    if (e) e.preventDefault();
    
    if (!message.trim()) return;
    
    const sessionIdToUse = sessionIdOverride || currentSessionId;
    
    // Ensure we have a session ID to use
    if (!sessionIdToUse) {
      console.error("No session ID available for message submission");
      setError({
        type: 'error',
        message: 'No active chat session. Please try creating a new chat.'
      });
      return;
    }
    
    setLoading(true);
    setShowWelcome(false);
    
    // Add user message to conversation immediately
    const userMessage = { type: 'user', text: message };
    setConversations([...conversations, userMessage]);
    setMessage('');

    try {
      console.log(`Sending message to session: ${sessionIdToUse}`);
      
      // Send message to API
      const response = await sendMessage(sessionIdToUse, message);
      
      if (response.status === 'success') {
        // Add assistant response to conversation
        const assistantMessage = { 
          type: 'assistant', 
          text: response.response?.answer || 'I received your message but couldn\'t generate a response. Please try again.'
        };

        
        setConversations(prevConversations => [...prevConversations, assistantMessage]);
        
        // Refresh sessions to update the list with latest message preview
        refreshSessions();
      } else {
        setError({
          type: 'error',
          message: response.message || 'Failed to get a response. Please try again.'
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError({
        type: 'error',
        message: 'Failed to send message. Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  }, [message, conversations, currentSessionId, setConversations, setError, setLoading, setShowWelcome, refreshSessions]);

  const handleCopy = (index) => {
    const textToCopy = conversations[index].text;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 3000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setError({
          type: 'error',
          message: 'Failed to copy text to clipboard'
        });
      });
  };

  const handleKeyPress = (e) => {
    // Submit on Ctrl+Enter or Command+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return {
    message,
    setMessage,
    copiedIndex,
    handleSubmit,
    handleCopy,
    handleKeyPress
  };
};

export default useChat;