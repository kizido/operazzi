import React from 'react'
import VendorProductsTable from './VendorProductsTable'
import styles from '../styles/Modal.module.css'

export default function VendorProductsModal() {
    return (
        <div><p className={styles.smallDescriptionText}>
            Add vendor SKUs associated with this product.
        </p>
            <VendorProductsTable /></div>
    )
}
