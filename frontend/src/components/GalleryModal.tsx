import React from 'react'
import { Modal } from 'react-bootstrap';
import styles from '../styles/Gallery.module.css';
import ImageGallery from './ImageGallery';

interface GalleryModalProps {
    onDismiss: () => void;
}

export default function GalleryModal({onDismiss}: GalleryModalProps) {
    return (
        <Modal show onHide={() => {
            onDismiss();
        }} size='lg' centered={true} className={styles.galleryModal} backdrop='static'>
            <Modal.Header closeButton >
                <Modal.Title>Gallery</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ImageGallery/>
            </Modal.Body>
        </Modal>
  )
}
