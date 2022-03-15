import { data } from 'autoprefixer';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { fetcher } from '../lib/api';
import { getIdFromLocalCookie, getTokenFromServerCookie } from '../lib/auth';
import { useFetchUser } from '../lib/authContext';
const Profile = ({ avatar }) => {
  const { user, loading } = useFetchUser();
  const [image, setImage] = useState(null);
  const router = useRouter();

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const tmpImage = event.target.files[0];
      setImage(tmpImage);
    }
  };
  const uploadToServer = async () => {
    const formData = new FormData();
    const file = image;
    formData.append('inputFile', file);
    formData.append('user_id', await getIdFromLocalCookie());
    try {
      const responseData = await fetcher('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (responseData.message === 'success') {
        router.reload('/profile');
      }
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  };
  return (
    <Layout user={user}>
      <>
        <h1 className="text-5xl font-bold">
          Welcome back{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            {user}
          </span>
          <span>👋</span>
        </h1>
        {avatar === 'default_avatar' && (
          <div>
            <h4>Select an image to upload</h4>
            <input type="file" onChange={uploadToClient} />
            <button
              className="md:p-2 rounded py-2 text-black bg-purple-200 p-2"
              type="submit"
              onClick={uploadToServer}
            >
              Set Profile Image
            </button>
          </div>
        )}
        {/* eslint-disable @next/next/no-img-element */}
        {avatar && (
          <img
            src={`https://res.cloudinary.com/tamas-demo/image/upload/f_auto,q_auto,w_150,h_150,g_face,c_thumb,r_max/${avatar}`}
            alt="Profile"
          />
        )}
      </>
    </Layout>
  );
};

export default Profile;

export async function getServerSideProps({ req }) {
  const jwt = getTokenFromServerCookie(req);
  if (!jwt) {
    return {
      redirect: {
        destination: '/',
      },
    };
  } else {
    const responseData = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    const avatar = responseData.avatar ? responseData.avatar : 'default_avatar';
    return {
      props: {
        avatar,
      },
    };
  }
}
