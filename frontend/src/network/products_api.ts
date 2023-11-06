import { error } from "console";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Product } from "../models/product";
import { ProductCategory } from "../models/productCategory";
import { User } from "../models/user";
import { ProductBrand } from "../models/productBrand";
import { ProductPackageType } from "../models/productPackageType";
import { ProductImage } from "../models/productImage";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    }
    else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/api/users", { method: "GET" });
    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("api/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" });
}

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetchData("/api/products", { method: "GET" });
    return response.json();
}

export interface ProductInput {
    name: string,
    productSku: string,
    brand: string,
    barcodeUpc: string,
    category: string,
    description: string,
    dimensions: { productLength: number, productWidth: number, productHeight: number, productDiameter: number },
    masterCaseDimensions: { masterCaseLength: number, masterCaseWidth: number, masterCaseHeight: number, masterCaseQuantity: number },
    masterCaseWeight: number,
    cogs: string,
    packageType: string,
    weight: string, // in grams
    domesticShippingCosts: string,
    internationalShippingCosts: string,
    dutiesAndTariffs: string,
    pickAndPackFee: string,
    amazonReferralFee: string,
    opex: string,
    productImageId: string,
    activated: boolean,
}

export async function createProduct(product: ProductInput): Promise<Product> {
    const response = await fetchData("/api/products",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
    return response.json();
}

export async function updateProduct(productId: string, product: ProductInput): Promise<Product> {
    const response = await fetchData("/api/products/" + productId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
    return response.json();
}

export async function deleteProduct(productId: string) {
    await fetchData("api/products/" + productId, { method: "DELETE" });
}

export async function toggleActivateProduct(product: Product) {
    const response = await fetchData("/api/products/" + product._id + "/toggle-activated",
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
    return response.json();
}

export interface ProductCategoryInput {
    category: string,
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
    const response = await fetchData("/api/productCategories", { method: "GET" });
    return response.json();
}

export async function createProductCategory(category: ProductCategoryInput): Promise<ProductCategory> {
    const response = await fetchData("/api/productCategories",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(category),
        });
    return response.json();
}

export interface ProductBrandInput {
    brand: string,
}

export async function fetchProductBrands(): Promise<ProductBrand[]> {
    const response = await fetchData("/api/productBrands", { method: "GET" });
    return response.json();
}

export async function createProductBrand(brand: ProductBrandInput): Promise<ProductBrand> {
    const response = await fetchData("/api/productBrands",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(brand),
        });
    return response.json();
}

export interface ProductPackageTypeInput {
    packageType: string,
}

export async function fetchProductPackageTypes(): Promise<ProductPackageType[]> {
    const response = await fetchData("/api/productPackageTypes", { method: "GET" });
    return response.json();
}

export async function createProductPackageType(packageType: ProductPackageTypeInput): Promise<ProductPackageType> {
    const response = await fetchData("/api/productPackageTypes",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(packageType),
        });
    return response.json();
}
export interface ProductImageInput {
    productImageName: string,
    imageFile: Buffer,
    contentType: string,
}
export async function createProductImage(formData: FormData): Promise<ProductImage> {
    const response = await fetchData("/api/productImages",
        {
            method: "POST",
            body: formData,
        });
    return response.json();
}
export async function fetchProductImage(productImageId: string): Promise<ProductImage> {
    const response = await fetchData("/api/productImages/" + productImageId, { method: "GET" });
    return response.json();
}
export async function fetchProductImages(): Promise<ProductImage[]> {
    const response = await fetchData("/api/productImages", { method: "GET" });
    return response.json();
}

export async function deleteProductCategory(productCategoryId: string) {
    await fetchData("api/productCategories/" + productCategoryId, { method: "DELETE" });
}

export async function deleteProductPackageType(productPackageTypeId: string) {
    await fetchData("api/productPackageTypes/" + productPackageTypeId, { method: "DELETE" });
}

export async function deleteProductBrand(productBrandId: string) {
    await fetchData("api/productBrands/" + productBrandId, { method: "DELETE" });
}

export async function updateProductCategory(productCategory: ProductCategoryInput, productCategoryId: string): Promise<ProductCategory> {
    const response = await fetchData("api/productCategories/" + productCategoryId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productCategory),
        });
    return response.json();
}
export async function updateProductBrand(productBrand: ProductBrandInput, productBrandId: string): Promise<ProductBrand> {
    const response = await fetchData("api/productBrands/" + productBrandId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productBrand),
        });
    return response.json();
}
export async function updateProductPackageType(productPackageType: ProductPackageTypeInput, productPackageTypeId: string): Promise<ProductPackageType> {
    const response = await fetchData("api/productPackageTypes/" + productPackageTypeId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productPackageType),
        });
    return response.json();
}