// import React from 'react';
// import ChatInterface from './components/ChatInterface';

// function App() {
//   return (
//     <div className="App">
//       <ChatInterface />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';
import Mood from './components/MoodCheckin';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <>
        <Toaster position="top-center" reverseOrder={false} /> {/* Toast component */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
