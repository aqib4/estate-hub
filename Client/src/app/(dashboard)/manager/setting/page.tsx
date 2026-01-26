import SettingsForm from '@/components/SettingsForm/SettingsForm'
import { useGetAuthUserQuery, useUpdateManagerSettingsMutation } from '@/state/api'
import { userInfo } from 'os';
import React, { use } from 'react'

type initialDataType = {
    name: string;
    email: string;
    phoneNumber: string;
}

function Settings() {
    
     const [updateManagerSettings]=useUpdateManagerSettingsMutation();
     const {data:authUser,error}=useGetAuthUserQuery();
     console.log('Auth User Data:', authUser);

     const initialData:initialDataType =  {
        name: authUser?.userInfo?.name || '',
        email: authUser?.userInfo?.email || '',
        phoneNumber: authUser?.userInfo?.phoneNumber || '',
     }

     const handleSubmit = async (data: initialDataType) =>{
           
     }



     


  return (
    <SettingsForm  
    
    />

  )
}

export default Settings