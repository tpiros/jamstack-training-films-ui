import { useFetchUser } from '../lib/authContext';
import Layout from '../components/Layout';
import { default as RegisterComponent } from '../components/Register';
const Register = () => {
  const { user, loading } = useFetchUser();
  return (
    <Layout user={user}>
      <RegisterComponent />
    </Layout>
  );
};

export default Register;
