import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { default as axios } from 'axios';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" }
      },
      authorize: async (credentials: Record<"email" | "password", string> | undefined) => {
        if (credentials) {
          const { email, password } = credentials;

          //verificar las credenciales en la bdd
          const user = await verifyCredentials(email, password)
          if (user) {
            return Promise.resolve(user)
          } else {
            return Promise.resolve(null)
          }
        } else {
          return Promise.resolve(null)
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user?.email || (profile?.email && profile.email);
      if (!email) {
        return false;
      }
      const existingUser = await verifyUserByEmail(email);
      if (!existingUser && account) {
        if (account.provider === 'github' || account.provider === 'google') {
          await createUserIfNotExists(profile);
        } else {
          await createUser(user);
        }
      }
      return true;
    }
  }
};

//funcion para verificar las credenciales en la bdd
const verifyCredentials = async (email: string, password: string) => {
  try {
    //consultar la bdd para buscar el user por nombre de user
    const response = await axios.get("https://copy-pf-la-pilcha-api.vercel.app/api/v1/users");
    const users = response.data;
    const user = users.find(
      (user: any) => user.email === email && user.password === password
    );
    if (user) {
      return user;
    } else {
      return null
    }
  } catch (error) {
    console.error("Error al verificar las credenciales: ", error)
    return null;
  }
}

const verifyUserByEmail = async (email: string) => {
  try {
    const response = await axios.get("https://copy-pf-la-pilcha-api.vercel.app/api/v1/users");
    const users = response.data;

    if (!Array.isArray(users) || users.length === 0) {
      console.log("No hay usuarios registrados en la base de datos.");
      return null;
    }
    const emailLowercase = email.toLowerCase();
    const user = users.find((user: any) => user.email.toLowerCase() === emailLowercase);
    if (!user) {
      console.log("No se encontró ningún usuario con el correo electrónico proporcionado.");
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error al verificar el usuario por email: ", error);
    return null;
  }
};

const createUser = async (user) => {
  try {
    const newUser = {
      name: user.name,
      email: user.email,
      image: user.image || null,
      buyHistory: [],
      isAdmin: false,
      isBanned: false,
    };
    const response = await axios.post("https://copy-pf-la-pilcha-api.vercel.app/api/v1/user", newUser);
    const createdUser = response.data;
    return createdUser;
  } catch (error) {
    console.error("error al crearlo: ", error);
    throw error;
  };
}

//crear un nuevo usuario en la db si el user autenticado con google o github no existe
const createUserIfNotExists = async (profile) => {
  if (!profile || !profile.email) {
    console.error("no se pudo obtener el email del perfil");
    return;
  }
  const email = profile.email.toLowerCase();
  const existingUser = await verifyUserByEmail(email);
  if (!existingUser) {
    console.log("creando new user");
    try {
      const newUser = await createUser({
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.picture || null,
        buyHistory: [],
        isAdmin: false,
        isBanned: false,
      });

    } catch (error) {
      console.error("error al crearlo:", error);
    }
  }
};
