'use client'
import React, { useRef } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Product, usePostProductsMutation } from '../GlobalRedux/api/productsApi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../GlobalRedux/store';
import { setProducts } from '../GlobalRedux/features/productsSlice';
import toast from 'react-hot-toast';

interface ProductForm {
  _id: string;
  title: string;
  price: string;
  description: string;
  category: string;
  image: File | null;
  rating: any;
}

const ProductForm: React.FC = () => {
  const dispatch = useDispatch();
  const [postProduct, { isLoading, isError }] = usePostProductsMutation();

  const toaster = useRef(null);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Product name is required'),
    price: Yup.string().required('Product price is required'),
    description: Yup.string().required('Product description is required'),
    category: Yup.string().required('The product category is required'),
    image: Yup.mixed()
      .required('Product image is required')
      .test('fileType', 'The file must be an image', function (value: any) {
        if (!value) return true;
        const fileType = value && value.type;
        const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (fileType) {
          return validFileTypes.includes(fileType);
        }
        return false;
      }),
  });

  const handleSubmit = async (values: ProductForm, { resetForm }: FormikHelpers<ProductForm>) => {

    const { _id, title, price, description, category, image } = values;

    if (image instanceof File) {
      try {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'Pilcha');

        const response = await fetch(`https://api.cloudinary.com/v1_1/djwbjv70t/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.secure_url;

          createProduct(_id, title, price, description, category, imageUrl);
        } else {
          throw new Error('Image upload failed');
        }
      } catch (error) {
        console.error('Error uploading image:', error);

        // Mostrar mensaje de error utilizando el componente Toast
        toast.error('Error al cargar la imagen. Por favor, inténtalo de nuevo.');
      }
    } else {
      createProduct(_id, title, price, description, category, null);
    }

    // Restablecer los valores del formulario
    resetForm();
  };

  const createProduct = async (
    _id: string,
    title: string,
    price: string,
    description: string,
    category: string,
    image: string | null
  ) => {
    const newProduct: Product = {
      _id,
      title,
      price,
      description,
      category,
      image: image || '', // Si image es null, asignar una cadena vacía
      rating: null,
      isDeactivated: false,
    };

    postProduct(newProduct)
      .unwrap()
      .then((response) => {
        dispatch(setProducts([response]));

        // Mostrar mensaje de éxito utilizando el componente Toast
        toast.success('¡Producto cargado correctamente!');
      })
      .catch((error) => {
        console.error('Error creating product:', error);

        // Mostrar mensaje de error utilizando el componente Toast
        toast.error('Error al cargar el producto. Por favor, inténtalo de nuevo.');
      });
  };

  return (
    <Formik
      initialValues={{
        _id: '',
        title: '',
        price: '',
        description: '',
        category: '',
        image: null,
        rating: null,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <div className="flex justify-center items-center isolate px-6 py-24 sm:py-32 lg:px-8">
          <div className="flex justify-center">
            <div className="max-w-lg">
              <div className="p-6">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-5xl pb-10">
                    Cargar Producto
                  </h2>
                </div>

                <Form className='max-w-xl mx-auto' encType='multipart/form-data'>
                  <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2'>
                    <div>
                      <label className='block text-sm font-semibold leading-6' htmlFor='title'>
                        Nombre del Producto:
                      </label>
                      <div className='mt-2.5'>
                        <Field
                          className='block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder: focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                          type='text'
                          id='title'
                          name='title'
                        />
                        <ErrorMessage name='title' component='div' className='text-red-600' />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold leading-6' htmlFor='price'>
                        Precio:
                      </label>
                      <div className='mt-2.5'>
                        <Field
                          type='number'
                          id='price'
                          name='price'
                          placeholder='$'
                          className='block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder: focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                        />
                      </div>
                      <ErrorMessage name='price' component='div' className='text-red-600' />
                    </div>

                    <div className='sm:col-span-2'>
                      <label className='block text-sm font-semibold leading-6' htmlFor='description'>
                        Descripción:{' '}
                      </label>
                      <div className='mt-2.5'>
                        <Field
                          type='text'
                          id='description'
                          name='description'
                          className='block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder: focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                        />
                      </div>
                      <ErrorMessage name='description' component='div' className='text-red-600' />
                    </div>

                    <div className='sm-col-span-2'>
                      <label className='block text-sm font-semibold leading-6' htmlFor='category'>
                        Categoría:{' '}
                      </label>
                      <div className='mt-2.5'>
                        <Field
                          as='select'
                          id='category'
                          name='category'
                          className='block w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder: focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                        >
                          <option value=''></option>
                          <option value="women's clothing">women's clothing</option>
                          <option value="men's clothing">men's clothing</option>
                        </Field>
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label htmlFor='image' className='block text-sm font-semibold leading-6'>
                        Imagen del producto:
                      </label>
                      <div>
                        <input
                          type='file'
                          id='image'
                          name='image'
                          accept='image/*'
                          onChange={(e) => setFieldValue('image', e.currentTarget.files?.[0])}
                          className='block w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                      <ErrorMessage name='image' component='div' className='text-red-600' />
                    </div>
                  </div>

                  <div className='mt-10'>
                    <button
                      type='submit'
                      className='block w-full rounded-md bg-blue-800 px-3.5 py-2.5 text-center tetx-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    >
                      ¡Publicar Producto!
                    </button>
                  </div>
                </Form>

              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default ProductForm;
