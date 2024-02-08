import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from '../../styles/Forms.module.css';
import { useState, useEffect, useRef } from "react";
import { ProductCategory as ProductCategoryModel } from "../../models/productCategory";
import { ProductCategoryInput } from "../../network/products_api";
import * as ProductsApi from "../../network/products_api";
import { IconButton } from "@mui/material";
import { IconSettings, IconPencil, IconX, IconPlus } from '@tabler/icons-react';
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

    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const valueSubmittedRef = useRef(false);
    const [newOption, setNewOption] = useState<ProductCategoryInput>({ category: '' });
    const [addOptionDialog, setAddOptionDialog] = useState(false);
    const [editOptionDialog, setEditOptionDialog] = useState(false);

    const [categoriesLoaded, setCategoriesLoaded] = useState(false);

    useEffect(() => {
        async function loadCategories() {
            try {
                const productCategories = await ProductsApi.fetchProductCategories();
                setCategories(productCategories);
                setCategoriesLoaded(true);
            } catch (error) {
                console.error(error);
            }
        }
        loadCategories();
    }, []);

    async function handleEditCategory(categoryInput: ProductCategoryInput, idInput: string) {
        try {
            await ProductsApi.updateProductCategory(categoryInput, idInput);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    // Separate the keydown logic
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            valueSubmittedRef.current = true;
            (e.currentTarget as HTMLInputElement).blur();
        }
        else if (e.key === 'Escape') {
            (e.currentTarget as HTMLInputElement).blur();
        }
    };

    // Handle save of data in the onBlur event
    const handleSave = (index: number) => {
        if (newOption.category !== '') {
            const updatedCategories = [...categories]
            updatedCategories[index].category = newOption.category
            setCategories(updatedCategories)
            handleEditCategory(newOption, updatedCategories[index]._id)
            setEditingIndex(null)
        } else {
            revertSave(index);
        }
        valueSubmittedRef.current = false;
    };

    // Handle revert of data in the onBlur event when input is escaped or clicked out of
    const revertSave = (index: number) => {
        const updatedCategories = [...categories];
        setNewOption({ category: updatedCategories[index].category })
        setCategories(updatedCategories);
        setEditingIndex(null);
    };

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
                <InputGroup size="sm">
                    {categoriesLoaded ? (<Form.Select size="sm"
                        {...props}
                        {...register(name, registerOptions)}
                        isInvalid={!!error}
                    >
                        {/* <option></option> */}
                        {categories?.map((category, index) => (
                            <option key={index}>
                                {category.category}
                            </option>
                        ))}
                    </Form.Select>) : <Form.Select size="sm"></Form.Select>}
                    <Form.Control.Feedback type="invalid">
                        {error?.message}
                    </Form.Control.Feedback>
                    <IconButton onClick={() => {
                        setNewOption({ category: '' });
                        setAddOptionDialog(true);
                    }} className={styles.formButton}><IconPlus/></IconButton>
                    <IconButton onClick={() => setEditOptionDialog(true)} className={styles.formButton}><IconSettings /></IconButton>
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
                    centered={true}
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={modalStyles.dropDownEditModalBody}>
                        <Col>
                            {categories.map((categoryModel: ProductCategoryModel, index: number) => {
                                return (
                                    <Row key={index} className={modalStyles.editCategoryRow}>
                                        {editingIndex === index ? (
                                            <input
                                                className={modalStyles.editCategoryRowText}
                                                value={newOption.category}
                                                onChange={(e) => setNewOption({ category: e.target.value })}
                                                onBlur={() => { valueSubmittedRef.current === true ? handleSave(index) : revertSave(index) }}
                                                // onBlur={() => revertSave(index)}
                                                autoFocus
                                                onKeyDown={handleKeyDown}
                                            />
                                        ) : (
                                            <p className={modalStyles.editCategoryRowText}>{categoryModel.category}</p>
                                        )}

                                        <Button
                                            disabled={editingIndex !== null}
                                            className={modalStyles.editCategoryRowButton}
                                            onClick={() => { setEditingIndex(index); setNewOption({ category: categoryModel.category }); }}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            className={modalStyles.editCategoryRowButton}
                                            onClick={() => deleteProductCategory(categoryModel)}
                                        >
                                            Delete
                                        </Button>
                                    </Row>
                                );
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