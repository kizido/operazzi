import { Button, Col, Dropdown, Form, FormLabel, InputGroup, Modal, Nav, NavItem, Row, Spinner, Tab } from "react-bootstrap";
import { Product } from "../models/product";
import { useForm } from "react-hook-form";
import { ProductInput, ProductImageInput } from "../network/products_api";
import * as ProductsApi from "../network/products_api";
import TextInputField from "./form/TextInputField";
import DropdownInputField from "./form/DropdownInputField";
import DimensionsInputField from "./form/DimensionsInputField";
import styles from '../styles/Modal.module.css';
import { useEffect, useState } from "react";
import CategoryInputField from "./form/CategoryInputField";
import BrandInputField from "./form/BrandInputField";
import PackageTypeInputField from "./form/PackageTypeInputField";
import GalleryInput from "./GalleryInput";
import ImageGallery from "./ImageGallery";
import addImageIcon from '../assets/addImageIcon.png'
import GalleryModal from "./GalleryModal";
import { ProductImage } from "../models/productImage";
import MasterCaseDimensionsInputField from "./form/MasterCaseDimensionsInputField";
import ListingSkusModal from "./ListingSkusModal";
import VendorProductsModal from "./VendorProductsModal";
import Customs from "./Customs";
import { CustomsInput } from "../network/products_api";
import Pricing from "./Pricing";

interface AddEditProductDialogProps {
    productToEdit?: Product,
    onDismiss: () => void,
    onProductSaved: (product: Product) => void,
}

const AddEditProductDialog = ({ productToEdit, onDismiss, onProductSaved }: AddEditProductDialogProps) => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductInput>({
        defaultValues: {
            name: productToEdit?.name || "",
            productSku: productToEdit?.productSku || "",
            brand: productToEdit?.brand || "",
            barcodeUpc: productToEdit?.barcodeUpc || "",
            category: productToEdit?.category || "",
            description: productToEdit?.description || "",
            cogs: productToEdit?.cogs || "",
            dimensions: {
                productLength: productToEdit?.dimensions?.productLength || 0,
                productWidth: productToEdit?.dimensions?.productWidth || 0,
                productHeight: productToEdit?.dimensions?.productHeight || 0,
                productDiameter: productToEdit?.dimensions?.productDiameter || 0,
            },
            masterCaseDimensions: {
                masterCaseLength: productToEdit?.masterCaseDimensions?.masterCaseLength || 0,
                masterCaseWidth: productToEdit?.masterCaseDimensions?.masterCaseWidth || 0,
                masterCaseHeight: productToEdit?.masterCaseDimensions?.masterCaseHeight || 0,
                masterCaseQuantity: productToEdit?.masterCaseDimensions?.masterCaseQuantity || 0,
            },
            masterCaseWeight: productToEdit?.masterCaseWeight || 0,
            packageTypeId: productToEdit?.packageTypeId || null,
            weight: productToEdit?.weight || "",
            domesticShippingCosts: productToEdit?.domesticShippingCosts || "",
            internationalShippingCosts: productToEdit?.internationalShippingCosts || "",
            dutiesAndTariffs: productToEdit?.dutiesAndTariffs || "",
            pickAndPackFee: productToEdit?.pickAndPackFee || "",
            amazonReferralFee: productToEdit?.amazonReferralFee || "",
            opex: productToEdit?.opex || "",
            productImageId: productToEdit?.productImageId || null,
            activated: productToEdit?.activated || true,
        }
    });

    useEffect(() => {
        const loadImage = async () => {
            if (productToEdit && productToEdit.productImageId) {
                try {
                    const imageToLoad = await ProductsApi.fetchProductImage(productToEdit.productImageId);
                    setSelectedImage(imageToLoad);
                    setImageLoading(false);
                } catch (error) {
                    console.log(error);
                }
            }
            else {
                setImageLoading(false);
            }
        };
        loadImage();
    }, [])

    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
    const [imageLoading, setImageLoading] = useState(true);

    const [customsData, setCustomsData] =  useState<CustomsInput | null>(null);

    async function onSubmit(input: ProductInput) {

        selectedImage && (input.productImageId = selectedImage?._id);
        if(input.packageTypeId === "") input.packageTypeId = null;

        if(customsData) input.productCustomsInfo = customsData;

        try {
            let productResponse: Product;
            if (productToEdit) {
                productResponse = await ProductsApi.updateProduct(productToEdit._id, input);
            } else {
                console.log(input.packageTypeId)
                productResponse = await ProductsApi.createProduct(input);
            }
            onProductSaved(productResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const handleCustomsData = (input: CustomsInput) => {
        setCustomsData({
            customsDeclaration: input.customsDeclaration,
            itemDescription: input.itemDescription,
            harmonizationCode: input.harmonizationCode,
            countryOrigin: input.countryOrigin,
            declaredValue: input.declaredValue
        })
    }

    function saveImageToProduct(updatedImage: ProductImage | null) {
        setSelectedImage(updatedImage);
    }

    return (
        <Modal
            show onHide={onDismiss}
            backdrop="static"
            centered={true}
            dialogClassName={`${styles.productModalWidth}`}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {productToEdit ? productToEdit.name : "Add Product"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className={styles.productModalBody}>

                <Tab.Container defaultActiveKey="basicInfo">
                    <Nav variant="tabs" className={styles.productModalTabs}>
                        <Nav.Item>
                            <Nav.Link className={styles.productModalTabLink}
                                eventKey='basicInfo'>BASIC INFO</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className={styles.productModalTabLink}
                                eventKey='listingSkus'>LISTING SKUS</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className={styles.productModalTabLink}
                                eventKey='vendorProducts'>VENDOR PRODUCTS</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className={styles.productModalTabLink}
                                eventKey='customs'>CUSTOMS</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className={styles.productModalTabLink}
                                eventKey='pricing'>PRICING</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="basicInfo">
                            <Form id="addEditProductForm" onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col xs={9}>
                                        <TextInputField
                                            name="name"
                                            label="Product Name*"
                                            type="text"
                                            placeholder="Product Name"
                                            register={register}
                                            registerOptions={{ required: "Required" }}
                                        />
                                        <BrandInputField
                                            name="brand"
                                            label="Brand*"
                                            type="text"
                                            placeholder="Brand"
                                            register={register}
                                            registerOptions={{ required: "Required", }}
                                        />
                                        <CategoryInputField
                                            name="category"
                                            label="Category"
                                            type="text"
                                            placeholder="Category"
                                            register={register}
                                        />
                                    </Col>
                                    <Col>
                                        <button type="button" className={styles.productPreviewContainer} onClick={() => setShowGalleryModal(true)}>
                                            {imageLoading ? (
                                                <Spinner />
                                            ) : (
                                                <img src={selectedImage ? `data:${selectedImage.contentType};base64,${selectedImage.imageFileBase64}` : addImageIcon} alt={selectedImage?._id} className={styles.productPreviewImage} />
                                            )
                                            }
                                        </button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInputField
                                            name="productSku"
                                            label="Product Sku*"
                                            type="text"
                                            placeholder="Product Sku"
                                            register={register}
                                            registerOptions={{ required: "Required" }}
                                        />
                                    </Col>
                                    <Col>
                                        <TextInputField
                                            name="barcodeUpc"
                                            label="UPC Barcode*"
                                            type="text"
                                            placeholder="UPC Barcode"
                                            register={register}
                                            registerOptions={{ required: "Required" }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <DimensionsInputField
                                            name="dimensions"
                                            label="Dimensions*"
                                            register={register}
                                            registerOptions={{ required: "Required" }}
                                        />
                                    </Col>
                                    <Col>
                                        <TextInputField
                                            name="weight"
                                            label="Weight (grams)*"
                                            type="text"
                                            placeholder="Weight"
                                            register={register}
                                            registerOptions={{ required: "Required" }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInputField
                                            name="cogs"
                                            label="Cost of Goods Sold*"
                                            type="text"
                                            placeholder="COGS"
                                            register={register}
                                            registerOptions={{ required: "Required" }}
                                        />
                                    </Col>
                                    <Col>
                                        <PackageTypeInputField
                                            name="packageTypeId"
                                            label="Shipping Package"
                                            type="select"
                                            register={register}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInputField
                                            name="domesticShippingCosts"
                                            label="Domestic Shipping Costs"
                                            type="text"
                                            placeholder="Domestic Shipping Costs"
                                            register={register}
                                        />
                                    </Col>
                                    <Col>
                                        <TextInputField
                                            name="internationalShippingCosts"
                                            label="International Shipping Costs"
                                            type="text"
                                            placeholder="International Shipping Costs"
                                            register={register}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInputField
                                            name="dutiesAndTariffs"
                                            label="Duties And Tariffs"
                                            type="text"
                                            placeholder="Duties And Tariffs"
                                            register={register}
                                        />
                                    </Col>
                                    <Col>
                                        <TextInputField
                                            name="pickAndPackFee"
                                            label="Pick And Pack Fee"
                                            type="text"
                                            placeholder="Pick And Pack Fee"
                                            register={register}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInputField
                                            name="amazonReferralFee"
                                            label="Amazon Referral Fee"
                                            type="text"
                                            placeholder="Amazon Referral Fee"
                                            register={register}
                                        />
                                    </Col>
                                    <Col>
                                        <TextInputField
                                            name="description"
                                            label="Description"
                                            type="text"
                                            placeholder="Description"
                                            register={register}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <MasterCaseDimensionsInputField
                                            name="masterCaseDimensions"
                                            label="Master Case Dimensions"
                                            register={register}
                                        />
                                    </Col>
                                    <Col>
                                        <TextInputField
                                            name="masterCaseWeight"
                                            label="Master Case Weight (lbs.)"
                                            type="number"
                                            placeholder="Master Case Weight"
                                            register={register}
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey="listingSkus">
                            <ListingSkusModal />
                        </Tab.Pane>
                        <Tab.Pane eventKey="vendorProducts">
                            <VendorProductsModal />
                        </Tab.Pane>
                        <Tab.Pane eventKey="customs">
                            <Customs productToEdit={productToEdit} onCustomsDataSubmit={handleCustomsData} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="pricing">
                            <Pricing/>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditProductForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
            {showGalleryModal && <GalleryModal onDismiss={() => setShowGalleryModal(false)} onSave={saveImageToProduct}
            />}
        </Modal>
    );
}

export default AddEditProductDialog;