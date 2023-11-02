import React from 'react'
import { Modal } from 'react-bootstrap';
import styles from '../styles/Gallery.module.css';
import ImageGallery from './ImageGallery';
import { Product } from '../models/product';
import { ProductImage } from '../models/productImage';

interface GalleryModalProps {
    onDismiss: () => void,
    onSave: (updatedImage: ProductImage | null) => void,
}

export default function GalleryModal({onDismiss, onSave}: GalleryModalProps) {
    return (
        <Modal show onHide={() => {
            onDismiss();
        }} size='lg' centered={true} className={styles.galleryModal} backdrop='static'>
            <Modal.Header closeButton >
                <Modal.Title>Gallery</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ImageGallery onSave={onSave} onDismiss={onDismiss}/>
            </Modal.Body>
        </Modal>
  )
}
