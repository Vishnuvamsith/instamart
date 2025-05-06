// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiSmartphone, FiLogIn } from 'react-icons/fi';

// const Login = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Simulate API call delay
//     setTimeout(() => {
//       if (phoneNumber === '9849366500') {
//         navigate('/chat');
//       } else {
//         setError('Invalid phone number. Try "9849366500".');
//       }
//       setIsSubmitting(false);
//     }, 800);
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.loginCard}>
//         <div style={styles.logoContainer}>
//           <div style={styles.logo}>
//             <FiSmartphone style={styles.logoIcon} />
//           </div>
//           <h2 style={styles.title}>HRMS Portal</h2>
//           <p style={styles.subtitle}>Employee Access Portal</p>
//         </div>
        
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.inputContainer}>
//             <label style={styles.label}>Mobile Number</label>
//             <div style={styles.inputWrapper}>
//               <span style={styles.countryCode}>+91</span>
//               <input
//                 type="tel"
//                 value={phoneNumber}
//                 onChange={(e) => {
//                   setError('');
//                   setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
//                 }}
//                 placeholder="Please enter your mobile number"
//                 required
//                 style={styles.input}
//                 maxLength="10"
//               />
//             </div>
//           </div>
          
//           {error && (
//             <div style={styles.errorContainer}>
//               <p style={styles.errorText}>{error}</p>
//             </div>
//           )}
          
//           <button 
//             type="submit" 
//             style={isSubmitting ? styles.buttonSubmitting : styles.button}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               'Verifying...'
//             ) : (
//               <>
//                 <FiLogIn style={styles.buttonIcon} />
//                 <span>Login</span>
//               </>
//             )}
//           </button>
//         </form>
        
//         <div style={styles.footer}>
//           <p style={styles.footerText}>Need help? Contact HR at hr@company.com</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '100vh',
//     backgroundColor: '#f8fafc',
//     backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
//     padding: '20px',
//   },
//   loginCard: {
//     background: 'white',
//     borderRadius: '12px',
//     boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
//     width: '100%',
//     maxWidth: '400px',
//     padding: '40px 30px',
//     textAlign: 'center',
//   },
//   logoContainer: {
//     marginBottom: '30px',
//   },
//   logo: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '60px',
//     height: '60px',
//     borderRadius: '50%',
//     backgroundColor: '#3b82f6',
//     marginBottom: '15px',
//   },
//   logoIcon: {
//     color: 'white',
//     fontSize: '28px',
//   },
//   title: {
//     fontSize: '24px',
//     fontWeight: '600',
//     color: '#1e293b',
//     margin: '0 0 5px 0',
//   },
//   subtitle: {
//     fontSize: '14px',
//     color: '#64748b',
//     margin: '0',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '20px',
//   },
//   inputContainer: {
//     textAlign: 'left',
//   },
//   label: {
//     display: 'block',
//     marginBottom: '8px',
//     fontSize: '14px',
//     fontWeight: '500',
//     color: '#475569',
//   },
//   inputWrapper: {
//     display: 'flex',
//     alignItems: 'center',
//     border: '1px solid #e2e8f0',
//     borderRadius: '8px',
//     overflow: 'hidden',
//     transition: 'border-color 0.2s, box-shadow 0.2s',
//   },
//   inputWrapperFocus: {
//     borderColor: '#3b82f6',
//     boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
//   },
//   countryCode: {
//     padding: '0 12px',
//     backgroundColor: '#f1f5f9',
//     color: '#475569',
//     fontSize: '14px',
//     height: '44px',
//     display: 'flex',
//     alignItems: 'center',
//     borderRight: '1px solid #e2e8f0',
//   },
//   input: {
//     flex: '1',
//     padding: '12px',
//     border: 'none',
//     outline: 'none',
//     fontSize: '15px',
//     color: '#1e293b',
//     backgroundColor: 'transparent',
//   },
//   button: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '8px',
//     width: '100%',
//     padding: '12px',
//     backgroundColor: '#3b82f6',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '15px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'background-color 0.2s',
//   },
//   buttonHover: {
//     backgroundColor: '#2563eb',
//   },
//   buttonSubmitting: {
//     backgroundColor: '#93c5fd',
//     cursor: 'not-allowed',
//   },
//   buttonIcon: {
//     fontSize: '18px',
//   },
//   errorContainer: {
//     backgroundColor: '#fee2e2',
//     padding: '12px',
//     borderRadius: '8px',
//   },
//   errorText: {
//     color: '#dc2626',
//     fontSize: '14px',
//     margin: '0',
//     textAlign: 'center',
//   },
//   footer: {
//     marginTop: '30px',
//     paddingTop: '20px',
//     borderTop: '1px solid #e2e8f0',
//   },
//   footerText: {
//     fontSize: '12px',
//     color: '#64748b',
//     margin: '0',
//   },
// };

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSmartphone, FiLogIn } from 'react-icons/fi';
import { createNewSession } from '../api/chatApi';
const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    setTimeout(async () => {
      if (phoneNumber === '9849366500') {
        // 👇 Call the new session API here
        try {
          const data = await createNewSession();
          console.log('New session created:', data.session_id);
          // Optional: store sessionId in localStorage or sessionStorage if needed
          localStorage.setItem('session_id', data.session_id);
        } catch (error) {
          console.error('Failed to create session:', error);
        }
  
        navigate('/chat');
      } else {
        setError('Invalid phone number. Try "9849366500".');
      }
      setIsSubmitting(false);
    }, 800);
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <FiSmartphone style={styles.logoIcon} />
          </div>
          <h2 style={styles.title}>HRMS Portal</h2>
          <p style={styles.subtitle}>Employee Access Portal</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Mobile Number</label>
            <div style={styles.inputWrapper}>
              <span style={styles.countryCode}>+91</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setError('');
                  setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                }}
                placeholder="Please enter your mobile number"
                required
                style={styles.input}
                maxLength="10"
              />
            </div>
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            style={isSubmitting ? styles.buttonSubmitting : styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Verifying...'
            ) : (
              <>
                <FiLogIn style={styles.buttonIcon} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>Need help? Contact HR at hr@company.com</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    padding: '20px',
  },
  loginCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '400px',
    padding: '40px 30px',
    textAlign: 'center',
  },
  logoContainer: {
    marginBottom: '30px',
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    marginBottom: '15px',
  },
  logoIcon: {
    color: 'white',
    fontSize: '28px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputContainer: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputWrapperFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
  countryCode: {
    padding: '0 12px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '14px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    borderRight: '1px solid #e2e8f0',
  },
  input: {
    flex: '1',
    padding: '12px',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: '#1e293b',
    backgroundColor: 'transparent',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    backgroundColor: '#2563eb',
  },
  buttonSubmitting: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
  buttonIcon: {
    fontSize: '18px',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: '12px',
    borderRadius: '8px',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '14px',
    margin: '0',
    textAlign: 'center',
  },
  footer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    fontSize: '12px',
    color: '#64748b',
    margin: '0',
  },
};

export default Login;
