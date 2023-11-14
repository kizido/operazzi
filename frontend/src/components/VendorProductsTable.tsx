import React, { useState, useReducer } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import styles from '../styles/Modal.module.css'
import tableStyles from '../styles/Table.module.css'
import { Button } from 'react-bootstrap'

type VendorProductsTableModel = {
    vendor: string
    vendorSku: string
    minOrderQuantity: number
    leadTime: number
    vendorRangePrice: PriceRange[]
}
type PriceRange = {
    minUnits: number,
    maxUnits: number,
    price: number,
}

const defaultData: VendorProductsTableModel[] = [
    {
        vendor: 'Davy',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 499, price: 2.20 },
            { minUnits: 500, maxUnits: 999, price: 2.10 },
            { minUnits: 1000, maxUnits: 2000, price: 2.00 },
        ],
    },
    {
        vendor: 'Sally',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 999, price: 3.50 },
            { minUnits: 1000, maxUnits: 4999, price: 3.20 },
            { minUnits: 5000, maxUnits: 9999, price: 2.80 },
        ],
    },
    {
        vendor: 'Peter',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Chris',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Michael',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Davy',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Sally',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Peter',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Chris',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Michael',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Davy',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Sally',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Peter',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Chris',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
    {
        vendor: 'Michael',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
        vendorRangePrice: [
            { minUnits: 1, maxUnits: 500, price: 2.20 }
        ],
    },
]
interface ExpandedRowContentProps {
    vendorRangePrice: PriceRange[],
}

const ExpandedRowContent = ({ vendorRangePrice }: ExpandedRowContentProps) => {
    return (
        <table className={`${styles.listingSkuTable} ${tableStyles.expandedRowTable}`}>
            <thead>
                <tr>
                    <th className={styles.listingSkuTableH}></th>
                    <th className={styles.listingSkuTableH}>From</th>
                    <th className={styles.listingSkuTableH}>To</th>
                    <th className={styles.listingSkuTableH}>Price</th>
                </tr>
            </thead>
            <tbody className={styles.listingSkuTableBody}>
                {vendorRangePrice.map((priceRange, index) => (
                    <tr key={index} className={tableStyles.tableRow}>
                        <td>{index + 1}</td>
                        <td>{priceRange.minUnits}</td>
                        <td>{priceRange.maxUnits}</td>
                        <td>${priceRange.price.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const columnHelper = createColumnHelper<VendorProductsTableModel>();

const columns = [
    columnHelper.display({
        id: 'expander',
        cell: ({ row }) => (
            <button
                type="button"
                onClick={() => row.toggleExpanded()}
                aria-label="Toggle Row Expanded"
            >
                {row.getIsExpanded() ? '-' : '+'} {/* Change the icon based on the row's expanded state */}
            </button>
        )
    }),
    columnHelper.accessor('vendor', {
        header: () => <span>Vendor</span>,
        cell: info => <i>{info.getValue()}</i>,
    }),
    columnHelper.accessor('vendorSku', {
        header: () => <span>Vendor Sku</span>,
        cell: info => <i>{info.getValue()}</i>,
    }),
    columnHelper.accessor('minOrderQuantity', {
        header: () => <span>Min Order Qty</span>,
        cell: info => <i>{info.getValue()}</i>
    }),
    columnHelper.accessor('leadTime', {
        header: () => <span>Lead Time</span>,
        cell: info => <i>{info.getValue()}</i>,
    }),
]

export default function VendorProductsTable() {

    const [data, setData] = useState(() => [...defaultData]);
    const rerender = useReducer(() => ({}), {})[1];

    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    })

    return (
        <div>
            <div className={styles.buttonRow}>
                <Button variant='outline-dark' className={styles.grayButton}><b>NEW VENDOR PRODUCT</b></Button>
                <Button disabled={!selectedRowId} variant='outline-dark' className={styles.grayButton}><b>EDIT</b></Button>
                <Button variant='outline-dark' className={styles.grayButton}><b>SHOW INACTIVE</b></Button>
            </div>
            <div className={styles.scrollableTableContainer}>
                <table className={`${tableStyles.vendorProductTable}`}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr className={styles.tableRow} key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className={styles.listingSkuTableH}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className={styles.listingSkuTableBody}>
                        {table.getRowModel().rows.map(row => (
                            <React.Fragment key={row.id}>
                                <tr
                                    className={`${tableStyles.tableRow} ${row.id === selectedRowId ? tableStyles.selected : ''}`}
                                    onClick={() => setSelectedRowId(row.id === selectedRowId ? null : row.id)}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                                {row.getIsExpanded() && (
                                    <tr>
                                        <td colSpan={row.getVisibleCells().length-1}>
                                            <ExpandedRowContent vendorRangePrice={row.original.vendorRangePrice} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
