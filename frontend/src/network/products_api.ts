import { error } from "console";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Product } from "../models/product";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    }
    else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if(response.status == 401) {
            throw new UnauthorizedError(errorMessage);
        } else if(response.status == 409) {
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
    cogs: string,
    packagingCosts: string,
    weight: string, // in grams
    domesticShippingCosts: string,
    internationalShippingCosts: string,
    dutiesAndTariffs: string,
    pickAndPackFee: string,
    amazonReferralFee: string,
    opex: string,
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