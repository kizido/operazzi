import React, { createContext, useState } from 'react';
import { Product } from '../models/product';

type ProductContextType = {
  product: Product | null;
  setProduct: (product: Product | null) => void;
};

export const ProductContext = createContext<ProductContextType | null>(null);

type ProductContextProviderProps = {
  children: React.ReactNode;
  product: Product | null; // Add this to accept a product prop
};

export const ProductContextProvider: React.FC<ProductContextProviderProps> = ({ children, product: initialProduct }) => {
  const [product, setProduct] = useState<Product | null>(initialProduct);

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
