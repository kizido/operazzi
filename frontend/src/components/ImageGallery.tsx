import React, { useEffect } from 'react'
import styles from '../styles/Gallery.module.css'
import GalleryInput from './GalleryInput'
import * as ProductsApi from '../network/products_api'
import { useState } from 'react'
import { ProductImage } from '../models/productImage'

export default function ImageGallery() {

    const [galleryImages, setGalleryImages] = useState<ProductImage[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    const filteredImages = galleryImages.filter(galleryImg => galleryImg.fileName.includes(searchQuery))

    useEffect(() => {
        async function loadImages() {
            try {
                const images = await ProductsApi.fetchProductImages();
                setGalleryImages(images);
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
                    {filteredImages.map((galleryImg, index) => (
                        <div className={styles.galleryPreviewItem}>
                            <img
                                key={index}
                                src={`data:${galleryImg.contentType};base64,${galleryImg.imageFileBase64}`}
                                alt={`data:${galleryImg.contentType};base64,${galleryImg.imageFileBase64}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <button className={styles.galleryConfirmButton}>Apply</button>
        </div>
    )
}
