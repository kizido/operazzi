import { Button, Col, Dropdown, Form, FormLabel, InputGroup, Modal, Nav, NavItem, Row, Tab } from "react-bootstrap";
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
            dimensions: productToEdit?.dimensions || "",
            packageType: productToEdit?.packageType || "",
            weight: productToEdit?.weight || "",
            domesticShippingCosts: productToEdit?.domesticShippingCosts || "",
            internationalShippingCosts: productToEdit?.internationalShippingCosts || "",
            dutiesAndTariffs: productToEdit?.dutiesAndTariffs || "",
            pickAndPackFee: productToEdit?.pickAndPackFee || "",
            amazonReferralFee: productToEdit?.amazonReferralFee || "",
            opex: productToEdit?.opex || "",
            activated: productToEdit?.activated || true,
        }
    });

    async function onSubmit(input: ProductInput) {
        try {
            let productResponse: Product;
            if (productToEdit) {
                productResponse = await ProductsApi.updateProduct(productToEdit._id, input);
            } else {
                productResponse = await ProductsApi.createProduct(input);
            }
            onProductSaved(productResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
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
                                eventKey='gallery'>GALLERY</Nav.Link>
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
                    </Nav>

                    <Form id="addEditProductForm" onSubmit={handleSubmit(onSubmit)}>
                        <Tab.Content>
                            <Tab.Pane eventKey="basicInfo">
                                <TextInputField
                                    name="name"
                                    label="Product Name*"
                                    type="text"
                                    placeholder="Product Name"
                                    register={register}
                                    registerOptions={{ required: "Required" }}
                                />
                                <Row>
                                    <Col>
                                        <BrandInputField
                                            name="brand"
                                            label="Brand*"
                                            type="text"
                                            placeholder="Brand"
                                            register={register}
                                            registerOptions={{ required: "Required", }}
                                        />
                                    </Col>
                                    <Col>
                                        <CategoryInputField
                                            name="category"
                                            label="Category"
                                            type="text"
                                            placeholder="Category"
                                            register={register}
                                        />
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
                                        <TextInputField
                                            name="dimensions"
                                            label="Dimensions"
                                            type="text"
                                            placeholder="Dimensions"
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
                                            name="packageType"
                                            label="Package Type"
                                            type="text"
                                            placeholder="Package Type"
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
                                <TextInputField
                                    name="amazonReferralFee"
                                    label="Amazon Referral Fee"
                                    type="text"
                                    placeholder="Amazon Referral Fee"
                                    register={register}
                                />
                                <TextInputField
                                    name="description"
                                    label="Description"
                                    as="textarea"
                                    rows={2}
                                    placeholder="Description"
                                    register={register}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="gallery">
                                <ImageGallery />
                            </Tab.Pane>
                            <Tab.Pane eventKey="listingSkus"></Tab.Pane>
                            <Tab.Pane eventKey="vendorProducts"></Tab.Pane>
                            <Tab.Pane eventKey="customs"></Tab.Pane>
                        </Tab.Content>
                    </Form>
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
        </Modal>
    );
}

export default AddEditProductDialog;