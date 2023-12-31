"use client"
import React from 'react';
import { useGetProductsByIdQuery } from '../../../GlobalRedux/api/productsApi';
import { Product } from "../../../GlobalRedux/api/productsApi";
import Detail from '../../../components/Detail';
import { useParams } from 'next/navigation';



const ProductDetailPage = () => {
  const params = useParams();
  const id = params.id


  const { data, error, isLoading, isFetching } = useGetProductsByIdQuery(id);

  if (isLoading || isFetching) return <p>Cargando...</p>;


  const product = data?.product;

  return (
    <>
      {product &&
        <Detail
          _id={product._id}
          title={product.title}
          price={product.price}
          image={product.image}
          description={product.description}
          rating={product.rating}
          category={product.category}
          isDeactivated={product.isDeactivated}
        />}
      {!product && <h1>no se encontro el producto</h1>}
    </>
  );
};

export default ProductDetailPage;

