"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { loginSchema } from "@/validation";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";


export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

 const form = useForm({
      defaultValues: {
        email: " ",
        password: " " 
      },
      validators: {
        onSubmit: loginSchema,
        
      },
      onSubmit: ({value}) => {
        console.log(value)
      }
 }) 

 

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

        <Button type="submit">Submit</Button>
          </FieldGroup>

         </form>
    </div>
  );
};