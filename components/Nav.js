import Link from 'next/link';
import { useState } from 'react';
import { fetcher } from '../lib/api';
import { setToken, unsetToken } from '../lib/auth';
import { useUser } from '../lib/authContext';

const Nav = () => {
  const [data, setData] = useState({
    identifier: '',
    password: '',
  });

  const { user, loading } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const responseData = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
        }),
      }
    );
    setToken(responseData);
  };

  const logout = () => {
    unsetToken();
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <nav
      className="
          flex flex-wrap
          items-center
          justify-between
          w-full
          py-4
          md:py-0
          px-4
          text-lg text-gray-700
          bg-white
        "
    >
      <div>
        <Link href="/" passHref>
          <a>
            {/* eslint-disable @next/next/no-img-element */}
            <img
              className="m-3"
              src="/strapi-logo.png"
              width={200}
              height={50}
              alt="Strapi Logo"
            />
          </a>
        </Link>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="menu-button"
        className="h-6 w-6 cursor-pointer md:hidden block"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>

      <div
        className="hidden w-full md:flex md:items-center md:w-auto"
        id="menu"
      >
        <ul
          className="
              pt-4
              text-base text-gray-700
              md:flex
              md:justify-between 
              md:pt-0 space-x-2"
        >
          <li>
            <Link href="/">
              <a className="md:p-2 py-2 block hover:text-purple-400">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/films">
              <a className="md:p-2 py-2 block hover:text-purple-400" href="#">
                Films
              </a>
            </Link>
          </li>
          {!loading &&
            (user ? (
              <li>
                <Link href="/profile">
                  <a className="md:p-2 py-2 block hover:text-purple-400">
                    Profile
                  </a>
                </Link>
              </li>
            ) : (
              ''
            ))}
          {!loading &&
            (user ? (
              <li>
                <a
                  className="md:p-2 py-2 block hover:text-purple-400"
                  onClick={logout}
                  style={{ cursor: 'pointer' }}
                >
                  Logout
                </a>
              </li>
            ) : (
              ''
            ))}
          {!loading && !user ? (
            <>
              <li>
                <form onSubmit={handleSubmit} className="form-inline">
                  <input
                    type="text"
                    name="identifier"
                    onChange={handleChange}
                    placeholder="Username"
                    className="md:p-2 form-input py-2 rounded mx-2"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    className="md:p-2 form-input py-2 rounded mx-2"
                    required
                  />

                  <button
                    className="md:p-2 rounded py-2 text-black bg-purple-200 p-2"
                    type="submit"
                  >
                    Login
                  </button>
                </form>
              </li>
              <li>
                <Link href="/register">
                  <a className="md:p-2 block py-2 hover:text-purple-400 text-black">
                    Register
                  </a>
                </Link>
              </li>
            </>
          ) : (
            ''
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
