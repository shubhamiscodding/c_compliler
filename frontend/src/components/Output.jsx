import React from "react";

const Output = ({ output }) => {
  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-brown-700 rounded min-h-[100px] font-mono whitespace-pre-wrap">
      {output}
    </div>
  );
};

export default Output;
