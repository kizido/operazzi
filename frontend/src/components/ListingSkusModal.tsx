import React from 'react'
import styles from '../styles/Modal.module.css'
import ListingSkusTable from './ListingSkusTable'
import { ListingSkusInput } from '../network/products_api'

interface ListingSkusModalProps {
    onListingSkusDataSubmit: (input: ListingSkusInput) => void,
}

export default function ListingSkusModal({onListingSkusDataSubmit}: ListingSkusModalProps) {
    return (
        <div>
            <p className={styles.smallDescriptionText}>
                Manage listings associated with this product across all sales channels.
                If a sales channel supports pushing to duplicate listings, you can expand
                that listing's row to see any duplicate sku listings it is connected to.
                If a sales channel supports refreshing the connection for your listing and
                corresponding duplciates, highlight the row and click Refresh Connection.
            </p>
            <ListingSkusTable onListingSkusDataSubmit={onListingSkusDataSubmit}/>
        </div>
    )
}
