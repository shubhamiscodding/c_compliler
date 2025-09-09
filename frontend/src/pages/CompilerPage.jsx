import React, { useState } from "react";
import Header from "../components/Header";
import CodeEditor from "../components/CodeEditor";
import Output from "../components/Output";
import { getAuth, signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth";
import { app, auth } from '../firebase';

// Auth is now imported directly from firebase.js
const provider = new GithubAuthProvider();

const CompilerPage = () => {
  // User state for Firebase login
  const [user, setUser] = useState(null);
  
  // Code editor and output states
  const [code, setCode] = useState(`#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`);
  const [output, setOutput] = useState("");

  // Login with GitHub using Firebase
  const handleLogin = async () => {
    try {
      // Configure GitHub provider
      const provider = new GithubAuthProvider();
      provider.setCustomParameters({
        'allow_signup': 'true'
      });

      // Sign in with popup
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token); // Save Firebase ID token
      setUser(result.user);
      
      console.log("Login successful:", result.user.displayName);
    } catch (err) {
      console.error("Login error:", err);
      // Show more detailed error information
      if (err.code === 'auth/popup-blocked') {
        alert('Please allow popups for this website to login with GitHub');
      } else if (err.code === 'auth/cancelled-popup-request') {
        console.log('Login cancelled by user');
      } else if (err.code === 'auth/unauthorized-domain') {
        alert('This domain is not authorized for OAuth operations. Please add it in your Firebase Console.');
      } else {
        alert('Error logging in: ' + err.message);
      }
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    setUser(null);
  };

  // Run code by calling backend API
  const handleRun = async () => {
    if (!code.trim()) {
      setOutput("Error: Please enter some code to compile");
      return;
    }

    try {
      setOutput("Compiling...");
      
      const res = await fetch("http://localhost:5000/api/compile/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          code: code.trim()
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Compilation failed');
      }

      if (data.success) {
        setOutput(data.output || "Program compiled and ran successfully with no output");
      } else {
        setOutput("Compilation Error: " + (data.error || "Unknown error occurred"));
      }
    } catch (err) {
      setOutput("Error: " + (err.message || "Failed to connect to the compiler service"));
      console.error("Compilation error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header with login/logout */}
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />

      {/* Code editor */}
      <CodeEditor code={code} setCode={setCode} />

      {/* Run button */}
      <button
        onClick={handleRun}
        className="mt-4 px-6 py-2 bg-brown-700 text-yellow-100 font-bold rounded hover:bg-brown-800"
      >
        Run
      </button>

      {/* Output display */}
      <Output output={output} />
    </div>
  );
};

export default CompilerPage;
