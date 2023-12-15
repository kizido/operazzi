import React from 'react'
import styles from '../styles/Modal.module.css'
import PackagingTable, { PackagingModel } from './PackagingTable'

interface PackagingModalProps {
  packagingDataSubmit: (input: PackagingModel, index?: number) => void,
  deletePackaging: (index: number) => void,
}
export default function PackagingModal({packagingDataSubmit, deletePackaging}: PackagingModalProps) {
  return (
    <div>
        <p className={styles.smallDescriptionText}>Adjust packaging information</p>
        <PackagingTable packagingDataSubmit={packagingDataSubmit} deletePackaging={deletePackaging}/>
    </div>
  )
}
