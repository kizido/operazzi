import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from 'react-icons/fa';
import { Product as ProductModel } from '../models/product';
import * as ProductsApi from "../network/products_api";
import styleUtils from '../styles/utils.module.css';
import AddEditProductDialog from "./AddEditProductDialog";
import Product from './Product';
import styles from '../styles/ProductsPage.module.css';
import ProductTable from './ProductTable';


const ProductsPageLoggedInView = () => {

    return (
        <>
        <ProductTable></ProductTable>
        </>
    );
    // const [products, setProducts] = useState<ProductModel[]>([]);
    // const [productsLoading, setProductsLoading] = useState(true);
    // const [showProductsLoadingError, setShowProductsLoadingError] = useState(false);

    // const [showAddProductDialog, setShowAddProductDialog] = useState(false);
    // const [productToEdit, setProductToEdit] = useState<ProductModel | null>(null);


    // useEffect(() => {
    //     async function loadProducts() {
    //         try {
    //             setShowProductsLoadingError(false);
    //             setProductsLoading(true);
    //             const products = await ProductsApi.fetchProducts();
    //             setProducts(products);
    //         } catch (error) {
    //             console.error(error);
    //             setShowProductsLoadingError(true);
    //         }
    //         finally {
    //             setProductsLoading(false);
    //         }
    //     }
    //     loadProducts();
    // }, []);

    // async function deleteProduct(product: ProductModel) {
    //     try {
    //         await ProductsApi.deleteProduct(product._id);
    //         setProducts(products.filter(existingProduct => existingProduct._id !== product._id));
    //     } catch (error) {
    //         console.error(error);
    //         alert(error);
    //     }
    // }

    // const productsGrid =
    //     <Row xs={1} md={2} xl={3} className={`g-4 ${styles.productsGrid}`}>
    //         {products.map(product => (
    //             <Col key={product._id}>
    //                 <Product
    //                     product={product}
    //                     className={styles.product}
    //                     onProductClicked={setProductToEdit}
    //                     onDeleteProductClicked={deleteProduct}
    //                 />
    //             </Col>
    //         ))}
    //     </Row>

    // return (
    //     <>
    //         <Button
    //             className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
    //             onClick={() => setShowAddProductDialog(true)}>
    //             <FaPlus />
    //             Add new product
    //         </Button>
    //         {productsLoading && <Spinner animation='border' variant='primary' />}
    //         {showProductsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
    //         {!productsLoading && !showProductsLoadingError &&
    //             <>
    //                 {products.length > 0
    //                     ? productsGrid
    //                     : <p>You don't have any products yet</p>
    //                 }
    //             </>
    //         }
    //         {
    //             showAddProductDialog &&
    //             <AddEditProductDialog
    //                 onDismiss={() => setShowAddProductDialog(false)}
    //                 onProductSaved={(newProduct) => {
    //                     setProducts([...products, newProduct]);
    //                     setShowAddProductDialog(false);
    //                 }}
    //             />
    //         }
    //         {productToEdit &&
    //             <AddEditProductDialog
    //                 productToEdit={productToEdit}
    //                 onDismiss={() => setProductToEdit(null)}
    //                 onProductSaved={(updatedProduct) => {
    //                     setProducts(products.map(existingProduct => existingProduct._id === updatedProduct._id ? updatedProduct : existingProduct));
    //                     setProductToEdit(null);
    //                 }}
    //             />
    //         }
    //     </>
    // );
}

export default ProductsPageLoggedInView;