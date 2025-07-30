import {
    API_URL,
    ANSWER_ENDPOINT,
    SESSIONS_ENDPOINT,
    DELETE_SESSION_ENDPOINT,
    NEW_SESSION_ENDPOINT,
    CONVERSATIONS_ENDPOINT
  } from '../utils/constants';

import { authFetch } from '../utils/authFetch';
  
  // export const fetchSessions = async () => {
  //   const response = await fetch(SESSIONS_ENDPOINT);
  //   const data = await response.json();
  //   return data;
  // };
//   export const fetchSessions = async () => {
//   const token = localStorage.getItem('auth_token');

//   const response = await fetch(SESSIONS_ENDPOINT, {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//   });

//   const data = await response.json();
//   return data.sessions;
// };

  
//   export const createNewSession = async () => {
//     try {
//       const response = await fetch(NEW_SESSION_ENDPOINT, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//       });
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Error creating new session:", error);
//       return { session_id: `temp_${Date.now()}` };
//     }
//   };
  
//   export const deleteSession = async (sessionId) => {
//     const response = await fetch(`${DELETE_SESSION_ENDPOINT}/${sessionId}/delete`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     const data = await response.json();
//     return data;
//   };
  
//   export const fetchSessionConversations = async (sessionId) => {
//     const response = await fetch(`${CONVERSATIONS_ENDPOINT}/${sessionId}`);
//     const data = await response.json();
//     return data;
//   };
  
//   // export const sendMessage = async (message, sessionId) => {
//   //   const response = await fetch(ANSWER_ENDPOINT, {
//   //     method: 'POST',
//   //     headers: {
//   //       'Content-Type': 'application/json'
//   //     },
//   //     credentials: 'include',
//   //     body: JSON.stringify({ 
//   //       question: message,
//   //       session_id: sessionId
//   //     })
//   //   });
    
//   //   if (!response.ok) {
//   //     throw new Error(`HTTP error! Status: ${response.status}`);
//   //   }
    
//   //   const data = await response.json();
//   //   return data;
//   // };
// export const sendMessage = async (message, sessionId) => {
//   const token = localStorage.getItem('auth_token');

//   const response = await fetch(ANSWER_ENDPOINT, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//     body: JSON.stringify({ 
//       question: message,
//       session_id: sessionId
//     }),
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! Status: ${response.status}`);
//   }

//   const data = await response.json();
//   return data;
// };

// This is the revised version of your sendMessage function in chatApi.js
// Make sure to update this function in your API utility file












// export const sendMessage = async (sessionId, message) => {
//   try {
//     const token = localStorage.getItem('auth_token');
//     if (!token) {
//       throw new Error('Authentication token not found');
//     }

//     console.log(`Sending message to session ID: ${sessionId}, Message: ${message}`);

//     const response = await fetch(ANSWER_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         // Here's the fix - make sure the parameters are in the correct order
//         question: message,  // This is the actual message content
//         session_id: sessionId        // This is the session identifier
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to send message');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error sending message:', error);
//     throw error;
//   }
// };

// // Example of how the rest of your chatApi.js might look
// // Keep these functions if they're already correct in your code

// export const fetchSessions = async () => {
//   try {
//     const token = localStorage.getItem('auth_token');
//     if (!token) {
//       throw new Error('Authentication token not found');
//     }

//     const response = await fetch(SESSIONS_ENDPOINT, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to fetch sessions');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching sessions:', error);
//     throw error;
//   }
// };

// export const createNewSession = async () => {
//   try {
//     const token = localStorage.getItem('auth_token');
//     if (!token) {
//       throw new Error('Authentication token not found');
//     }

//     const response = await fetch(NEW_SESSION_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to create new session');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error creating new session:', error);
//     throw error;
//   }
// };

// export const deleteSession = async (sessionId) => {
//   try {
//     const token = localStorage.getItem('auth_token');
//     if (!token) {
//       throw new Error('Authentication token not found');
//     }

//     const response = await fetch(`${DELETE_SESSION_ENDPOINT}/${sessionId}/delete`, {
//   method: 'DELETE',
//   headers: {
//     'Authorization': `Bearer ${token}`
//   }
// });


//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to delete session');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error deleting session:', error);
//     throw error;
//   }
// };

// export const fetchSessionConversations = async (sessionId) => {
//   try {
//     const token = localStorage.getItem('auth_token');
//     if (!token) {
//       throw new Error('Authentication token not found');
//     }

//     const response = await fetch(`${CONVERSATIONS_ENDPOINT}/${sessionId}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to fetch session conversations');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching session conversations:', error);
//     throw error;
//   }
// };


export const sendMessage = async (sessionId, message) => {
  const body = {
    question: message,
    session_id: sessionId,
  };

  return await authFetch(ANSWER_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const fetchSessions = async () => {
  return await authFetch(SESSIONS_ENDPOINT, {
    method: "GET",
  });
};

export const createNewSession = async () => {
  return await authFetch(NEW_SESSION_ENDPOINT, {
    method: "POST",
  });
};

export const deleteSession = async (sessionId) => {
  return await authFetch(`${DELETE_SESSION_ENDPOINT}/${sessionId}/delete`, {
    method: "DELETE",
  });
};

export const fetchSessionConversations = async (sessionId) => {
  return await authFetch(`${CONVERSATIONS_ENDPOINT}/${sessionId}`, {
    method: "GET",
  });
};
