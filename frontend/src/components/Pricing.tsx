import React, { useContext, useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
} from "@tanstack/react-table";
import * as ProductsApi from "../network/products_api";
import tableStyles from "../styles/Table.module.css";
import modalStyles from "../styles/Modal.module.css";
import pricingStyles from "../styles/Pricing.module.css";
import { Product } from "../models/product";
import { PackagingModel } from "./Packaging/PackagingTable";

type AmazonCostModel = {
  lcogs: string;
  opex: string;
  amazonFees: string;
  subtotal: string;
  marketingBudget: string;
  netProfit: string;
  growthFund: string;
};
type WebsiteCostModel = {
  lcogs: string;
  opex: string;
  shippingFees: string; // weight (of product + shipping box) in grams *  $0.007
  packingFees: string; // shipping box 0.80$ + shipping label 0.05$ + packing tape 0.05$ + packing list $0.05 + marketing inserts $1.75 + labor $0.55
  subtotal: string;
  marketingBudget: string;
  netProfit: string;
  growthFund: string;
};

// Create a type that represents the structure of your transposed rows
type TransposedRow = {
  headerDisplay: string;
  header: string;
  value: string;
};

const transposeData = (initialData: AmazonCostModel) => {
  const transposedData: TransposedRow[] = Object.entries(initialData).map(
    ([key, value]) => ({
      header: key, // These will be your row headers
      value: `$${value === "" ? "0.00" : value}`, // These will be your row values
      headerDisplay:
        key === "lcogs"
          ? "LCOGS"
          : key === "opex"
          ? "OPEX"
          : key === "amazonFees"
          ? "Amazon Fees"
          : key === "subtotal"
          ? "Subtotal"
          : key === "marketingBudget"
          ? "+ Marketing Budget"
          : key === "netProfit"
          ? "+ Net Profit"
          : key === "growthFund"
          ? "+ Growth Fund"
          : "",
    })
  );
  return transposedData;
};
const transposeWebsitePriceData = (initialData: WebsiteCostModel) => {
  const transposedData: TransposedRow[] = Object.entries(initialData).map(
    ([key, value]) => ({
      header: key, // These will be your row headers
      value: `$${value === "" ? "0.00" : value}`, // These will be your row values
      headerDisplay:
        key === "lcogs"
          ? "LCOGS"
          : key === "opex"
          ? "OPEX"
          : key === "shippingFees"
          ? "Shipping Fees"
          : key === "packingFees"
          ? "Packing Fees"
          : key === "subtotal"
          ? "Subtotal"
          : key === "marketingBudget"
          ? "+ Marketing Budget"
          : key === "netProfit"
          ? "+ Net Profit"
          : key === "growthFund"
          ? "+ Growth Fund"
          : "",
    })
  );
  return transposedData;
};

const columnHelper = createColumnHelper<TransposedRow>();

const columns = [
  columnHelper.display({
    id: "expander",
    cell: ({ row }) =>
      row.original.header !== "opex" &&
      row.original.header !== "netProfit" &&
      row.original.header !== "growthFund" &&
      row.original.header !== "marketingBudget" && (
        <button
          type="button"
          onClick={() => row.toggleExpanded()}
          aria-label="Toggle Row Expanded"
        >
          {row.getIsExpanded() ? "-" : "+"}{" "}
          {/* Change the icon based on the row's expanded state */}
        </button>
      ),
  }),
  columnHelper.accessor("headerDisplay", {
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("value", {
    cell: (info) => <span>{info.getValue()}</span>,
  }),
];

interface PricingProps {
  pricingDataSubmit: (name: string, value: string) => void;
  productToEdit?: Product;
  packageId: string | null;
  cogs: string;
  weight: string;
  isc: string;
  dutiesAndTariffs: string;
  dsc: string;
  pickAndPackFee: string;
  amazonReferralFee: string;
  amazonStorageFee: string;
  packaging: PackagingModel[];
}

export default function Pricing({
  pricingDataSubmit,
  productToEdit,
  packageId,
  cogs,
  weight,
  isc,
  dutiesAndTariffs,
  dsc,
  pickAndPackFee,
  amazonReferralFee,
  amazonStorageFee,
  packaging,
}: PricingProps) {
  const ExpandedRowContent = ({ rowData }: { rowData: TransposedRow }) => {
    let content;
    switch (rowData.header) {
      case "lcogs":
        content = (
          <>
            <tr
              className={
                cogs === ""
                  ? pricingStyles.emptyExpandedRow
                  : cogs === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>COGS</td>
              <td>{cogs === "" ? "0.00" : cogs}</td>
            </tr>
            <tr
              className={
                packageCostsData === ""
                  ? pricingStyles.emptyExpandedRow
                  : packageCostsData === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>Packaging Costs</td>
              <td>{packageCostsData === "" ? "0.00" : packageCostsData}</td>
            </tr>
            <tr
              className={
                isc === ""
                  ? pricingStyles.emptyExpandedRow
                  : isc === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>International Shipping Costs</td>
              <td>{isc === "" ? "0.00" : isc}</td>
            </tr>
            <tr
              className={
                dutiesAndTariffs === ""
                  ? pricingStyles.emptyExpandedRow
                  : dutiesAndTariffs === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>International Duties & Taxes</td>
              <td>{dutiesAndTariffs === "" ? "0.00" : dutiesAndTariffs}</td>
            </tr>
            <tr
              className={
                dsc === ""
                  ? pricingStyles.emptyExpandedRow
                  : dsc === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>Ship to Amazon FBA</td>
              <td>{dsc === "" ? "0.00" : dsc}</td>
            </tr>
          </>
        );
        break;
      case "amazonFees":
        content = (
          <>
            <tr
              className={
                pickAndPackFee === ""
                  ? pricingStyles.emptyExpandedRow
                  : pickAndPackFee === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>FBA Pick & Pack Fee</td>
              <td>{pickAndPackFee === "" ? "0.00" : pickAndPackFee}</td>
            </tr>
            <tr
              className={
                amazonReferralFee === ""
                  ? pricingStyles.emptyExpandedRow
                  : amazonReferralFee === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>Amazon Referral Fee</td>
              <td>{amazonReferralFee === "" ? "0.00" : amazonReferralFee}</td>
            </tr>
            <tr
              className={
                amazonStorageFee === ""
                  ? pricingStyles.emptyExpandedRow
                  : amazonStorageFee === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>Amazon Storage Fee</td>
              <td>{amazonStorageFee === "" ? "0.00" : amazonStorageFee}</td>
            </tr>
          </>
        );
        break;
      case "subtotal":
        content = (
          <>
            <tr
              className={
                lcogs === ""
                  ? pricingStyles.emptyExpandedRow
                  : lcogs === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>LCOGS</td>
              <td>{lcogs === "" ? "0.00" : lcogs}</td>
            </tr>
            <tr
              className={
                opex === ""
                  ? pricingStyles.emptyExpandedRow
                  : opex === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>OPEX</td>
              <td>{opex === "" ? "0.00" : opex}</td>
            </tr>
            <tr
              className={
                amazonFees === ""
                  ? pricingStyles.emptyExpandedRow
                  : amazonFees === "0.00"
                  ? pricingStyles.emptyExpandedRow
                  : ""
              }
            >
              <td>Amazon Fees</td>
              <td>{amazonFees === "" ? "0.00" : amazonFees}</td>
            </tr>
          </>
        );
        break;
      // Add cases for other headers as needed
      default:
        content = (
          <>
            <tr></tr>
          </>
        );
        break;
    }

    return (
      <table
        className={`${modalStyles.listingSkuTable} ${tableStyles.expandedRowTable}`}
      >
        <tbody className={modalStyles.listingSkuTableBody}>{content}</tbody>
      </table>
    );
  };

  const [pricingData, setPricingData] = useState<TransposedRow[]>([]);
  const [websitePricingData, setWebsitePricingData] = useState<TransposedRow[]>(
    []
  );
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const [opex, setOpex] = useState("");
  const [ppcSpend, setPpcSpend] = useState("");
  const [growth, setGrowth] = useState("");
  const [netProfitTarget, setNetProfitTarget] = useState("");

  const [packageWeightData, setPackageWeightData] = useState<string>("");
  const [packageCostsData, setPackageCostsData] = useState<string>("");
  const [lcogs, setLcogs] = useState<string>("");
  const [amazonFees, setAmazonFees] = useState<string>("");
  const [amazonPrice, setAmazonPrice] = useState<string>("");
  const [websitePrice, setWebsitePrice] = useState<string>("");

  const table = useReactTable({
    data: pricingData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });
  const websiteTable = useReactTable({
    data: websitePricingData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });
  useEffect(() => {
    const updatePackageWeight = async () => {
      let responseWeight: string = "0";
      try {
        if (packageId) {
          const response = await ProductsApi.fetchProductPackageType(packageId);
          responseWeight = response.packageWeight.toFixed(2);
        }
      } catch (error) {
        console.error(error);
      }
      setPackageWeightData(responseWeight);
    };
    updatePackageWeight();
  }, [packageId]);
  useEffect(() => {
    defaultPricingData();
  }, []);
  useEffect(() => {
    recalculateAmazonPricingData();
  }, [
    cogs,
    weight,
    isc,
    dutiesAndTariffs,
    dsc,
    pickAndPackFee,
    amazonReferralFee,
    amazonStorageFee,
    packaging,
    packageWeightData,
  ]);

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
    recalculateAmazonPricingData();
  };
  const calculatePackagingCosts = () => {
    if (packaging.length > 0) {
      const totalPackagingCosts = packaging
        .reduce((acc, curr) => {
          const cleanedCost = curr.perUnitCost.replace(/[^\d.-]/g, "");
          const cost = parseFloat(cleanedCost) || 0;
          return acc + cost;
        }, 0)
        .toFixed(2);
      setPackageCostsData(totalPackagingCosts);
    }
  };
  const parseAndAdd = (nums: string[]) => {
    let total: number = 0;
    nums.forEach((num) => {
      total += parseFloat(num !== "" ? num : "0.00");
    });
    return total.toFixed(2);
  };
  const recalculateWebsitePricingData = () => {
    const lcogsData = parseAndAdd([
      cogs,
      packageCostsData,
      isc,
      dutiesAndTariffs,
    ]);
    const shippingFees = (
      (parseFloat(weight) + parseFloat(packageWeightData)) *
      0.007
    ).toFixed(2);
    const packingFees = "3.25"; // placeholder constant
    const subtotal = parseAndAdd([lcogsData, opex, shippingFees, packingFees]);
    const netProfitRate = parseFloat(netProfitTarget) / Math.pow(10, 2);
    const netProfit = (
      parseFloat(subtotal) +
      parseFloat(subtotal) * netProfitRate
    ).toFixed(2);
    const growthFundRate = parseFloat(growth) / Math.pow(10, 2);
    const growthFund = (
      parseFloat(netProfit) +
      parseFloat(cogs === "" ? "0.00" : cogs) * growthFundRate
    ).toFixed(2);
    const marketingRate = parseFloat(ppcSpend) / Math.pow(10, 2);
    const marketingBudget = (
      parseFloat(growthFund) +
      parseFloat(subtotal) * marketingRate
    ).toFixed(2);
    const newOpex = parseFloat(opex).toFixed(2);
    const newPricingData: WebsiteCostModel = {
      lcogs: lcogsData, // cogs + packaging costs + isc + int. duties & taxes + fbacost
      opex: newOpex,
      shippingFees,
      packingFees,
      subtotal,
      netProfit,
      growthFund, // cogs * growth %
      marketingBudget, // (packagingcosts + lcogs + amazonfees) * PPC SPEND %
    };
    setWebsitePricingData(transposeWebsitePriceData(newPricingData));
  };
  const recalculateAmazonPricingData = () => {
    calculatePackagingCosts();
    const lcogsData = parseAndAdd([
      cogs,
      packageCostsData,
      isc,
      dutiesAndTariffs,
      dsc,
    ]);
    setLcogs(lcogsData);
    const amazonFees = parseAndAdd([
      pickAndPackFee,
      amazonReferralFee,
      amazonStorageFee,
    ]);
    setAmazonFees(amazonFees);
    const subtotal = parseAndAdd([lcogsData, opex, amazonFees]);
    const netProfitRate = parseFloat(netProfitTarget) / Math.pow(10, 2);
    const netProfit = (
      parseFloat(subtotal) +
      parseFloat(subtotal) * netProfitRate
    ).toFixed(2);
    const growthFundRate = parseFloat(growth) / Math.pow(10, 2);
    const growthFund = (
      parseFloat(netProfit) +
      parseFloat(cogs === "" ? "0.00" : cogs) * growthFundRate
    ).toFixed(2);
    const marketingRate = parseFloat(ppcSpend) / Math.pow(10, 2);
    const marketingBudget = (
      parseFloat(growthFund) +
      parseFloat(subtotal) * marketingRate
    ).toFixed(2);
    const newOpex = parseFloat(opex).toFixed(2);
    const amazonPriceData = parseAndAdd([
      subtotal,
      marketingBudget,
      netProfit,
      growthFund,
    ]);
    setAmazonPrice(amazonPriceData);
    const websitePriceData = parseAndAdd([lcogs, opex]);
    (
      parseFloat(lcogsData ?? "0") +
      parseFloat(opex ?? "0") +
      parseFloat(isc ?? "0") +
      parseFloat(ppcSpend ?? "0") +
      parseFloat(netProfitTarget ?? "0") +
      parseFloat(growthFund ?? "0")
    ).toFixed(2);
    setWebsitePrice(websitePriceData);
    const newPricingData: AmazonCostModel = {
      lcogs: lcogsData, // cogs + packaging costs + isc + int. duties & taxes + fbacost
      opex: newOpex,
      amazonFees, // pick & pack + referral fee
      subtotal,
      netProfit,
      growthFund, // cogs * growth %
      marketingBudget, // (packagingcosts + lcogs + amazonfees) * PPC SPEND %
      // amazonPrice: amazonPriceData, // lcogs + opex + amazon fees + PPC + net profit % + growth %
      // websitePrice: websitePriceData, // lcogs + opex + shipping fees + PPC + net profit % + growth %
    };
    setPricingData(transposeData(newPricingData));
  };

  const defaultPricingData = () => {
    setOpex(productToEdit?.opex ?? "0.00");
    setPpcSpend(productToEdit?.ppcSpend ?? "7.50");
    setGrowth(productToEdit?.growth ?? "0.00");
    setNetProfitTarget(productToEdit?.netProfitTarget ?? "25.00");
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
          Marketing Budget %:{" "}
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
      <div
        className={`${modalStyles.scrollableTableContainer} ${modalStyles.scrollablePricingTableContainer}`}
      >
        {/* <div className={modalStyles.pricingHeaders}>
          <h4>Amazon Price</h4>
          <h4>Website Price</h4>
        </div> */}

        {/* Amazon Pricing Table */}
        <div className={modalStyles.pricingTableDividedContainer}>
          <h4 className="text-center">Amazon Price</h4>
          <table
            className={`${modalStyles.listingSkuTable} ${tableStyles.listingSkuTable}`}
          >
            <tbody className={modalStyles.listingSkuTableBody}>
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    key={row.id}
                    className={`${tableStyles.tableRow} ${
                      row.id === selectedRowId ? tableStyles.selected : ""
                    } ${
                      row.original.header === "subtotal"
                        ? pricingStyles.subtotalRow
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedRowId(row.id === selectedRowId ? null : row.id)
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={row.getVisibleCells().length - 1}>
                        <ExpandedRowContent rowData={row.original} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Website Pricing Table */}
        <div className={modalStyles.pricingTableDividedContainer}>
          <h4 className="text-center">Website Price</h4>
          <table
            className={`${modalStyles.listingSkuTable} ${tableStyles.listingSkuTable}`}
          >
            <tbody className={modalStyles.listingSkuTableBody}>
              {websiteTable.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    key={row.id}
                    className={`${tableStyles.tableRow} ${
                      row.id === selectedRowId ? tableStyles.selected : ""
                    } ${
                      row.original.header === "subtotal"
                        ? pricingStyles.subtotalRow
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedRowId(row.id === selectedRowId ? null : row.id)
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={row.getVisibleCells().length - 1}>
                        <ExpandedRowContent rowData={row.original} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={pricingStyles.pricingFinalPricesContainer}>
        <h3>Amazon Price: ${amazonPrice}</h3>
        <h3>Website Price: ${websitePrice}</h3>
      </div>
    </div>
  );
}
