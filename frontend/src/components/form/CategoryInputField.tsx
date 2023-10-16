import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from '../../styles/Forms.module.css';
import { useState, useEffect } from "react";
import { ProductCategory as ProductCategoryModel } from "../../models/productCategory";
import { ProductCategoryInput } from "../../network/products_api";
import * as ProductsApi from "../../network/products_api";
import { IconButton } from "@mui/material";
import { IconSettings, IconPencil, IconX } from '@tabler/icons-react';
import modalStyles from '../../styles/Modal.module.css';


interface CategoryInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const CategoryInputField = ({ name, label, register, registerOptions, error, ...props }: CategoryInputFieldProps) => {

    const [categories, setCategories] = useState<ProductCategoryModel[]>([]);

    const [newOption, setNewOption] = useState<ProductCategoryInput>();
    const [addOptionDialog, setAddOptionDialog] = useState(false);
    const [editOptionDialog, setEditOptionDialog] = useState(false);

    useEffect(() => {
        async function loadCategories() {
            try {
                const productCategories = await ProductsApi.fetchProductCategories();
                setCategories(productCategories);
            } catch (error) {
                console.error(error);
            }
        }
        loadCategories();
    }, []);


    async function handleAddCategory(input: ProductCategoryInput) {
        try {
            let productCategoryResponse: ProductCategoryModel;

            productCategoryResponse = await ProductsApi.createProductCategory(input);
            setCategories([...categories, productCategoryResponse]);
            setAddOptionDialog(false);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <div>
            <Form.Group controlId={name + "-input"}>
                <Form.Label className={styles.formLabel}>{label}</Form.Label>
                <InputGroup>
                    <Form.Select size="sm"
                        {...props}
                        {...register(name, registerOptions)}
                        isInvalid={!!error}
                    >
                        {categories?.map((category, index) => (
                            <option key={index}>
                                {category.category}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {error?.message}
                    </Form.Control.Feedback>
                    <Button onClick={() => setAddOptionDialog(true)}>+</Button>
                    <IconButton onClick={() => setEditOptionDialog(true)}><IconSettings /></IconButton>
                </InputGroup>
            </Form.Group>

            {addOptionDialog &&
                <Modal show onHide={() => {
                    setNewOption({
                        category: '',
                    }); setAddOptionDialog(false)
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add {label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Control
                                value={newOption?.category}
                                onChange={(e) => setNewOption({
                                    category: e.target.value,
                                })}
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setNewOption({
                                category: '',
                            }); setAddOptionDialog(false)
                        }}>Close</Button>
                        <Button variant="primary" onClick={() => { handleAddCategory(newOption!); setNewOption({ category: '' }) }}>Add Category</Button>
                    </Modal.Footer>
                </Modal>
            }
            {editOptionDialog &&
                <Modal
                    show onHide={() => setEditOptionDialog(false)}
                    dialogClassName={modalStyles.dropDownEditModalWidth}
                    centered={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={modalStyles.dropDownEditModalBody}>
                        <Col>
                            {categories.map(({category}: any) => {
                                return <Row className={modalStyles.editCategoryRow}>
                                    <p className={modalStyles.editCategoryRowText}>{category}</p>
                                    <Button className={modalStyles.editCategoryRowButton}>Edit</Button>
                                    <Button 
                                    className={modalStyles.editCategoryRowButton}
                                    onClick={() => deleteProductCategory(category.original)}>Delete</Button>
                                    </Row>
                            })}
                        </Col>
                    </Modal.Body>
                </Modal>
            }
        </div>
    );
    async function deleteProductCategory(productCategory: ProductCategoryModel) {
        try {
            await ProductsApi.deleteProductCategory(productCategory._id);
            setCategories(categories.filter(existingCategory => existingCategory._id !== productCategory._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
}

export default CategoryInputField;