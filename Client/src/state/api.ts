import { Manager, Tenant } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { createNewUserInDatabase } from "@/lib/utils";

// Define User type (if not already defined)
interface User {
  cognitoInfo: {
    username: string;
    userId: string;
    signInDetails?: any;
  };
  userInfo: Tenant | Manager;
  userRole: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        const session = await fetchAuthSession();
        const { idToken } = session.tokens ?? {};
        
        if (idToken) {
          headers.set("Authorization", `Bearer ${idToken}`);
        }
      } catch (error) {
        // Session doesn't exist (user is logged out)
        console.log("No active session");
      }
      return headers;
    }
  }),
  reducerPath: "api",
  tagTypes: ['managers', 'tenants', 'authUser'],
  endpoints: (build) => ({
    // Fetch authenticated user details
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          // Check if session exists first
          const session = await fetchAuthSession();
          const { idToken } = session?.tokens ?? {};
          
          // Return early if no session (user logged out)
          if (!idToken) {
            return {
              error: {
                status: 'NO_SESSION',
                data: 'User is not authenticated'
              }
            };
          }
          
          const currentLoginUser = await getCurrentUser();
          const userRole = idToken.payload['custom:role'] as string;

          if (!userRole || !['manager', 'tenant'].includes(userRole)) {
            return {
              error: {
                status: 'INVALID_ROLE',
                data: `Invalid user role: ${userRole}`
              }
            };
          }
          
          const endpoint = userRole === 'manager'
            ? `/managers/${currentLoginUser.userId}`
            : `/tenants/${currentLoginUser.userId}`;
                    
          let userDetailsResponse = await fetchWithBQ(endpoint);
          
          if (userDetailsResponse.error) {
            const errorStatus = userDetailsResponse.error?.status;
            
            if (errorStatus === 404 || errorStatus === 400) {
              console.log('User not found in database, creating new user...');
              
              try {
                userDetailsResponse = await createNewUserInDatabase(
                  currentLoginUser,
                  idToken,
                  userRole,
                  fetchWithBQ
                );
              } catch (createError) {
                return {
                  error: {
                    status: 'CREATE_USER_FAILED',
                    data: 'Failed to create user in database'
                  }
                };
              }
            } else {
              return {
                error: {
                  status: errorStatus,
                  data: userDetailsResponse.error
                }
              };
            }
          }
          
          if (!userDetailsResponse.data) {
            return {
              error: {
                status: 'NO_DATA',
                data: 'User data is missing from response'
              }
            };
          }
          
          const userData: User = {
            cognitoInfo: {
              username: currentLoginUser.username,
              userId: currentLoginUser.userId,
              signInDetails: currentLoginUser.signInDetails,
            },
            userInfo: userDetailsResponse.data as Tenant | Manager,
            userRole
          };
          
          return { data: userData };
          
        } catch (error) {
          console.error('Error in getAuthUser:', error);
          
          // Don't throw error for session-related issues
          if (error instanceof Error && 
              (error.message.includes('No current user') || 
               error.message.includes('not authenticated'))) {
            return {
              error: {
                status: 'NO_SESSION',
                data: 'User is not authenticated'
              }
            };
          }
          
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: error instanceof Error ? error.message : 'Failed to fetch user'
            }
          };
        }
      },
      providesTags: (result) => {
        if (!result) return [];
        
        const tags: any[] = [
          // Tag for auth user (always refetch when invalidated)
          { type: 'authUser', id: 'CURRENT' }
        ];
        
        // Also tag specific tenant/manager
        if (result.userRole === 'tenant') {
          tags.push({ type: 'tenants', id: result.userInfo.id });
        } else if (result.userRole === 'manager') {
          tags.push({ type: 'managers', id: result.userInfo.id });
        }
        return tags;
      }
    }),

    // Update Tenant Settings
    updateTenantSettings: build.mutation<
      Tenant,
      { cognitoId: string } & Partial<Tenant>
    >({
      query: ({ cognitoId, ...updatedTenant }) => ({
        url: `/tenants/${cognitoId}`,
        method: 'PUT',
        body: updatedTenant
      }),
      invalidatesTags: (result) => {
        return result ? [{ type: 'tenants', id: result.id }] : [];
  }}),

    // Update Manager Settings
    updateManagerSettings: build.mutation<
      Manager,
      { cognitoId: string } & Partial<Manager>
    >({
      query: ({ cognitoId, ...updatedManager }) => ({
        url: `/managers/${cognitoId}`,
        method: 'PUT',
        body: updatedManager
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'managers', id: result.id }] : []
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation
} = api; 