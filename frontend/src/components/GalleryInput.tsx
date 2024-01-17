import { FC, ChangeEvent, useState } from 'react';
import styles from '../styles/Gallery.module.css';
import { Button } from 'react-bootstrap';

interface GalleryInputProps {
    onFileSelect: (selectedFile: File) => void;
}

const GalleryInput: FC<GalleryInputProps> = ({ onFileSelect }) => {
    const [validFileUploaded, setValidFileUploaded] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const validFileTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']; // Include SVG type

            if (validFileTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Cast reader.result as string, since we expect it to be a string for image files.
                    const dataUrl = reader.result as string;

                    // Ensure reader.result is a string as expected for Data URLs
                    if (typeof dataUrl === 'string') {
                        const img = new Image();
                        img.onload = () => {
                            console.log('Width:', img.naturalWidth, 'Height:', img.naturalHeight);

                            if (img.naturalWidth <= 600 && img.naturalHeight <= 600) {
                                // Call the onFileSelect function with the selected file
                                setValidFileUploaded(true);
                                setSelectedFile(file);
                            } else {
                                setValidFileUploaded(false);
                                console.error('Image is too large');
                                // alert("Image must be maximum: 600x600px. Your image is: "
                                //     + img.naturalWidth + "x" + img.naturalHeight + "px.")
                            }
                        };
                        img.onerror = () => {
                            console.error('There was an error loading the image.');
                        };

                        img.src = dataUrl; // Use dataUrl here
                    } else {
                        console.error('Unexpected result type. String expected.');
                        setValidFileUploaded(false);
                    }
                };
                reader.onerror = () => {
                    console.error('There was an error reading the file.');
                    setValidFileUploaded(false);
                };

                reader.readAsDataURL(file);
            } else {
                console.error('Selected file is not a supported file type.');
                setValidFileUploaded(false);
            }
        } else {
            setValidFileUploaded(false);
        }
    };


    return (
        <div className={styles.galleryInputContainer}>
            <input className={styles.galleryInput} type='file' accept='.jpg,.jpeg,.png,.svg,.webp' onChange={handleFileChange} name='imageFile' />
            {validFileUploaded && selectedFile && (
                <Button onClick={() => {
                    if (selectedFile) {
                        onFileSelect(selectedFile);
                    }
                    setSelectedFile(null);
                    setValidFileUploaded(false);
                }} className={`${styles.galleryInputAddButton} ${'btn-success'}`}>Add Image</Button>
            )}
        </div>
    );
}

export default GalleryInput;