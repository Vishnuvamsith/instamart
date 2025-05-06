import React from 'react';
import { BsChatLeftText } from 'react-icons/bs';
import { COLORS } from '../utils/constants';

const EmptyConversation = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
      <div 
        className="flex items-center justify-center w-20 h-20 rounded-full mb-4" 
        style={{ backgroundColor: COLORS.brandColorVeryLight }}
      >
        <BsChatLeftText className="text-5xl" style={{ color: COLORS.brandColorLight }} />
      </div>
      <p className="text-lg">No messages yet. Start a conversation!</p>
    </div>
  );
};

export default EmptyConversation;