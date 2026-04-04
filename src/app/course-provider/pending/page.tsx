import React from "react";

const ApprovalPending = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
      <img
        src="waiting.svg" 
        alt="Waiting for approval"
        className="w-24 h-24 mb-4"
      />
      <h2 className="text-xl font-semibold mb-2">Approval Pending</h2>
      <p className="text-gray-600">Your account is under review. Please wait for admin approval.</p>
    </div>
  );
};

export default ApprovalPending;
