import { ProductImage } from "./productImage";

export interface Product {
    _id: string,
    name: string,
    productSku: string,
    brand: string,
    barcodeUpc: string,
    category: string,
    description: string,
    cogs: string,
    dimensions: string,
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
    createdAt: string,
    updatedAt: string,
}