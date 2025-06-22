import AuthForm from '../../components/auth/AuthForm';

const AuthPage = ({ type = 'login' }) => {
  return (
    <AuthForm type={type} />
  );
};

export default AuthPage;
