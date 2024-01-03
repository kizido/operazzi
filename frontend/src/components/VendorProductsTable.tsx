import React, { useState, useReducer, useEffect, useContext } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "../styles/Modal.module.css";
import tableStyles from "../styles/Table.module.css";
import vendorProductStyles from "../styles/VendorProducts.module.css";
import { Button, Modal } from "react-bootstrap";
import { ProductContext } from "../contexts/ProductContext";

export type VendorProductsModel = {
  vendor: string;
  vendorSku: string;
  perUnitCogs: string;
  minOrderQuantity: string;
  leadTime: string;
  vendorRangePrice: PriceRange[];
};
export type PriceRange = {
  minUnits: string;
  maxUnits: string;
  price: string;
};

interface ExpandedRowContentProps {
  vendorRangePrice: PriceRange[];
}

const ExpandedRowContent = ({ vendorRangePrice }: ExpandedRowContentProps) => {
  return (
    <table
      className={`${styles.listingSkuTable} ${tableStyles.expandedRowTable}`}
    >
      <thead>
        <tr>
          <th className={styles.listingSkuTableH}>From</th>
          <th className={styles.listingSkuTableH}>To</th>
          <th className={styles.listingSkuTableH}>Price</th>
        </tr>
      </thead>
      <tbody className={styles.listingSkuTableBody}>
        {vendorRangePrice.map((priceRange, index) => (
          <tr key={index} className={tableStyles.tableRow}>
            {/* <td>{index + 1}</td> */}
            <td>{priceRange.minUnits}</td>
            <td>{priceRange.maxUnits}</td>
            <td>${priceRange.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const columnHelper = createColumnHelper<VendorProductsModel>();

const columns = [
  columnHelper.display({
    id: "expander",
    cell: ({ row }) => (
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
  columnHelper.accessor("vendor", {
    header: () => <span>Vendor</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("vendorSku", {
    header: () => <span>Vendor Sku</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("perUnitCogs", {
    header: () => <span>Cost of Goods Sold (COGS)</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("minOrderQuantity", {
    header: () => <span>Min Order Qty</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("leadTime", {
    header: () => <span>Lead Time</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
];

interface VendorProductsTableProps {
  vendorProductsDataSubmit: (
    input: VendorProductsModel,
    index?: number
  ) => void;
  deleteVendorProduct: (index: number) => void;
}

export default function VendorProductsTable({
  vendorProductsDataSubmit,
  deleteVendorProduct,
}: VendorProductsTableProps) {
  const [vendorProducts, setVendorProducts] = useState<VendorProductsModel[]>(
    []
  );
  const rerender = useReducer(() => ({}), {})[1];

  const [showAddVendorProduct, setShowAddVendorProduct] = useState(false);
  const [showEditVendorProduct, setShowEditVendorProduct] = useState(false);

  const productToEdit = useContext(ProductContext);

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [cogsDefaultRowId, setCogsDefaultRowId] = useState<string | null>(null);

  const { register, control, handleSubmit, reset, watch, setValue } =
    useForm<VendorProductsModel>({
      defaultValues: {
        vendor: "",
        vendorSku: "",
        minOrderQuantity: "",
        leadTime: "",
        vendorRangePrice: [],
      },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "vendorRangePrice",
  });
  const priceRanges = watch("vendorRangePrice");

  useEffect(() => {
    if (priceRanges.length > 0) {
      const maxPrice = Math.max(
        ...priceRanges.map((priceRange) => parseFloat(priceRange.price) || 0)
      ).toString();
      setValue("perUnitCogs", maxPrice);
    }
  }, [priceRanges]);
  useEffect(() => {
    setCogsDefaultRowId(productToEdit?.product?.vendorProductCogsDefaultRow ?? null);
    setVendorProducts(
      productToEdit?.product?.productVendorProducts
        ? productToEdit?.product?.productVendorProducts.map((vp) => {
            if (vp.vendorRangePrice.length > 0) {
              const maxPrice = Math.max(
                ...vp.vendorRangePrice.map(
                  (priceRange) => parseFloat(priceRange.price) || 0
                )
              ).toString();

              vp.perUnitCogs = maxPrice;
            }
            return vp;
          })
        : []
    );
  }, [productToEdit]);
  useEffect(() => {
    if (showEditVendorProduct) {
      reset(vendorProducts[+selectedRowId!]);
    }
  }, [showEditVendorProduct]);

  const table = useReactTable({
    data: vendorProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const priceRangeColumnHelper = createColumnHelper<PriceRange>();
  const priceRangeColumns = [
    priceRangeColumnHelper.accessor("minUnits", {
      header: () => <span>From Qty</span>,
      cell: (info) => <i>{info.getValue()}</i>,
    }),
    priceRangeColumnHelper.accessor("maxUnits", {
      header: () => <span>To Qty</span>,
      cell: (info) => <i>{info.getValue()}</i>,
    }),
    priceRangeColumnHelper.accessor("price", {
      header: () => <span>Cost</span>,
      cell: (info) => <i>{info.getValue()}</i>,
    }),
    priceRangeColumnHelper.display({
      id: "remove",
      cell: ({ row }) => (
        <button
          className={vendorProductStyles.removeButton}
          type="button"
          onClick={() => remove(row.index)}
          aria-label="Toggle Row Expanded"
        >
          X
        </button>
      ),
    }),
  ];

  const priceRangeTable = useReactTable({
    data: fields,
    columns: priceRangeColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (input: VendorProductsModel) => {
    if (showEditVendorProduct && editRowId !== null) {
      vendorProductsDataSubmit(input, +editRowId);
      setVendorProducts((currentData) => {
        const newData = [...currentData!];
        newData[+editRowId!] = input;
        return newData;
      });
      setEditRowId(null);
    } else {
      vendorProductsDataSubmit(input);
      setVendorProducts((currentData) => {
        return currentData ? [...currentData, input] : [input];
      });
    }
    setShowAddVendorProduct(false);
    setShowEditVendorProduct(false);
    reset({
      vendor: "",
      vendorSku: "",
      minOrderQuantity: "",
      leadTime: "",
      vendorRangePrice: [],
    });
  };

  const [newPriceRange, setNewPriceRange] = useState<PriceRange>({
    minUnits: "",
    maxUnits: "",
    price: "",
  });
  const addPriceRange = () => {
    append(newPriceRange);
    setNewPriceRange({ minUnits: "", maxUnits: "", price: "" });
  };
  const swapCogsDefaultRow = () => {
    if(productToEdit && productToEdit.product) {
      const updatedProduct = {
        ...productToEdit.product,
        cogsDefaultRowId: selectedRowId,
      }
      productToEdit?.setProduct(updatedProduct);
    }
  }

  return (
    <div>
      <div className={styles.buttonRow}>
        <Button
          onClick={() => setShowAddVendorProduct(true)}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>NEW VENDOR PRODUCT</b>
        </Button>
        <Button
          onClick={() => {
            setShowEditVendorProduct(true);
            setEditRowId(selectedRowId);
          }}
          disabled={!selectedRowId}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>EDIT</b>
        </Button>
        <Button
          onClick={() => {
            setVendorProducts((vProducts) =>
              vProducts.filter((_, idx) => idx !== +selectedRowId!)
            );
            deleteVendorProduct(+selectedRowId!);
          }}
          disabled={!selectedRowId}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>DELETE</b>
        </Button>
        <Button
          onClick={swapCogsDefaultRow}
          disabled={!selectedRowId}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>Set as Default COGS</b>
        </Button>
      </div>
      <div className={styles.scrollableTableContainer}>
        <table className={`${tableStyles.vendorProductTable}`}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={styles.tableRow} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.listingSkuTableH}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={styles.listingSkuTableBody}>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  className={`${tableStyles.tableRow} ${
                    row.id === cogsDefaultRowId ? tableStyles.cogsDefaultSelected : row.id === selectedRowId ? tableStyles.selected : ""
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
                      <ExpandedRowContent
                        vendorRangePrice={row.original.vendorRangePrice}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {showAddVendorProduct && (
        <Modal
          show
          onHide={() => setShowAddVendorProduct(false)}
          centered
          className={vendorProductStyles.vendorProductModal}
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title>Add Vendor Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className={vendorProductStyles.vendorProductForm}>
              <div className={vendorProductStyles.vendorProductGridContainer}>
                <div className={vendorProductStyles.item1}>
                  <label>Vendor</label>
                  <input type="text" {...register("vendor")}></input>
                  <label>Vendor Sku</label>
                  <input type="text" {...register("vendorSku")}></input>
                  <label>Min Order Quantity</label>
                  <input type="text" {...register("minOrderQuantity")}></input>
                  <label>Lead Time</label>
                  <input type="text" {...register("leadTime")}></input>
                </div>
                <div
                  className={`${vendorProductStyles.item2} ${vendorProductStyles.priceRangeContainer}`}
                >
                  <label>From:</label>
                  <input
                    type="text"
                    value={newPriceRange.minUnits}
                    onChange={(e) =>
                      setNewPriceRange((prevState) => ({
                        ...prevState,
                        minUnits: e.target.value,
                      }))
                    }
                  />
                  <label>To:</label>
                  <input
                    type="text"
                    value={newPriceRange.maxUnits}
                    onChange={(e) =>
                      setNewPriceRange((prevState) => ({
                        ...prevState,
                        maxUnits: e.target.value,
                      }))
                    }
                  />
                  <label>Price:</label>
                  <input
                    type="text"
                    value={newPriceRange.price}
                    onChange={(e) =>
                      setNewPriceRange((prevState) => ({
                        ...prevState,
                        price: e.target.value,
                      }))
                    }
                  />
                  <button type="button" onClick={addPriceRange}>
                    Add
                  </button>
                  <div className={vendorProductStyles.priceRangeTableContainer}>
                    <table className={vendorProductStyles.priceRangeTable}>
                      <thead>
                        {/* Render headers */}
                        {priceRangeTable
                          .getHeaderGroups()
                          .map((headerGroup) => (
                            <tr key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                <th
                                  key={header.id}
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {header.column.getIsSorted() === "asc"
                                    ? "🔼"
                                    : header.column.getIsSorted() === "desc"
                                    ? "🔽"
                                    : null}
                                </th>
                              ))}
                            </tr>
                          ))}
                      </thead>
                      <tbody>
                        {/* Render the rows of the table and their bodies */}
                        {priceRangeTable.getRowModel().rows.map((row) => (
                          <tr
                            key={row.id}
                            className={`${vendorProductStyles.tableRow} ${
                              row.id === selectedRowId ? styles.selected : ""
                            }`}
                            onClick={() =>
                              setSelectedRowId(
                                row.id === selectedRowId ? null : row.id
                              )
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <button onClick={handleSubmit(onSubmit)}>Submit</button>
            </form>
          </Modal.Body>
        </Modal>
      )}
      {showEditVendorProduct && (
        <Modal
          show
          onHide={() => {
            setShowEditVendorProduct(false);
            reset({
              vendor: "",
              vendorSku: "",
              minOrderQuantity: "",
              leadTime: "",
              vendorRangePrice: [],
            });
          }}
          centered
          className={vendorProductStyles.vendorProductModal}
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title>Edit Vendor Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className={vendorProductStyles.vendorProductForm}>
              <div className={vendorProductStyles.vendorProductGridContainer}>
                <div className={vendorProductStyles.item1}>
                  <label>Vendor</label>
                  <input type="text" {...register("vendor")}></input>
                  <label>Vendor Sku</label>
                  <input type="text" {...register("vendorSku")}></input>
                  <label>Min Order Quantity</label>
                  <input type="text" {...register("minOrderQuantity")}></input>
                  <label>Lead Time</label>
                  <input type="text" {...register("leadTime")}></input>
                </div>
                <div
                  className={`${vendorProductStyles.item2} ${vendorProductStyles.priceRangeContainer}`}
                >
                  <label>From:</label>
                  <input
                    type="text"
                    value={newPriceRange.minUnits}
                    onChange={(e) =>
                      setNewPriceRange((prevState) => ({
                        ...prevState,
                        minUnits: e.target.value,
                      }))
                    }
                  />
                  <label>To:</label>
                  <input
                    type="text"
                    value={newPriceRange.maxUnits}
                    onChange={(e) =>
                      setNewPriceRange((prevState) => ({
                        ...prevState,
                        maxUnits: e.target.value,
                      }))
                    }
                  />
                  <label>Price:</label>
                  <input
                    type="text"
                    value={newPriceRange.price}
                    onChange={(e) =>
                      setNewPriceRange((prevState) => ({
                        ...prevState,
                        price: e.target.value,
                      }))
                    }
                  />
                  <button type="button" onClick={addPriceRange}>
                    Add
                  </button>
                  <div className={vendorProductStyles.priceRangeTableContainer}>
                    <table className={vendorProductStyles.priceRangeTable}>
                      <thead>
                        {/* Render headers */}
                        {priceRangeTable
                          .getHeaderGroups()
                          .map((headerGroup) => (
                            <tr key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                <th
                                  key={header.id}
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {header.column.getIsSorted() === "asc"
                                    ? "🔼"
                                    : header.column.getIsSorted() === "desc"
                                    ? "🔽"
                                    : null}
                                </th>
                              ))}
                            </tr>
                          ))}
                      </thead>
                      <tbody>
                        {/* Render the rows of the table and their bodies */}
                        {priceRangeTable.getRowModel().rows.map((row) => (
                          <tr
                            key={row.id}
                            className={`${vendorProductStyles.tableRow} ${
                              row.id === selectedRowId ? styles.selected : ""
                            }`}
                            onClick={() =>
                              setSelectedRowId(
                                row.id === selectedRowId ? null : row.id
                              )
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <button onClick={handleSubmit(onSubmit)}>Submit</button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
