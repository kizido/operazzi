import { ProductImage } from "./productImage";

export interface Product {
  _id: string;
  name: string;
  productSku: string;
  brand: string;
  barcodeUpc: string;
  category: string;
  description: string;
  cogs: string;
  dimensions: {
    productLength: number;
    productWidth: number;
    productHeight: number;
    productDiameter: number;
  };
  masterCaseDimensions: {
    masterCaseLength: number;
    masterCaseWidth: number;
    masterCaseHeight: number;
    masterCaseQuantity: number;
  };
  masterCaseWeight: number;
  packageTypeId: string | null;
  weight: string; // in grams
  domesticShippingCosts: string;
  internationalShippingCosts: string;
  dutiesAndTariffs: string;
  pickAndPackFee: string;
  amazonReferralFee: string;
  opex: string;
  productImageId: string | null;
  productCustomsId: string;
  productListingSkus: {
    channel: string;
    listingSku: string;
    pushInventory: boolean;
    latency: string;
    status: boolean;
  }[];
  productVendorProducts: {
    vendor: string;
    vendorSku: string;
    minOrderQuantity: string;
    leadTime: string;
    vendorRangePrice: {
      minUnits: string;
      maxUnits: string;
      price: string;
    }[];
  }[];
  activated: boolean;
  createdAt: string;
  updatedAt: string;
}
