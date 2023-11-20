import { createContext } from "react";
import { Product } from "../models/product";

const ProductContext = createContext<Product | null>(null);

export default ProductContext;
// export const ProductProvider: React.FC<{product: Product}> = ({ children, product}) => {

//     return (
//       <ProductContext.Provider value={product}>
//           {children}
//       </ProductContext.Provider>
//     )
//   }