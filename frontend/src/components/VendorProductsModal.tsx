import React from "react";
import VendorProductsTable, {
  VendorProductsModel,
} from "./VendorProductsTable";
import styles from "../styles/Modal.module.css";
import { Product } from "../models/product";

interface VendorProductsModalProps {
  vendorProductsDataSubmit: (
    input: VendorProductsModel,
    index?: number
  ) => void;
  deleteVendorProduct: (index: number) => void;
  defaultCogsRowIdSubmit: (defaultRowId: string | null) => void;
  productToEdit?: Product;
}
export default function VendorProductsModal({
  vendorProductsDataSubmit,
  deleteVendorProduct,
  defaultCogsRowIdSubmit,
  productToEdit,
}: VendorProductsModalProps) {
  return (
    <div>
      <p className={styles.smallDescriptionText}>
        Add vendor SKUs associated with this product.
      </p>
      <VendorProductsTable
        vendorProductsDataSubmit={vendorProductsDataSubmit}
        deleteVendorProduct={deleteVendorProduct}
        defaultCogsRowIdSubmit={defaultCogsRowIdSubmit}
        productToEdit={productToEdit}
      />
    </div>
  );
}
