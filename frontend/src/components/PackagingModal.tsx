import React from 'react'
import styles from '../styles/Modal.module.css'
import PackagingTable from './PackagingTable'

export default function PackagingModal() {
  return (
    <div>
        <p className={styles.smallDescriptionText}>Adjust packaging information</p>
        <PackagingTable/>
    </div>
  )
}
