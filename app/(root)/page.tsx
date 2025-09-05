"use client";

import React, { useContext, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import withAuth from "@/components/hocs/withAuth";
import { useModal } from "@/components/hooks/useModal";
import { store } from "@/components/StoreProvider";

const Home = () => {
  const { showModal } = useModal(false);
  const {
    state: { activeUser },
  } = useContext(store);
  useEffect(() => {
    if (!activeUser?.name) showModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout>
      <h1 className="title">
        
      </h1>
    </MainLayout>
  );
};

export default withAuth(Home);
