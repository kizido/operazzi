import { Button, Dropdown, Form, FormLabel, Modal, Nav, NavItem, Tab } from "react-bootstrap";
import { Product } from "../models/product";
import { useForm } from "react-hook-form";
import { ProductInput } from "../network/products_api";
import * as ProductsApi from "../network/products_api";
import TextInputField from "./form/TextInputField";
import DropdownInputField from "./form/DropdownInputField";
import DimensionsInputField from "./form/DimensionsInputField";
import styles from '../styles/Forms.module.css';

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
            packagingCosts: productToEdit?.packagingCosts || "",
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
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {productToEdit ? "Edit Product" : "Add Product"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Tab.Container>
                    <Nav variant="tabs">
                        <Nav.Item>
                            <Nav.Link eventKey='basicInfo'>Basic Info</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='gallery'>Gallery</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='listingSkus'>Listing Skus</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='vendorProducts'>Vendor Products</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='customs'>Customs</Nav.Link>
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
                                <TextInputField
                                    name="productSku"
                                    label="Product Sku*"
                                    type="text"
                                    placeholder="Product Sku"
                                    register={register}
                                    registerOptions={{ required: "Required" }}
                                />
                                <DropdownInputField
                                    name="brand"
                                    label="Brand*"
                                    type="text"
                                    placeholder="Brand"
                                    register={register}
                                    registerOptions={{ required: "Required", }}
                                    options={[
                                        { value: "TITAN Survival", label: "TITAN Survival" },
                                        { value: "TACAMO", label: "TACAMO" },
                                        { value: "SurvivorCord", label: "SurvivorCord" },
                                        { value: "Choktaw Tinder", label: "Choktaw Tinder" },
                                    ]}
                                />
                                <TextInputField
                                    name="barcodeUpc"
                                    label="UPC Barcode*"
                                    type="text"
                                    placeholder="UPC Barcode"
                                    register={register}
                                    registerOptions={{ required: "Required" }}
                                />
                                <DropdownInputField
                                    name="category"
                                    label="Category"
                                    type="text"
                                    placeholder="Category"
                                    register={register}
                                    options={[
                                        { value: "Clothing", label: "Clothing" },
                                        { value: "Combustion", label: "Combustion" },
                                        { value: "Cordage", label: "Cordage" },
                                        { value: "Cover", label: "Cover" },
                                        { value: "Cutting", label: "Cutting" },
                                    ]}
                                />
                                <TextInputField
                                    name="cogs"
                                    label="COGS*"
                                    type="text"
                                    placeholder="COGS"
                                    register={register}
                                    registerOptions={{ required: "Required" }}
                                />
                                <DimensionsInputField
                                    name="dimensions"
                                    label="Dimensions"
                                    type="text"
                                    placeholder="Dimensions"
                                    register={register}
                                    registerOptions={{ required: "Required" }}
                                />
                                <TextInputField
                                    name="packagingCosts"
                                    label="Packaging Costs*"
                                    type="text"
                                    placeholder="Packaging Costs"
                                    register={register}
                                    registerOptions={{ required: "Required" }}
                                />
                                <TextInputField
                                    name="weight"
                                    label="Weight*"
                                    type="text"
                                    placeholder="Weight"
                                    register={register}
                                    registerOptions={{ required: "Required" }}
                                />
                                <TextInputField
                                    name="domesticShippingCosts"
                                    label="Domestic Shipping Costs"
                                    type="text"
                                    placeholder="Domestic Shipping Costs"
                                    register={register}
                                />
                                <TextInputField
                                    name="internationalShippingCosts"
                                    label="International Shipping Costs"
                                    type="text"
                                    placeholder="International Shipping Costs"
                                    register={register}
                                />
                                <TextInputField
                                    name="dutiesAndTariffs"
                                    label="Duties And Tariffs"
                                    type="text"
                                    placeholder="Duties And Tariffs"
                                    register={register}
                                />
                                <TextInputField
                                    name="pickAndPackFee"
                                    label="Pick And Pack Fee"
                                    type="text"
                                    placeholder="Pick And Pack Fee"
                                    register={register}
                                />
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
                                    rows={3}
                                    placeholder="Description"
                                    register={register}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="gallery"></Tab.Pane>
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