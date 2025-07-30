import { toast } from "react-hot-toast"; // Or use react-toastify
let isRedirecting = false; // Redirect guard to prevent multiple redirects

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("auth_token");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 && !isRedirecting) {
      isRedirecting = true; // Lock further redirects
      localStorage.removeItem("auth_token");
      localStorage.removeItem("session_id");
      localStorage.removeItem("user_data");

      toast.error("Session expired. Redirecting to login...");
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1500); // Give user time to read toast

      return;
    }

    return await response.json();
  } catch (err) {
    console.error("authFetch error:", err);
    throw err;
  }
};
