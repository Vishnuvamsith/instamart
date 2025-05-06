// import React, { useRef, useEffect } from 'react';
// import MessageItem from './MessageItem';
// import WelcomeMessage from './WelcomeMessage';
// import LoadingIndicator from './LoadingIndicator';
// import EmptyConversation from './EmptyConversation';

// const MessageList = ({ conversations, showWelcome, loading, copiedIndex, handleCopy }) => {
//   const lastMessageRef = useRef(null);
  
//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [conversations]);
  
//   return (
//     <div className="p-4 space-y-6">
//       {showWelcome && <WelcomeMessage />}

//       {conversations.length === 0 && !showWelcome ? (
//         <EmptyConversation />
//       ) : (
//         conversations.map((message, index) => (
//           <MessageItem 
//             key={index}
//             message={message}
//             index={index}
//             isLastMessage={index === conversations.length - 1}
//             copiedIndex={copiedIndex}
//             onCopy={handleCopy}
//             lastMessageRef={lastMessageRef}
//           />
//         ))
//       )}
      
//       {loading && <LoadingIndicator />}
//     </div>
//   );
// };

// export default MessageList;

import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import WelcomeMessage from './WelcomeMessage';
import LoadingIndicator from './LoadingIndicator';
import EmptyConversation from './EmptyConversation';

const MessageList = ({ 
  conversations, 
  showWelcome, 
  loading, 
  copiedIndex, 
  handleCopy, 
  setMessage, // ✅ receive from parent
  handleSubmit
}) => {
  const lastMessageRef = useRef(null);
  
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations]);
  
  return (
    <div className="p-4 space-y-6">
      {showWelcome && <WelcomeMessage 
          onSuggestionClick={(text) => {
            setMessage(text);
            handleSubmit(); // ✅ auto-submit
          }} 
        />} {/* ✅ fixed */}

      {conversations.length === 0 && !showWelcome ? (
        <EmptyConversation />
      ) : (
        conversations
        .filter((message) => message.text && message.text.trim() !== '')
        .map((message, index, filteredMessages) => (
          <MessageItem 
            key={index}
            message={message}
            index={index}
            isLastMessage={index === filteredMessages.length - 1}
            copiedIndex={copiedIndex}
            onCopy={handleCopy}
            lastMessageRef={lastMessageRef}
          />
        ))
      
      )}
      
      {loading && <LoadingIndicator />}
    </div>
  );
};

export default MessageList;
