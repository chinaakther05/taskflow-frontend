"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "../ui/field";
import { loginSchema } from "@/validation";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useGoogleOAuth, useLogin } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import { GoogleLogin, } from "@react-oauth/google";



export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {mutate: login, isPending: loginPending} = useLogin();
const {mutate: googleLogin} = useGoogleOAuth();

const [demoRole, setDemoRole] = useState<string>("");

 const form = useForm({
      defaultValues: {
        email: "",
        password: "" 
      },
      validators: {
        onSubmit: loginSchema,
        
      },
      onSubmit: ({value}) => {
        const loginData = {
          email: value.email,
          password: value.password
        }
        
        login(loginData, {
          onSuccess: (res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
            toast.add({
            title: "Login Success",
            description: "Welcome back",
            type: "success"
            })
            router.push("/");
          },
          onError: (err) => {
            toast.add({
            title: "Authentication Failed",
            description: err.message || "Sumathing went wrong. Please try again later",
            type: "error"
            })
          } 
        });

      }
 }) 

const handleGoogleSuccess = (credentialResponse: {
  credential?: string;
}) => {
const idToken = credentialResponse.credential;

  if (!idToken) {
    toast.add({
      title: "Authentication Failed",
      description: "Something went wrong. Please try again later",
      type: "error",
    });
    return;
  }
  googleLogin({idToken}, {
    onSuccess: (res) => {
    localStorage.setItem(
      "accessToken",
      res.data.accessToken
    );

    toast.add({
      title: "Logged in Successfully",
      description: "Welcome back",
      type: "success",
    });

    router.push("/");
    },
    onError: (err) => {
      toast.add({
      title: "Authentication Failed",
      description:err.message || "Something went wrong. Please try again later",
      type: "error",
    });
    }
  })
};

const handleGoogleError = () => {
  toast.add({
    title: "Authentication Failed",
    description: "Something went wrong. Please try again later",
    type: "error",
  });
};

  return (
    <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 items-center text-center">
         <h1 className="text-2xl font-bold tracking-tight">Login to your account</h1>
         <p className="text-balance text-sm text-muted-foreground">Enter your email and password to access your account.</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(e);
        }}>

          <FieldGroup>
            <form.Field name="email">
        {(field) => {

          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

          return (
          <Field data-invalid={isInvalid}>
             <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input id={field.name} name={field.name} onChange={(e) =>field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              value={field.state.value} autoComplete="off"
              aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors}/> }
          </Field>
          );
        }}
        </form.Field>

         {/* password field */}
          <form.Field name="password">
        {(field) => {

          const isInvalid= field.state.meta.isTouched && !field.state.meta.isValid;

          return (
          <Field data-invalid={isInvalid}>
             <FieldLabel htmlFor={field.name}>Password</FieldLabel>
             <div className="relative">
                <Input
                 id={field.name} 
                 name={field.name} 
                 type={showPassword ? "text" : "password"} onChange={(e) =>field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              value={field.state.value} autoComplete="off"
              aria-invalid={isInvalid} />
              <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 "
              type="button" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <EyeClosed className="size-4"/> : <Eye className="size-4"/> }
              </button>
             </div>
               {isInvalid && <FieldError errors={field.state.meta.errors}/> }
          </Field>
          );
        }}
        </form.Field>

        <Button disabled={loginPending} type="submit">
          {
            loginPending ? <> <Spinner/> Submitting</>:"Submit"
          }
          
         </Button>

         <div className="mt-4 flex flex-col gap-2">
  <p className="text-center text-sm text-muted-foreground">
    Demo Login
  </p>

  <select
    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
    value={demoRole}
    onChange={(e) => setDemoRole(e.target.value)}
  >
    <option value="">Select demo account</option>
    <option value="admin">Admin</option>
    <option value="manager">Project Manager</option>
    <option value="member">Member</option>
  </select>

  <Button
    type="button"
    variant="outline"
    disabled={!demoRole}
    onClick={() => {
      const credentials = {
        admin: {
          email: "sohag@test.com",
          password: "Sohag@123",
        },
        manager: {
          email: "manager@taskflow.com",
          password: "Manager@123",
        },
        member: {
          email: "member@taskflow.com",
          password: "Member@123",
        },
      };

      const selected = credentials[demoRole as keyof typeof credentials];

      login(selected, {
        onSuccess: (res) => {
          localStorage.setItem(
            "accessToken",
            res.data.accessToken
          );

          router.push("/");
        },
      });
    }}
  >
    Continue Demo Login
  </Button>
</div>

          </FieldGroup>

         </form>
   <FieldSeparator>OR continue with</FieldSeparator>

   <GoogleLogin 
   theme="outline"
   shape="pill"
   text="continue_with"
   onSuccess={handleGoogleSuccess}
    onError={handleGoogleError} />

    </div>
  );
}