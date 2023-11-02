import React, { useEffect } from 'react'
import styles from '../styles/Gallery.module.css'
import GalleryInput from './GalleryInput'
import * as ProductsApi from '../network/products_api'
import { useState } from 'react'
import { ProductImage } from '../models/productImage'
import { Spinner } from 'react-bootstrap'

interface ImageGalleryProps {
    onSave: (updatedImage: ProductImage | null) => void,
    onDismiss: () => void,
}

export default function ImageGallery({onSave, onDismiss}: ImageGalleryProps) {

    const [galleryImages, setGalleryImages] = useState<ProductImage[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

    const sortedImages = [...galleryImages].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0); // defaulting to a very old date if undefined
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        
        return dateB.getTime() - dateA.getTime();
      });
    const filteredImages = sortedImages.filter(sortedImg => sortedImg.fileName.includes(searchQuery))

    useEffect(() => {
        async function loadImages() {
            try {
                const images = await ProductsApi.fetchProductImages();
                setGalleryImages(images);
                setImagesLoaded(true);
            } catch (error) {
                console.log(error)
            }
        }
        loadImages();
    }, [])
    const handleFileSelect = async (file: File) => {
        const validFileTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
        if (validFileTypes.includes(file.type)) {
            const formData = new FormData();
            formData.append('imageFile', file);

            try {
                let newImage: ProductImage;
                newImage = await ProductsApi.createProductImage(formData);
                setGalleryImages([...galleryImages, newImage])
            } catch (error) {
                console.log(error);
            }
        }
    };
    
    return (
        <div className={styles.galleryTab}>
            <GalleryInput onFileSelect={handleFileSelect} />
            <div className={styles.gallerySelectionWindow}>
                <input className={styles.gallerySelectionSearchBar} placeholder='Search filename...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}></input>
                <div className={styles.galleryPreviewWindow}>
                    {imagesLoaded ? (
                        filteredImages.map((galleryImg, index) => (
                            <div
                            className={`${styles.galleryPreviewItem} ${selectedImageIndex === index ? styles.galleryPreviewItemSelected : styles.galleryPreviewItemUnselected}`}
                            onClick={() => {setSelectedImageIndex(index); setSelectedImage(filteredImages[index])}}>
                                <img
                                    key={index}
                                    src={`data:${galleryImg.contentType};base64,${galleryImg.imageFileBase64}`}
                                    alt={`data:${galleryImg.contentType};base64,${galleryImg.imageFileBase64}`}
                                />
                            </div>
                        ))
                    ) : (
                        <Spinner className={styles.gallerySpinner}/>
                    )}
                </div>
            </div>
            <button onClick={() => {onSave(selectedImage); onDismiss()}} className={styles.galleryConfirmButton}>Apply</button>
        </div>
    )
}
