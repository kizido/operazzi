import React from 'react'
import VendorProductsTable, { VendorProductsModel } from './VendorProductsTable'
import styles from '../styles/Modal.module.css'

interface VendorProductsModalProps {
    vendorProductsDataSubmit: (input: VendorProductsModel, index?: number) => void,
    deleteVendorProduct: (index: number) => void,
    defaultCogsRowIdSubmit: (defaultRowId: string | null) => void,
}
export default function VendorProductsModal({vendorProductsDataSubmit, deleteVendorProduct, defaultCogsRowIdSubmit}: VendorProductsModalProps) {
    return (
        <div><p className={styles.smallDescriptionText}>
            Add vendor SKUs associated with this product.
        </p>
            <VendorProductsTable vendorProductsDataSubmit={vendorProductsDataSubmit} deleteVendorProduct={deleteVendorProduct} defaultCogsRowIdSubmit={defaultCogsRowIdSubmit}/></div>
    )
}
