import Header from "./_components/Header";
import Loading from "./_components/Loading";
import LoginLayout from "./_components/LoginLayout";
import LoginActions from "./_components/LoginActions";
import TolliLogoImage from "./_components/TolliLogoImage";
import LoginErrorMessage from "./_components/LoginErrorMessage";
import LoginButton from "./_components/LoginButton";
import useLogin from "./_hooks/useLogin";

export default function LoginPage() {
  const { loading, error, requestLogin } = useLogin();

  return (
    <LoginLayout>
      <Loading loading={loading} />
      <Header />
      <TolliLogoImage />
      <LoginActions>
        <LoginErrorMessage error={error} />
        <LoginButton requestLogin={requestLogin} />
      </LoginActions>
    </LoginLayout>
  );
}
