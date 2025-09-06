import React from "react";

const Header = ({ user, onLogin, onLogout }) => {
  return (
    <header className="flex justify-between items-center mb-6 p-4 bg-yellow-200 rounded shadow">
      <h1 className="text-2xl font-bold text-brown-700">C Compiler Online</h1>
      
      <div>
        {user ? (
          <>
            <span className="mr-4 text-brown-700">Hello, {user.displayName || "User"}</span>
            <button
              onClick={onLogout}
              className="px-4 py-1 bg-brown-700 text-yellow-100 rounded hover:bg-brown-800"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={onLogin}
            className="px-4 py-1 bg-brown-700 text-yellow-100 rounded hover:bg-brown-800"
          >
            Login with GitHub
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
