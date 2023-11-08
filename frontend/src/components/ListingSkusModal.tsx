import React from 'react'
import styles from '../styles/Modal.module.css'
import ListingSkusTable from './ListingSkusTable'

export default function ListingSkusModal() {
    return (
        <div>
            <p className={styles.smallDescriptionText}>
                Manage listings associated with this product across all sales channels.
                If a sales channel supports pushing to duplicate listings, you can expand
                that listing's row to see any duplicate sku listings it is connected to.
                If a sales channel supports refreshing the connection for your listing and
                corresponding duplciates, highlight the row and click Refresh Connection.
            </p>
            <ListingSkusTable/>
        </div>
    )
}
