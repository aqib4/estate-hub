'use client';
import SettingsForm from '@/components/SettingsForm/SettingsForm';
import { 
  useGetAuthUserQuery, 
  useUpdateTenantSettingsMutation 
} from '@/state/api';
import React, { useState, useEffect } from 'react';

interface SettingsFormData {
  name: string;
  email: string;
  phoneNumber: string;
}

function Settings() {
  const { 
    data: authuser, 
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: userError,
    refetch: refetchUser
  } = useGetAuthUserQuery();

  console.log("authuser", authuser);
  const [
    updateTenantSettings, 
    { 
      isLoading: isUpdating,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
      reset: resetMutation
    }
  ] = useUpdateTenantSettingsMutation();

  //  UI state for notifications
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Proper initial data with fallbacks
  const initialData: SettingsFormData = {
    name: authuser?.userInfo?.name || '',
    email: authuser?.userInfo?.email || '',
    phoneNumber: authuser?.userInfo?.phoneNumber || '',
  };

  // Handle update with proper error handling
  const handleUpdateSettings = async (data: SettingsFormData) => {
    console.log('📤 Submitting settings update:', data);

    //  Validate user is authenticated
    if (!authuser?.cognitoInfo?.userId) {
      setErrorMessage('User not authenticated. Please log in again.');
      return;
    }

    try {
      // ✅ Clean data: empty strings → null
      const cleanedData = {
        name: data.name?.trim() || '',
        email: data.email?.trim() || '',
        phoneNumber: data.phoneNumber?.trim() || null,  // ✅ Empty → null
      };

      // ✅ Validate required fields
      if (!cleanedData.name) {
        setErrorMessage('Name is required');
        return;
      }

      if (!cleanedData.email) {
        setErrorMessage('Email is required');
        return;
      }

      console.log('🧹 Cleaned data:', cleanedData);

      // ✅ Make API call
      const result = await updateTenantSettings({
        cognitoId: authuser.cognitoInfo.userId,
        ...cleanedData
      }).unwrap();


      console.log('✅ Update successful:', result);

      // ✅ Show success message
      setSuccessMessage('Settings updated successfully!');
      
      // ✅ Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error: any) {
      console.error('❌ Update failed:', error);

      // ✅ Extract and display error message
      let message = 'Failed to update settings';

      if (error.status === 400) {
        message = error.data?.message || 'Invalid data provided';
      } else if (error.status === 401) {
        message = 'Session expired. Please log in again.';
      } else if (error.status === 404) {
        message = 'User not found';
      } else if (error.status === 500) {
        message = 'Server error. Please try again later.';
      } else if (error.data?.message) {
        message = error.data.message;
      } else if (error.message) {
        message = error.message;
      }

      setErrorMessage(message);

      // ✅ Clear error message after 10 seconds
      setTimeout(() => setErrorMessage(''), 10000);
    }
  };

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      setSuccessMessage('');
      setErrorMessage('');
    };
  }, []);

  // Loading state
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  if (isErrorUser || !authuser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Settings
          </h2>
          <p className="text-gray-600 mb-4">
            {userError?.data?.message || 'Unable to fetch your account information'}
          </p>
          <button
            onClick={() => refetchUser()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <SettingsForm
        initialData={initialData}
        onSubmit={handleUpdateSettings}
        userType="tenant"
        isSubmitting={isUpdating}
      />

      {/* ✅ Success notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-semibold">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage('')}
              className="ml-auto text-white hover:text-green-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ✅ Error notification */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <span className="text-2xl">⚠</span>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="ml-auto text-white hover:text-red-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Settings;