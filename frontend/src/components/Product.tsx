import styles from "../styles/Product.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Product as ProductModel } from "../models/product";
import {MdDelete} from "react-icons/md";


interface ProductProps {
    product: ProductModel,
    onProductClicked: (product: ProductModel) => void,
    onDeleteProductClicked: (product: ProductModel) => void,
    className?: string,
}

const Product = ({ product, onProductClicked, onDeleteProductClicked, className }: ProductProps) => {
    const {
        name,
        productSku,
        brand,
        barcodeUpc,
        category,
        description,
        cogs,
        dimensions,
        packagingCosts,
        weight,
        domesticShippingCosts,
        internationalShippingCosts,
        dutiesAndTariffs,
        pickAndPackFee,
        amazonReferralFee,
        opex,
        activated,
        createdAt,
        updatedAt
    } = product;

    return (
        <Card className={`${styles.productCard} ${className}`}
        onClick={() => onProductClicked(product)}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {name}
                    <MdDelete
                    className="text-muted ms-auto"
                    onClick={(e) => {
                        onDeleteProductClicked(product);
                        e.stopPropagation();
                    }}
                    />
                </Card.Title>
                {/* <Card.Text className={styles.cardText}>
                    {text}
                </Card.Text> */}
            </Card.Body>
        </Card>
    )
}

export default Product;