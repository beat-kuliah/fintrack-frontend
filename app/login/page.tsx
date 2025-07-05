"use client";

import AuthLogin from "@/components/AuthLogin";
import withoutAuth from "@/components/hocs/withoutAuth";
import useAxiosHandler from "@/utils/axiosHandler";
import { userTokenKey } from "@/utils/contants";
import { authUrl } from "@/utils/network";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";

interface LoginType {
  token: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const Router = useRouter();
  const { axiosHandler } = useAxiosHandler();

  const onSubmit = async (
    e: FormEvent<HTMLFormElement>,
    formRef: React.RefObject<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    const arg = {
      username: formRef.current?.username.value,
      password: formRef.current?.password.value,
    };
    const response = await axiosHandler<LoginType>({
      method: "POST",
      url: authUrl.login,
      data: arg,
    });
    setLoading(false);

    if (response.data) {
      localStorage.setItem(userTokenKey, response.data.token);
      toast("Login successful", { type: "success" });
      Router.push("/");
    }
  };
  return <AuthLogin loading={loading} showRemembered onSubmit={onSubmit} />;
};

export default withoutAuth(Login);
