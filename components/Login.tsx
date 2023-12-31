'use client'
import Image from 'next/image';
import googleLogo from '../public/google-logo.png';
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";


const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/products";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({ email: "", password: "" });

      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      setLoading(false);
      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError("invalid email or password");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/products' });
  };

  return (
    <div className="bg-gray-900 mx-auto w-96 p-8 rounded-lg flex items-center justify-center">
      <form onSubmit={onSubmit}>
        {error && (
          <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
        )}
        <div className="mb-4">
          <label className="text-gray-400 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name='email'
            placeholder="Ingresa tu email"
            value={formValues.email}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className='text-xs'>
            <a href='/' className='font- text-gray-300 hover:text-blue-200'> ¿Olvidaste la contraseña? </a>
          </div>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name='password'
            placeholder="Ingresa tu password"
            value={formValues.password}
            onChange={(e) => handleChange(e)}
            required
          />

        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit" disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          <p className="text-sm text-white">
            Soy nuevo, {''} <a href="/userForm" className="text-blue-500 hover:text-blue-200">Registrarse</a>
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">O ingresa con:</p>
          <div className="flex justify-center mt-2">
            <button
              className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline mr-2"
              type="button"
              onClick={() => handleLogin('google')}
            >
              <div className="flex items-center">
                <Image src={googleLogo} alt="Google Logo" width={16} height={16} className="mr-2" />
                Google
              </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;