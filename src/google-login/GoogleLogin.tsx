"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useGoogleOAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";


export default function GoogleInComponent() {
  const router = useRouter();

  const { mutate: googleLogin } = useGoogleOAuth();


  const handleGoogleSuccess = (credentialResponse: {
    credential?: string;
  }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.add({
        title: "Authentication Failed",
        description: "Something went wrong",
        type: "error",
      });
      return;
    }


    googleLogin(
      { idToken },
      {
        onSuccess: (res) => {
          localStorage.setItem(
            "accessToken",
            res.data.accessToken
          );

          toast.add({
            title: "Login Success",
            description: "Welcome back",
            type: "success",
          });

          router.push("/");
        },

        onError: (err) => {
          toast.add({
            title: "Authentication Failed",
            description:
              err.message || "Something went wrong",
            type: "error",
          });
        },
      }
    );
  };


  const handleGoogleError = () => {
    toast.add({
      title: "Google Login Failed",
      description: "Please try again",
      type: "error",
    });
  };


  return (
    <GoogleLogin
      theme="outline"
      shape="pill"
      text="continue_with"
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
    />
  );
}