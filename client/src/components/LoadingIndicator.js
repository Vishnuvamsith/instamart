import React from 'react';
import { BsChatLeftText } from 'react-icons/bs';
import { COLORS } from '../utils/constants';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 p-5 rounded-2xl text-gray-800 border border-gray-200 shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 bg-white">
            <BsChatLeftText className="text-xs" style={{ color: COLORS.brandColor }} />
          </div>
          <span className="font-semibold mr-3">Assistant</span>
          <div className="loader">
            <div className="flex space-x-2">
              <div 
                className="w-3 h-3 rounded-full animate-bounce" 
                style={{ 
                  backgroundColor: COLORS.brandColor,
                  animationDelay: '0s',
                  animationDuration: '0.6s'
                }}
              ></div>
              <div 
                className="w-3 h-3 rounded-full animate-bounce" 
                style={{ 
                  backgroundColor: COLORS.brandColor,
                  animationDelay: '0.2s',
                  animationDuration: '0.6s'
                }}
              ></div>
              <div 
                className="w-3 h-3 rounded-full animate-bounce" 
                style={{ 
                  backgroundColor: COLORS.brandColor,
                  animationDelay: '0.4s',
                  animationDuration: '0.6s'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
