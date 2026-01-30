import { useGetAuthUserQuery, useUpdateManagerSettingsMutation } from '@/state/api'
import SettingsForm from '@/components/SettingsForm/SettingsForm';

type initialDataType = {
    name: string;
    email: string;
    phoneNumber: string;
}

function Settings() {
    
     const [updateManagerSettings]=useUpdateManagerSettingsMutation();
     const {data:authUser}=useGetAuthUserQuery();
     console.log('Auth User Data:', authUser);

     const initialData:initialDataType =  {
        name: authUser?.userInfo?.name || '',
        email: authUser?.userInfo?.email || '',
        phoneNumber: authUser?.userInfo?.phoneNumber || '',
     }

     const handleSubmit = async (data: initialDataType) =>{
           
     }


  return (
    <div>
      <SettingsForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        userType="manager" 
        isSubmitting={false}
      />
    </div>

  )
}

export default Settings