"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const email = session?.user?.email ?? "";
  const [finalUser, setFinalUser] = useState<any | null>(null);

  const searchBuyHistory = useCallback(async (email: string) => {
    try {
      const response = await axios.get("https://copy-pf-la-pilcha-api.vercel.app/users");
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
    return <div>Cargando...</div>;
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
          <button
            onClick={handleChangeAccount}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Cambiar cuenta
          </button>
        </div>
      </div>
      <div className=" m-6 bg-cyan-100 py-6 px-14 border-black rounded-10 flex-1">
        {finalUser?.buyhistory && (
          <div className="text-left bg-cyan-100">
            <h3 className="text-xl">Historial de Compra:</h3>
            <ol className="list-disc">
              {finalUser.buyhistory.map((item) => (
                <li key={item.idPay}>
                  Producto: {item.description || "Desconocido"}
                  <br />
                  Monto: $ {item.amount}
                  <br />
                  Fecha: {item.date.slice(0, 10)}
                  <br />
                  Forma de Pago:{" "}
                  {item.paymentType === "account_money" &&
                    "Dinero en la cuenta"}
                  <hr />
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
