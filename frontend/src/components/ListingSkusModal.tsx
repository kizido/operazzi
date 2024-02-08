import React from 'react'
import styles from '../styles/Modal.module.css'
import ListingSkusTable from './ListingSkusTable'
import { ListingSkusInput } from '../network/products_api'

interface ListingSkusModalProps {
    onListingSkusDataSubmit: (input: ListingSkusInput, index?: number) => void,
    onListingSkuDelete: (index: number) => void,
}

export default function ListingSkusModal({onListingSkusDataSubmit, onListingSkuDelete}: ListingSkusModalProps) {
    return (
        <div>
            <p className={styles.smallDescriptionText}>
                Manage listings associated with this product across all sales channels.
            </p>
            <ListingSkusTable onListingSkusDataSubmit={onListingSkusDataSubmit} onListingSkuDelete={onListingSkuDelete}/>
        </div>
    )
}
