"use client";
import { Amplify } from "aws-amplify";
import { View, Heading, RadioGroupField, Radio } from "@aws-amplify/ui-react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_USER_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_CLIENT_ID!,
    },
  },
});

const components = {
  Header() {
    return (
      <View>
        <Heading level={3} className="!text-2xl !font-bold">
          Estate <span className="!text-red-500">Hub</span>
        </Heading>
        <p className="text-muted-foreground mt-2">
          <span className="font-bold">Welcome!</span> Please sign in to
          continue.
        </p>
      </View>
    );
  },
  SignIn: {
    Footer() {
      const router = useRouter();
      const { toForgotPassword } = useAuthenticator();
      return (
        <View className="text-center">
          <button
            className="text-sm text-primary font-medium mb-4"
            onClick={toForgotPassword}
          >
            Forgot password?
          </button>
          <p className="mt-4 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              className="text-primary font-medium"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </p>
        </View>
      );
    },
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();
      return (
        <>
          <Authenticator.SignUp.FormFields
            fields={["username", "email", "password", "confirm_password"]}
          />

          <RadioGroupField
            legend="Role"
            name="custom:role"
            errorMessage={validationErrors["custom:role"]}
            hasError={!!validationErrors["custom:role"]}
            isRequired
          >
            <Radio value="tenant">Tenant</Radio>
            <Radio value="manager">Manager</Radio>
          </RadioGroupField>
        </>
      );
    },
    Footer() {
      const router = useRouter();
      return (
        <View className="text-center">
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              className="text-primary font-medium"
              onClick={() => router.push("/signin")}
            >
              Sign In
            </button>
          </p>
        </View>
      );
    },
  },
};

const FormFields = {
  signIn: {
    username: {
      order: 1,
      placeholder: "Enter your username",
      label: "Username",
      isRequired: true,
    },
    password: {
      placeholder: "Enter your password",
      label: "Password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: "Enter your username",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 2,
      isRequired: true,
      label: "Email",
      placeholder: "Please enter your Email:",
    },
    password: {
      order: 3,
      placeholder: "Enter your password",
      label: "Password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      isRequired: true,
    },
  },
};

export const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage =
    pathname.startsWith("/manager") || pathname.startsWith("/tenant");

  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/landing");
    }
  }, [user, isAuthPage, router]);

  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      <Authenticator
        initialState={pathname.includes("signup") ? "signUp" : "signIn"}
        components={components}
        formFields={FormFields}
      >
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
};

export default Auth;
