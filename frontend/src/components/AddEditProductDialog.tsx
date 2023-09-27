import { Button, Form, FormLabel, Modal } from "react-bootstrap";
import { Product } from "../models/product";
import { useForm } from "react-hook-form";
import { ProductInput } from "../network/products_api";
import * as ProductsApi from "../network/products_api";
import TextInputField from "./form/TextInputField";

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
            brand: productToEdit?.productSku || "",
            barcodeUpc: productToEdit?.barcodeUpc || "",
            category: productToEdit?.category || "",
            description: productToEdit?.description || "",
            cogs: productToEdit?.cogs || "",
            packagingCosts: productToEdit?.packagingCosts || "",
            weight: productToEdit?.weight || "",
            domesticShippingCosts: productToEdit?.domesticShippingCosts || "",
            internationalShippingCosts: productToEdit?.internationalShippingCosts || "",
            dutiesAndTariffs: productToEdit?.dutiesAndTariffs || "",
            pickAndPackFee: productToEdit?.pickAndPackFee || "",
            amazonReferralFee: productToEdit?.amazonReferralFee || "",
            opex: productToEdit?.opex || "",
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
                <Form id="addEditProductForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="title"
                        label="Title"
                        type="text"
                        placeholder="Title"
                        register={register}
                        registerOptions={{ required: "Required" }}
                    />

                    <TextInputField
                    name="text"
                    label="Text"
                    as="textarea"
                    rows={5}
                    placeholder="Text"
                    register={register}
                    />
                    
                </Form>
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