// import React, { useEffect, useState } from 'react';
// import { X } from 'lucide-react';

// const ProfileModal = ({ onClose }) => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState('');

//   // Fetch profile from backend
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('auth_token');
//         const res = await fetch('http://127.0.0.1:5020/api/profile', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         if (data.status === 'success') {
//           setUser({
//             name: data.Name,
//             phone: data.Phone_no,
//           });
//         } else {
//           setError(data.message || 'Failed to fetch profile');
//         }
//       } catch (err) {
//         setError('Something went wrong while fetching profile');
//       }
//     };

//     fetchProfile();
//   }, []);

//   // Close modal on "Escape" key
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [onClose]);

//   if (error) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
//         <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative text-center">
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 text-gray-600 hover:text-black dark:hover:text-white"
//             aria-label="Close profile modal"
//           >
//             <X className="w-5 h-5" />
//           </button>
//           <p className="text-red-500 font-medium">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
//         <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-[90%] max-w-md text-center">
//           <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
//       <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-600 hover:text-black dark:hover:text-white"
//           aria-label="Close profile modal"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         <div className="mb-4 text-center">
//           <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
//             {user.name.split(' ').map(n => n[0]).join('')}
//           </div>
//           <h2 className="text-xl font-semibold">{user.name}</h2>
//           <p className="text-gray-600 dark:text-gray-300 text-sm">Store In-Charge</p>
//         </div>

//         <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
//           <p><strong>Phone:</strong> {user.phone}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileModal;



import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProfileModal = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('http://127.0.0.1:5020/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status === 'success') {
          setUser({ name: data.Name, phone: data.Phone_no,designation:data.Designation,doj:data.DOJ });
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Something went wrong while fetching profile');
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (error) {
    return (
      <Backdrop>
        <ModalBox>
          <CloseButton onClose={onClose} />
          <p className="text-red-500 font-medium text-center">{error}</p>
        </ModalBox>
      </Backdrop>
    );
  }

  if (!user) {
    return (
      <Backdrop>
        <ModalBox>
          <p className="text-gray-600 dark:text-gray-300 text-center">{t("Loading profile...")}</p>
        </ModalBox>
      </Backdrop>
    );
  }

  return (
    <Backdrop>
      <ModalBox>
        <CloseButton onClose={onClose} />

        {/* Avatar + Name */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{user.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.designation}</p>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-3 text-sm">
          <ProfileField label={t("Phone Number")} value={user.phone} />
          <ProfileField label={t("Status")} value="Active" />
          <ProfileField label={t("Member Since")} value={user.doj} />
        </div>
      </ModalBox>
    </Backdrop>
  );
};

const Backdrop = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
    {children}
  </div>
);

const ModalBox = ({ children }) => (
  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl px-6 py-8 w-[90%] max-w-md relative animate-slide-up">
    {children}
  </div>
);

const CloseButton = ({ onClose }) => (
  <button
    onClick={onClose}
    className="absolute top-4 right-4 text-gray-600 hover:text-black dark:hover:text-white transition"
    aria-label="Close profile modal"
  >
    <X className="w-5 h-5" />
  </button>
);

const ProfileField = ({ label, value }) => (
  <div className="flex justify-between items-center px-3 py-2 bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-sm">
    <span className="text-gray-500 dark:text-gray-400 font-medium">{label}</span>
    <span className="text-gray-800 dark:text-gray-100">{value}</span>
  </div>
);

export default ProfileModal;
