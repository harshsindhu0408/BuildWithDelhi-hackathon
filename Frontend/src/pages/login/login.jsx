import { useContext, useEffect, useState } from "react";
import { LoginWithGoogle } from "../../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import LoginContext from "../../context/context";
import axios from "axios";

function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(LoginContext);

  const handleLoginWithGoogle = () => {
    async function loginGoogle() {
      try {
        const res = await LoginWithGoogle();
        if (res) {
          async function isUser() {
            try {
              const user = await axios.get(
                process.env.REACT_APP_API_LINK + "/isUser",
                {
                  withCredentials: true,
                }
              );
              if (user) {
                console.log("Yes");
              }
            } catch (error) {
              if (error.response.status === 404) {
                navigate("/roleSelection");
              }
            }
          }
          isUser();
          setLoggedIn(true);
        }
      } catch (error) {}
    }
    loginGoogle();
  };

  useEffect(() => {
    if (loggedIn) {
      login();
      navigate("/message");
    }
  }, [loggedIn]);

  return (
    <>
      <main className="flex flex-col bg-neutral-800 items-center justify-center w-full min-h-screen">
        <button
          onClick={() => {
            handleLoginWithGoogle();
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 text-lg w-80 gap-x-8
          font-semibold text-white bg-slate-700  border border-transparent 
          rounded-md hover:scale-105 transition-all duration-200"
        >
          <svg
            className="h-6 w-auto"
            viewBox="0 0 256 262"
            preserveAspectRatio="xMidYMid"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              fill="#4285F4"
            ></path>
            <path
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              fill="#34A853"
            ></path>
            <path
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              fill="#FBBC05"
            ></path>
            <path
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              fill="#EB4335"
            ></path>
          </svg>
          Sign in with Google
        </button>
        <div className="text-center m-3">
          <Link to="/" className="text-red-600">
            <button
              type="button"
              class="w-full flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
            >
              <svg
                class="w-5 h-5 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
              <span>Go back</span>
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}

export default Login;
