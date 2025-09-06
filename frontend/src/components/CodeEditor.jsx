import React from "react";

const CodeEditor = ({ code, setCode }) => {
  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder="Write your C code here..."
      className="w-full h-60 p-4 rounded border border-brown-700 bg-yellow-50 text-brown-700 font-mono"
    />
  );
};

export default CodeEditor;
