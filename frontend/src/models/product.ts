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
  amazonStorageFee: string;
  productImageId: string | null;
  productCustomsId: string;
  productListingSkus: {
    channel: string;
    listingSku: string;
    pushInventory: boolean;
    latency: string;
  }[];
  productVendorProducts: {
    vendor: string;
    vendorSku: string;
    perUnitCogs: string;
    minOrderQuantity: string;
    leadTime: string;
    vendorRangePrice: {
      minUnits: string;
      maxUnits: string;
      price: string;
    }[];
  }[];
  vendorProductCogsDefaultRow: string | null;
  productPackaging: {
    itemName: string,
    perUnitCost: string,
  }[];
  opex: string;
  ppcSpend: string;
  growth: string;
  netProfitTarget: string;
  activated: boolean;
  createdAt: string;
  updatedAt: string;
}
