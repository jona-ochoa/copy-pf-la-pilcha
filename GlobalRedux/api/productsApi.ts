import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Product = {
  _id: string;
  title: string;
  price: string;
  description: string;
  image: string;
  category: string;
  rating: any;
  isDeactivated: boolean;
  count: number;
};

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://copy-pf-la-pilcha-api.vercel.app/api/v1",
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], null>({
      query: () => "/products",
    }),
    getProductsById: builder.query<Product, { id: string }>({
      query: (id) => `/products/${id}`,
    }),
    getProductsByTitle: builder.query<Product[], { title: string }>({
      query: ({ title }: { title: string }) => `/products/search?keyword=${title}`,
      transformResponse: (response: any) => response.products,
    }),
    postProducts: builder.mutation<Product, Partial<Product>>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByIdQuery,
  useGetProductsByTitleQuery,
  usePostProductsMutation,
} = productsApi;
