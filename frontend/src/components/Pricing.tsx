import React, { useContext, useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import * as ProductsApi from "../network/products_api";
import { ProductContext } from "../contexts/ProductContext";
import tableStyles from "../styles/Table.module.css";
import modalStyles from "../styles/Modal.module.css";
import pricingStyles from "../styles/Pricing.module.css";
import { ProductPackageType } from "../models/productPackageType";
import { Product } from "../models/product";

type UnitCostModel = {
  packagingCosts: string; // total packaging cost from packaging page
  lcogs: string;
  shippingWeight: string; // weight (gramss) from basic info
  amazonFees: string;
  growthFund: string;
  marketingBudget: string;
  amazonPrice: string;
  websitePrice: string;
};

// Create a type that represents the structure of your transposed rows
type TransposedRow = {
  header: string;
  value: string;
};

const transposeData = (initialData: UnitCostModel) => {
  const transposedData: TransposedRow[] = Object.entries(initialData).map(
    ([key, value]) => ({
      header: key, // These will be your row headers
      value: '$' + value, // These will be your row values
    })
  );
  return transposedData;
};

const columnHelper = createColumnHelper<TransposedRow>();

const columns = [
  columnHelper.accessor("header", {
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("value", {
    cell: (info) => <span>{info.getValue()}</span>,
  }),
];
interface PricingProps {
  pricingDataSubmit: (name: string, value: string) => void;
  productToEdit?: Product;
}

export default function Pricing({ pricingDataSubmit, productToEdit }: PricingProps) {
  // const [data, setData] = useState(transposedData);
  const [pricingData, setPricingData] = useState<TransposedRow[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const [opex, setOpex] = useState("");
  const [ppcSpend, setPpcSpend] = useState("");
  const [growth, setGrowth] = useState("");
  const [netProfitTarget, setNetProfitTarget] = useState("");

  const product = useContext(ProductContext);

  const table = useReactTable({
    data: pricingData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      // Checks if the input is all digits
      switch (name) {
        case "opex":
          setOpex(value);
          break;
        case "ppcSpend":
          setPpcSpend(value);
          break;
        case "growth":
          setGrowth(value);
          break;
        case "netProfitTarget":
          setNetProfitTarget(value);
          break;
        default:
          // Handle default case or throw an error
          break;
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    // If there's no decimal or not exactly two digits after the decimal, format it
    if (!/\.\d{2}$/.test(value)) {
      const [whole = "", fractional = ""] = value.split(".");
      const paddedFractional = fractional.padEnd(2, "0");
      value = `${whole}.${paddedFractional}`;
    }

    // If the value starts with a decimal, add a '0' before it
    if (/^\./.test(value)) {
      value = `0${value}`;
    }

    switch (name) {
      case "opex":
        setOpex(value);
        break;
      case "ppcSpend":
        setPpcSpend(value);
        break;
      case "growth":
        setGrowth(value);
        break;
      case "netProfitTarget":        
        setNetProfitTarget(value);
        break;
      default:
        // Handle default case or throw an error
        break;
    }
    pricingDataSubmit(name, value);
    recalculatePricingData();
  };

  const getPackageWeight = async () => {
    let responseWeight: string = "0";
    try {
      if (productToEdit?.packageTypeId) {
        const response = await ProductsApi.fetchProductPackageType(
          productToEdit?.packageTypeId
        );
        responseWeight = response.packageWeight.toFixed(2);
      }
    } catch (error) {
      console.error(error);
    }
    return responseWeight;
  };

  const recalculatePricingData = async () => {
    if (productToEdit != null) {
      const packagingData = productToEdit?.productPackaging
        .reduce((acc, curr) => {
          const cleanedCost = curr.perUnitCost.replace(/[^\d.-]/g, "");
          const cost = parseFloat(cleanedCost) || 0;
          return acc + cost;
        }, 0)
        .toFixed(2);
      const lcogsData = (
        parseFloat(packagingData ?? "0") +
        parseFloat(productToEdit?.cogs ?? "0") +
        parseFloat(productToEdit?.internationalShippingCosts ?? "0") +
        parseFloat(productToEdit?.dutiesAndTariffs ?? "0") +
        parseFloat(productToEdit?.domesticShippingCosts ?? "0")
      ).toFixed(2);
      const shippingWeight = (
        parseFloat(productToEdit?.weight ?? "0") +
        parseFloat(await getPackageWeight())
      ).toFixed(2);
      const amazonFees = (
        parseFloat(productToEdit?.pickAndPackFee ?? "0") +
        parseFloat(productToEdit?.amazonReferralFee ?? "0")
      ).toFixed(2);
      const growthFund = (
        parseFloat(productToEdit?.cogs ?? "0") * parseFloat(growth)
      ).toFixed(2);
      const marketingBudget = (
        (parseFloat(packagingData ?? "0") +
          parseFloat(lcogsData ?? "0") +
          parseFloat(amazonFees ?? "0")) *
        parseFloat(ppcSpend ?? "0")
      ).toFixed(2);
      const amazonPrice = (
        parseFloat(lcogsData ?? "0") +
        parseFloat(opex ?? "0") +
        parseFloat(amazonFees ?? "0") +
        parseFloat(ppcSpend ?? "0") +
        parseFloat(netProfitTarget ?? "0") +
        parseFloat(growth ?? "0")
      ).toFixed(2);
      const websitePrice = (
        parseFloat(lcogsData ?? "0") +
        parseFloat(opex ?? "0") +
        parseFloat(productToEdit?.internationalShippingCosts ?? "0") +
        parseFloat(ppcSpend ?? "0") +
        parseFloat(netProfitTarget ?? "0") +
        parseFloat(growth ?? "0")
      ).toFixed(2);
      const newPricingData: UnitCostModel = {
        packagingCosts: packagingData ?? "N/A",
        lcogs: lcogsData, // cogs + packaging costs + isc + int. duties & taxes + fbacost
        shippingWeight, // product weight + shipping box weight
        amazonFees, // pick & pack + referral fee
        growthFund, // cogs * growth %
        marketingBudget, // (packagingcosts + lcogs + amazonfees) * PPC SPEND %
        amazonPrice, // lcogs + opex + amazon fees + PPC + net profit % + growth %
        websitePrice, // lcogs + opex + shipping fees + PPC + net profit % + growth %
      };
      setPricingData(transposeData(newPricingData));
    }
  };

  useEffect(() => {
    recalculatePricingData();
    defaultPricingData();
  }, [product]);

  const defaultPricingData = () => {
    setOpex(productToEdit?.opex ?? "");
    setPpcSpend(productToEdit?.ppcSpend ?? "");
    setGrowth(productToEdit?.growth ?? "");
    setNetProfitTarget(productToEdit?.netProfitTarget ?? "");
  };

  return (
    <div>
      <div className={pricingStyles.pricingInputContainer}>
        <label>
          OPEX $:
          <input
            name="opex"
            value={opex}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </label>
        <label>
          PPC Spend %:{" "}
          <input
            name="ppcSpend"
            value={ppcSpend}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </label>
        <label>
          Growth %:{" "}
          <input
            name="growth"
            value={growth}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </label>
        <label>
          Net Profit Target %:{" "}
          <input
            name="netProfitTarget"
            value={netProfitTarget}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </label>
      </div>
      <div className={modalStyles.scrollableTableContainer}>
        <table
          className={`${modalStyles.listingSkuTable} ${tableStyles.listingSkuTable}`}
        >
          <tbody className={modalStyles.listingSkuTableBody}>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`${tableStyles.tableRow} ${
                  row.id === selectedRowId ? tableStyles.selected : ""
                }`}
                onClick={() =>
                  setSelectedRowId(row.id === selectedRowId ? null : row.id)
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
