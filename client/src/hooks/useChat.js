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


import { useState } from 'react';
import { sendMessage } from '../api/chatApi';

const MAX_CONVERSATION_LENGTH = 25; // Set conversation limit here

const useChat = (conversations, setConversations, currentSessionId, setError, setLoading, setShowWelcome, refreshSessions, handleNewSession) => {
  const [message, setMessage] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    // Check conversation length
    if (conversations.length >= MAX_CONVERSATION_LENGTH) {
      setError({
        type: 'info',
        message: 'Conversation limit reached. Starting a new session...'
      });
      await handleNewSession();
      setMessage(message); // Keep their typed message
      return;
    }

    setError(null);
    setLoading(true);
    setShowWelcome(false);

    try {
      const userMessage = {
        type: 'user',
        text: message
      };
      
      setConversations(prev => [...prev, userMessage]);
      
      const data = await sendMessage(message, currentSessionId);
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to get answer');
      }
      
      const botResponse = {
        type: 'bot',
        text: data.response.answer
      };
      
      setConversations(prev => [...prev, botResponse]);
      
      if (!currentSessionId || currentSessionId.startsWith('temp_')) {
        await refreshSessions();
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setError({
        type: 'error',
        message: `An error occurred: ${error.message}`
      });
    } finally {
      setLoading(false);
      setMessage('');
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