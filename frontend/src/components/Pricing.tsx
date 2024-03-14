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

type UnitCostModel = {
  lcogs: string;
  opex: string;
  amazonFees: string;
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

const transposeData = (initialData: UnitCostModel) => {
  const transposedData: TransposedRow[] = Object.entries(initialData).map(
    ([key, value]) => ({
      header: key, // These will be your row headers
      value: "$" + value, // These will be your row values
      headerDisplay:
        key === "lcogs"
          ? "LCOGS"
          : key === "opex"
          ? "OPEX"
          : key === "amazonFees"
          ? "Amazon Fees"
          : key === "marketingBudget"
          ? "Marketing Budget"
          : key === "subtotal"
          ? "Subtotal"
          : key === "netProfit"
          ? "Net Profit"
          : key === "growthFund"
          ? "Growth Fund"
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
            <tr>
              <td>COGS</td>
              <td>{cogs}</td>
            </tr>
            <tr>
              <td>Packaging Costs</td>
              <td>{packageCostsData}</td>
            </tr>
            <tr>
              <td>International Shipping Costs</td>
              <td>{isc}</td>
            </tr>
            <tr>
              <td>International Duties & Taxes</td>
              <td>{dutiesAndTariffs}</td>
            </tr>
            <tr>
              <td>Ship to Amazon FBA</td>
              <td>{dsc}</td>
            </tr>
          </>
        );
        break;
      case "amazonFees":
        content = (
          <>
            <tr>
              <td>FBA Pick & Pack Fee</td>
              <td>{pickAndPackFee}</td>
            </tr>
            <tr>
              <td>Referral Fee</td>
              <td>{amazonReferralFee}</td>
            </tr>
            <tr>
              <td>Store Fee</td>
              <td>{amazonStorageFee}</td>
            </tr>
          </>
        );
        break;
      case "subtotal":
        content = (
          <>
            <tr>
              <td>LCOGS</td>
              <td>{lcogs}</td>
            </tr>
            <tr>
              <td>OPEX</td>
              <td>{opex}</td>
            </tr>
            <tr>
              <td>Amazon Fees</td>
              <td>{amazonFees}</td>
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
  useEffect(() => {
    const updatePackageWeight = async () => {
      let responseWeight: string = "0";
      try {
        if (packageId) {
          console.log("PACKAGE ID RETRIEVED");
          const response = await ProductsApi.fetchProductPackageType(packageId);
          responseWeight = response.packageWeight.toFixed(2);
          console.log("RESPONSE WEIGHT: " + responseWeight);
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
    recalculatePricingData();
  }, [
    cogs,
    weight,
    isc,
    dutiesAndTariffs,
    dsc,
    pickAndPackFee,
    amazonReferralFee,
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
    recalculatePricingData();
  };
  const calculatePackagingCosts = () => {
    const totalPackagingCosts = packaging
      .reduce((acc, curr) => {
        const cleanedCost = curr.perUnitCost.replace(/[^\d.-]/g, "");
        const cost = parseFloat(cleanedCost) || 0;
        return acc + cost;
      }, 0)
      .toFixed(2);
    setPackageCostsData(totalPackagingCosts);
  };
  const parseAndAdd = (nums: string[]) => {
    let total: number = 0;
    nums.forEach((num) => {
      total += parseFloat(num ?? "0");
    });
    return total.toFixed(2);
  };
  const recalculatePricingData = () => {
    if (productToEdit != null) {
      calculatePackagingCosts();
      const lcogsData = parseAndAdd([
        cogs,
        packageCostsData,
        isc,
        dutiesAndTariffs,
        dsc,
      ]);
      setLcogs(lcogsData);
      // (
      //   parseFloat(cogs !== "" ? cogs : "0") +
      //   parseFloat(packageCostsData ?? "0") +
      //   parseFloat(isc !== "" ? isc : "0") +
      //   parseFloat(dutiesAndTariffs ?? "0") +
      //   parseFloat(dsc ?? "0")
      // ).toFixed(2);
      // const shippingWeight = (
      //   parseFloat(weight ?? "0") + parseFloat(packageWeightData)
      // ).toFixed(2);
      const amazonFees = parseAndAdd([
        pickAndPackFee,
        amazonReferralFee,
        amazonStorageFee,
      ]);
      setAmazonFees(amazonFees);
      const amazonPriceData = (
        parseFloat(lcogsData ?? "0") +
        parseFloat(opex ?? "0") +
        parseFloat(amazonFees ?? "0") +
        parseFloat(ppcSpend ?? "0") +
        parseFloat(netProfitTarget ?? "0") +
        parseFloat(growth ?? "0")
      ).toFixed(2);
      setAmazonPrice(amazonPriceData);
      const subtotal = parseAndAdd([lcogsData, opex, amazonFees]);
      const websitePriceData = (
        parseFloat(lcogsData ?? "0") +
        parseFloat(opex ?? "0") +
        parseFloat(isc ?? "0") +
        parseFloat(ppcSpend ?? "0") +
        parseFloat(netProfitTarget ?? "0") +
        parseFloat(growth ?? "0")
      ).toFixed(2);
      setWebsitePrice(websitePriceData);
      const marketingRate = parseFloat(ppcSpend) / Math.pow(10, 2);
      const marketingBudget = (parseFloat(subtotal) * marketingRate).toFixed(2);
      const netProfitRate = parseFloat(netProfitTarget) / Math.pow(10, 2);
      const netProfit = (parseFloat(subtotal) * netProfitRate).toFixed(2);
      const growthFundRate = parseFloat(growth) / Math.pow(10, 2);
      const growthFund = (parseFloat(cogs) * growthFundRate).toFixed(2);
      const newPricingData: UnitCostModel = {
        lcogs: lcogsData, // cogs + packaging costs + isc + int. duties & taxes + fbacost
        opex,
        amazonFees, // pick & pack + referral fee
        subtotal,
        netProfit,
        growthFund, // cogs * growth %
        marketingBudget, // (packagingcosts + lcogs + amazonfees) * PPC SPEND %
        // amazonPrice: amazonPriceData, // lcogs + opex + amazon fees + PPC + net profit % + growth %
        // websitePrice: websitePriceData, // lcogs + opex + shipping fees + PPC + net profit % + growth %
      };
      setPricingData(transposeData(newPricingData));
    }
  };

  const defaultPricingData = () => {
    setOpex(productToEdit?.opex ?? "");
    setPpcSpend(productToEdit?.ppcSpend ?? "7.50");
    setGrowth(productToEdit?.growth ?? "");
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
      <div className={modalStyles.scrollableTableContainer}>
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
      <div className={pricingStyles.pricingFinalPricesContainer}>
        <h3>Amazon Price: ${amazonPrice}</h3>
        <h3>Website Price: ${websitePrice}</h3>
      </div>
    </div>
  );
}
