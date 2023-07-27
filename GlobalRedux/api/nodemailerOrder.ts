import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type MailerOrder = {
  name: string;
  email: string;
  subject: string;
  buyOrder: string;
};

export const nodemailerOrder = createApi({
  reducerPath: "nodemailerOrder",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://copy-pf-la-pilcha-api.vercel.app/api/v1",
  }),
  endpoints: (builder) => ({
    createMailerOrder: builder.mutation<MailerOrder, Partial<MailerOrder>>({
      query: (newMailerOrder) => ({
        url: "/nodemailer/orden-de-compra",
        method: "POST",
        body: newMailerOrder,
      }),
    }),
  }),
});

export const { useCreateMailerOrderMutation } = nodemailerOrder;
