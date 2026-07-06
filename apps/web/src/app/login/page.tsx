"use client";

import Header from "./_components/Header";
import Loading from "./_components/Loading";
import LoginActions from "./_components/LoginActions";
import TolliLogoImage from "./_components/TolliLogoImage";
import LoginErrorMessage from "./_components/LoginErrorMessage";
import LoginButton from "./_components/LoginButton";
import UpdateRequiredModal from "../dashboard/_components/UpdateRequiredModal";
import { useCheckAppVersion } from "../dashboard/_hooks/useCheckAppVersion";
import useLogin from "./_hooks/useLogin";

export default function LoginPage() {
  const { state, requestLogin } = useLogin();
  const needUpdate = useCheckAppVersion();

  return (
    <>
      {needUpdate && <UpdateRequiredModal />}
      <Loading state={state} />
      <Header />
      <TolliLogoImage />
      <LoginActions>
        <LoginErrorMessage state={state} />
        <LoginButton requestLogin={requestLogin} />
      </LoginActions>
    </>
  );
}
