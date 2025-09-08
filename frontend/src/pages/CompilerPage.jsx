import React, { useState } from "react";
import Header from "../components/Header";
import CodeEditor from "../components/CodeEditor";
import Output from "../components/Output";
import { getAuth, signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth";
import app from '../firebase';

const auth = getAuth(app);
const provider = new GithubAuthProvider();

const CompilerPage = () => {
  // User state for Firebase login
  const [user, setUser] = useState(null);
  
  // Code editor and output states
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  // Login with GitHub using Firebase
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token); // Save Firebase ID token
      setUser(result.user);
    } catch (err) {
      console.error("Login error:", err);
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
    try {
      const res = await fetch("http://localhost:5000/api/compile/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (data.success) {
        setOutput(data.output || "No output");
      } else {
        setOutput("Error: " + data.error);
      }
    } catch (err) {
      setOutput("Error connecting to backend");
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
