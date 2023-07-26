"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import OrderDetails from "./OrderDetail";
import Link from 'next/link';

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const email = session?.user?.email ?? "";
  const [finalUser, setFinalUser] = useState<any | null>(null);

  const searchBuyHistory = useCallback(async (email: string) => {
    try {
      const response = await axios.get("https://copy-pf-la-pilcha-api.vercel.app/api/v1/users");
      const users = response.data;
      const user = users.find((user: any) => user.email === email);

      if (user) {
        setFinalUser(user);
      } else {
        setFinalUser(null);
      }
    } catch (error) {
      console.error("Error: ", error);
      setFinalUser(null);
    }
  }, []);

  useEffect(() => {
    searchBuyHistory(email);
  }, [searchBuyHistory, email]);

  // Redirigir a la página de inicio de sesión si el usuario no está autenticado
  if (status === "loading") {
    return  <div role="status" className="flex flex-col text-center justify-center">
    <svg aria-hidden="true" className="w-[100px] h-[100px] mx-auto text-center text-gray-900 animate-spin dark:text-gray-200 fill-gray-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    </svg>
    <h3 className="text-gray-900 font-bold text-5xl my-5">Cargando...</h3>
  </div>;
  }
  if (!session) {
    router.push("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleChangeAccount = () => {
    // Lógica para cambiar de cuenta
  };

  return (
    <div className="text-center">
      <div className="flex-1">
        {
          <img
            src={session.user?.image || undefined}
            alt="Foto de perfil"
            className="rounded-full mx-auto mb-4"
            width={150}
            height={150}
          />
        }
        <h2 className="text-2xl font-bold mb-2">{session.user?.name}</h2>
        <p className="text-gray-500">{session.user?.email}</p>
        <div className="mt-6">
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Desloguearse
          </button>
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Cambiar cuenta
          </Link>
        </div>
      </div>
      <div className=" m-6 bg-cyan-500 py-6 px-14 border-black rounded-10 flex-1">
        {finalUser?.buyhistory && (
          <div className="text-left bg-cyan-500">
            <h3 className="text-xl">Historial de Compra:</h3>
            <ol className="list-disc">
              {finalUser.buyhistory.map((orderId: string) => (
                <OrderDetails key={orderId} orderId={orderId} />
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
