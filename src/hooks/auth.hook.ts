import { getMe, googleOAuth, userLogin, userLogout, userRegister } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin(){
    return useMutation({
        mutationFn: userLogin
    })
}

export function useLogout(){
    return useMutation({
        mutationFn: userLogout
    })
}

export function useGoogleOAuth(){
    return useMutation({
        mutationFn: googleOAuth
    })
}

//export function useGetMe(){
//     return useQuery({
//         queryKey: ['me'],
//         queryFn: getMe,
//     })
//}


export function useGetMe() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  return useQuery({
    queryKey: ["me", token],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  });
}


export function useRegister() {
  return useMutation({
    mutationFn: userRegister,
  });
}