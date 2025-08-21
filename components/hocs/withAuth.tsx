import { userShowBalanceKey, userTokenKey } from "@/utils/contants";
import { userUrl } from "@/utils/network";
import React, { useContext, useEffect, useState } from "react";
import { ActionTypes, store } from "../StoreProvider";
import useLogout from "../hooks/useLogout";
import useAxiosHandler from "@/utils/axiosHandler";

export interface UserType {
  id: string;
  created_at: string;
  updated_at: string;
  username: string;
  name: string;
}

const withAuth = <T extends object>(
  WrapperComponent: React.ComponentType<T>
) => {
  const WithAuth = (props: T) => {
    const [checking, setChecking] = useState(true);
    const {
      dispatch,
      state: { activeUser },
    } = useContext(store);
    const { logout } = useLogout();
    const { axiosHandler } = useAxiosHandler();

    const handleAuth = async () => {
      const userToken = localStorage.getItem(userTokenKey);
      if (userToken) {
        if (!activeUser) {
          const res = await axiosHandler<UserType>({
            method: "GET",
            url: userUrl.me,
            isAuthorized: true,
          });
          if (res.data) {
            dispatch({ type: ActionTypes.UpdateUser, payload: res.data });
            setChecking(false);
            localStorage.setItem(userShowBalanceKey, "true");
          } else {
            logout();
          }
        } else {
          setChecking(false);
        }
      } else {
        logout();
      }
    };

    useEffect(() => {
      handleAuth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (checking) {
      return <h3>Loading... Please wait</h3>;
    }

    return <WrapperComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
