import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormField } from "../FormField";

function SettingsForm({ initialData, onSubmit, userType, isSubmitting }: SettingsFormProps) {
  const [editMode, setEditMode] = useState(false);
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  // Handle cancel button click
  const handleCancel = () => {
    console.log('🔄 Canceling, resetting to:', initialData);
    form.reset(initialData);  
    setEditMode(false);        
  };

  // Handle edit button click
  const handleEdit = () => {
    console.log('✏️ Entering edit mode');
    setEditMode(true);
  };

  const handleFormSubmit = async (data: SettingsFormData) => {
    try {
      await onSubmit(data); 
      console.log('✅ Form submitted successfully');
      setEditMode(false); 
      form.reset(data); 
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-3 md:p-6 lg:p-8">
      <h2 className="text-[1.4rem] md:text-[2rem] lg:text-[2.5rem] font-quicksand font-medium text-gray-950 ">
        {`${userType.charAt(0).toUpperCase() + userType.slice(1)}`} Settings
      </h2>
      <p className="font-quicksand font-normal text-gray-950 text-md md:text-lg lg:ml-2">
        Manage Your account prefrance and personal information.
      </p>
      <div className="w-full lg:w-1/2 background-white rounded-lg p-3">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            {/* Text input */}
            <CustomFormField
              name="name"
              label="Name"
              type="text"
              disabled={!editMode}
            />

            {/* Email input */}
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              disabled={!editMode}
            />

            {/* Phone */}
            <CustomFormField
              name="phoneNumber"
              label="Phone Number"
              disabled={!editMode}
            />

            <div className="flex justify-between items-center">
              <button
                 type="button" 
                 onClick={editMode ? handleCancel : handleEdit}
                 disabled={isSubmitting}
                 className={`
                    px-4 py-2 rounded-md font-medium transition-colors
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                    ${
                      editMode
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }
                  `}
                >
                  {editMode ? "Cancel" : "Edit"}
              </button>
              {editMode && (
                <button
                    type="submit"
                  className="mt-4 px-4 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600"
                >
                  { isSubmitting ? "Saving...." : "Save Changes" }
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default SettingsForm;
