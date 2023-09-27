import { useState } from 'react';
import styles from '.../styles/ScrollableForm.module.css';

interface ScrollableFormData {
    name: string,
    productSku: string,
    brand: string,
    barcodeUpc: string,
    category: string,
    description: string,
    cogs: string,
    packagingCosts: string,
    weight: string,
    domesticShippingCosts: string,
    internationalShippingCosts: string,
    dutiesAndTariffs: string,
    pickAndPackFee: string,
    amazonReferralFee: string,
    opex: string,
}

const ScrollableForm = () => {
    const [formData, setFormData] = useState<ScrollableFormData>({
        name: '',
        productSku: '',
        brand: '',
        barcodeUpc: '',
        category: '',
        description: '',
        cogs: '',
        packagingCosts: '',
        weight: '',
        domesticShippingCosts: '',
        internationalShippingCosts: '',
        dutiesAndTariffs: '',
        pickAndPackFee: '',
        amazonReferralFee: '',
        opex: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    return (
        <div className={styles.scrollableForm}>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="productSku">Product Sku:</label>
                    <input
                        type="text"
                        id="productSku"
                        name="productSku"
                        value={formData.productSku}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="brand">Brand:</label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="barcodeUpc">UPC Barcode:</label>
                    <input
                        type="text"
                        id="barcodeUpc"
                        name="barcodeUpc"
                        value={formData.productSku}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Add more form fields here */}
            </form>
        </div>
    );
}

export default ScrollableForm;