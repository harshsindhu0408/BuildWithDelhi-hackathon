import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const navigateToPage = () => {
    if (selectedRole === 'client') {
      navigate('/getClientData'); // Replace with your client page route
    } else if (selectedRole === 'therapist') {
      navigate('/getTherapistData'); // Replace with your therapist page route
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white w-3/12 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Select Your Role</h1>
        <div className="mb-4">
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="client"
                checked={selectedRole === 'client'}
                onChange={() => handleRoleSelect('client')}
                className="text-blue-500 focus:ring focus:ring-blue-200"
              />
              <span>Client</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="therapist"
                checked={selectedRole === 'therapist'}
                onChange={() => handleRoleSelect('therapist')}
                className="text-blue-500 focus:ring focus:ring-blue-200"
              />
              <span>Therapist</span>
            </label>
          </div>
        </div>
        <button
          onClick={navigateToPage}
          disabled={!selectedRole}
          className={`w-full bg-blue-500 text-white p-2 rounded-md ${!selectedRole && 'cursor-not-allowed opacity-50'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
