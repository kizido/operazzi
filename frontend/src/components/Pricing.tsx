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

const defaultData: UnitCostModel = {
  packagingCosts: "5.00", // retrieve from packaging page
  lcogs: "3.50", // cogs + packaging costs + isc + int. duties & taxes + fbacost
  shippingWeight: "6.00", // product weight + shipping box weight
  amazonFees: "7.00", // pick & pack + referral fee
  growthFund: "3.00", // cogs * growth %
  marketingBudget: "10.00", // sum of other headers * PPC SPEND %
  amazonPrice: "CALCULATED", // lcogs + opex + amazon fees + PPC + net profit + growth
  websitePrice: "CALCULATED", // lcogs + opex + shipping fees + PPC + net profit + growth
};

// Transform your data into the transposed structure
const transposedData: TransposedRow[] = Object.entries(defaultData).map(
  ([key, value]) => ({
    header: key, // These will be your row headers
    value: value, // These will be your row values
  })
);

const transposeData = (initialData: UnitCostModel) => {
  const transposedData: TransposedRow[] = Object.entries(initialData).map(
    ([key, value]) => ({
      header: key, // These will be your row headers
      value: value, // These will be your row values
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

export default function Pricing() {
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
  };

  const getPackageWeight = async () => {
    let responseWeight: string = "0";
    try {
      if (product?.product?.packageTypeId) {
        const response = await ProductsApi.fetchProductPackageType(
          product?.product?.packageTypeId
        );
        responseWeight = response.packageWeight.toFixed(2);
      }
    } catch (error) {
      console.error(error);
    }
    return responseWeight;
  };

  useEffect(() => {
    const recalculatePricingData = async () => {
      if (product != null) {
        const packagingData = product.product?.productPackaging
          .reduce((acc, curr) => {
            const cleanedCost = curr.perUnitCost.replace(/[^\d.-]/g, "");
            const cost = parseFloat(cleanedCost) || 0;
            return acc + cost;
          }, 0)
          .toFixed(2);
        const lcogsData = (
          parseFloat(packagingData ?? "0") +
          parseFloat(product.product?.cogs ?? "0") +
          parseFloat(product.product?.internationalShippingCosts ?? "0") +
          parseFloat(product.product?.dutiesAndTariffs ?? "0") +
          parseFloat(product.product?.domesticShippingCosts ?? "0")
        ).toFixed(2);
        const shippingWeight = (
          parseFloat(product.product?.weight ?? "0") +
          parseFloat(await getPackageWeight())
        ).toFixed(2);
        const newPricingData: UnitCostModel = {
          packagingCosts: packagingData ?? "N/A",
          lcogs: lcogsData, // cogs + packaging costs + isc + int. duties & taxes + fbacost
          shippingWeight: shippingWeight, // product weight + shipping box weight
          amazonFees: "7.00", // pick & pack + referral fee
          growthFund: "3.00", // cogs * growth %
          marketingBudget: "10.00", // sum of other headers * PPC SPEND %
          amazonPrice: "CALCULATED", // lcogs + opex + amazon fees + PPC + net profit + growth
          websitePrice: "CALCULATED", // lcogs + opex + shipping fees + PPC + net profit + growth
        };
        setPricingData(transposeData(newPricingData));
      }
    };
    recalculatePricingData();
  }, [product]);

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
