// import React, { useEffect } from 'react';
// import { Settings } from 'lucide-react';

// const SettingsModal = ({ onClose }) => {
//   const settings = {
//     notifications: 'Enabled',
//     theme: 'Light',
//     language: 'English',
//   };

//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity animate-fade-in">
//       <div className="bg-white/80 backdrop-blur-xl rounded-xl w-full max-w-md p-6 shadow-2xl border border-gray-200">
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center gap-2">
//             <Settings className="text-gray-700" />
//             <h2 className="text-xl font-semibold">Settings</h2>
//           </div>
//           <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">✕</button>
//         </div>
//         <div className="space-y-3 text-gray-800">
//           <p><strong>Notifications:</strong> {settings.notifications}</p>
//           <p><strong>Theme:</strong> {settings.theme}</p>
//           <p><strong>Language:</strong> {settings.language}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsModal;

// import React, { useEffect, useState } from 'react';
// import Select from 'react-select';
// import { Settings } from 'lucide-react';

// const LANGUAGES = [
//   'English',
//   'Hindi',
//   'Marathi',
//   'Bengali',
//   'Telugu',
//   'Kannada',
//   'Tamil',
//   'Malayalam',
// ];

// const languageOptions = LANGUAGES.map((lang) => ({
//   value: lang,
//   label: lang,
// }));

// const SettingsModal = ({ onClose }) => {
//   const [settings, setSettings] = useState({
//     notifications: 'Enabled',
//     language: 'English',
//   });

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem('user_settings'));
//     if (saved) setSettings(saved);

//     const handleEsc = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   const updateSettings = (key, value) => {
//     const updated = { ...settings, [key]: value };
//     setSettings(updated);
//     localStorage.setItem('user_settings', JSON.stringify(updated));
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity animate-fade-in">
//       <div className="bg-white/80 backdrop-blur-xl rounded-xl w-full max-w-md p-6 shadow-2xl border border-gray-200">
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center gap-2">
//             <Settings className="text-gray-700" />
//             <h2 className="text-xl font-semibold">Settings</h2>
//           </div>
//           <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">✕</button>
//         </div>

//         <div className="space-y-6 text-gray-800">
//           {/* Notifications Toggle */}
//           <div className="flex justify-between items-center">
//             <span className="font-medium">Notifications:</span>
//             <button
//               onClick={() =>
//                 updateSettings('notifications', settings.notifications === 'Enabled' ? 'Disabled' : 'Enabled')
//               }
//               className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm transition ${
//                 settings.notifications === 'Enabled'
//                   ? 'bg-green-100 text-green-800'
//                   : 'bg-gray-200 text-gray-700'
//               }`}
//             >
//               {settings.notifications}
//             </button>
//           </div>

//           {/* Language Selector */}
//           <div>
//             <label className="font-medium mb-2 block">Preferred Language:</label>
//             <Select
//               options={languageOptions}
//               value={languageOptions.find((opt) => opt.value === settings.language)}
//               onChange={(selected) => updateSettings('language', selected.value)}
//               className="text-base"
//               classNamePrefix="react-select"
//               styles={{
//                 control: (base) => ({
//                   ...base,
//                   padding: '4px',
//                   borderRadius: '0.5rem',
//                   fontSize: '16px',
//                   borderColor: '#cbd5e0',
//                   boxShadow: 'none',
//                   '&:hover': { borderColor: '#6366f1' },
//                 }),
//                 option: (base, state) => ({
//                   ...base,
//                   fontSize: '15px',
//                   backgroundColor: state.isFocused ? '#eef2ff' : 'white',
//                   color: '#111827',
//                   padding: '10px 14px',
//                 }),
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsModal;

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { label: 'English', code: 'en' },
  { label: 'Hindi', code: 'hi' },
  { label: 'Marathi', code: 'mr' },
  { label: 'Bengali', code: 'bn' },
  { label: 'Telugu', code: 'te' },
  { label: 'Kannada', code: 'kn' },
  { label: 'Tamil', code: 'ta' },
  { label: 'Malayalam', code: 'ml' },
];

const languageOptions = LANGUAGES.map((lang) => ({
  value: lang.code,
  label: lang.label,
}));

const SettingsModal = ({ onClose }) => {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState({
    notifications: 'Enabled',
    language: i18n.language || 'en',
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('user_settings'));
    if (saved) {
      setSettings(saved);
      if (saved.language) i18n.changeLanguage(saved.language);
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, i18n]);

  const updateSettings = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem('user_settings', JSON.stringify(updated));
    if (key === 'language') i18n.changeLanguage(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-xl w-full max-w-md p-6 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Settings className="text-gray-700" />
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">✕</button>
        </div>

        <div className="space-y-6 text-gray-800">
          {/* Notifications Toggle */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Notifications:</span>
            <button
              onClick={() =>
                updateSettings('notifications', settings.notifications === 'Enabled' ? 'Disabled' : 'Enabled')
              }
              className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm transition ${
                settings.notifications === 'Enabled'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {settings.notifications}
            </button>
          </div>

          {/* Language Selector */}
          <div>
            <label className="font-medium mb-2 block">Preferred Language:</label>
            <Select
              options={languageOptions}
              value={languageOptions.find((opt) => opt.value === settings.language)}
              onChange={(selected) => updateSettings('language', selected.value)}
              className="text-base"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  padding: '4px',
                  borderRadius: '0.5rem',
                  fontSize: '16px',
                  borderColor: '#cbd5e0',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#6366f1' },
                }),
                option: (base, state) => ({
                  ...base,
                  fontSize: '15px',
                  backgroundColor: state.isFocused ? '#eef2ff' : 'white',
                  color: '#111827',
                  padding: '10px 14px',
                }),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
