import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import mData from './MOCK_DATA.json';
import { useEffect, useMemo, useState } from 'react';
import { IconButton } from '@mui/material';
import { IconCirclePlus } from '@tabler/icons-react';
import { Form } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import AddEditProductDialog from './AddEditProductDialog';
import { Product as ProductModel } from '../models/product';
import { ColumnDef } from '@tanstack/react-table';
import * as ProductsApi from "../network/products_api";
import styles from "../styles/Table.module.css";

export default function ProductTable() {

    /** @type import('@tanstack/react-table').ColumnDef<any>*/
    const columns: ColumnDef<ProductModel>[] = [
        {
            header: 'Product Name',
            accessorKey: 'name',
            footer: 'Product Name',
        },
        {
            header: 'Product Sku',
            accessorKey: 'productSku',
            footer: 'Product Sku',
        },
        {
            header: 'Barcode',
            accessorKey: 'barcodeUpc',
            footer: 'Barcode',
        },
        {
            header: 'Weight',
            accessorKey: 'weight',
            footer: 'Weight',
        },
        {
            header: 'Brand',
            accessorKey: 'brand',
            footer: 'Brand',
        },
        {
            header: 'Category',
            accessorKey: 'category',
            footer: 'Category',
        },
        // {
        //     header: 'Description',
        //     accessorKey: 'description',
        //     footer: 'Description',
        // },
        {
            header: 'COGS',
            accessorKey: 'cogs',
            footer: 'COGS',
        },
        {
            header: 'Dimensions',
            accessorKey: 'dimensions',
            footer: 'Dimensions',
        },
        {
            header: 'Packaging Costs',
            accessorKey: 'packagingCosts',
            footer: 'Packaging Costs',
        },
        {
            header: 'Domestic Shipping Costs',
            accessorKey: 'domesticShippingCosts',
            footer: 'Domestic Shipping Costs',
        },
        {
            header: 'International Shipping Costs',
            accessorKey: 'internationalShippingCosts',
            footer: 'International Shipping Costs',
        },
        {
            header: 'Duties And Tariffs',
            accessorKey: 'dutiesAndTariffs',
            footer: 'Duties And Tariffs',
        },
        {
            header: 'Pick And Pack Fee',
            accessorKey: 'pickAndPackFee',
            footer: 'Pick And Pack Fee',
        },
        {
            header: 'Amazon Referral Fee',
            accessorKey: 'amazonReferralFee',
            footer: 'Amazon Referral Fee',
        },
        {
            header: 'OPEX',
            accessorKey: 'opex',
            footer: 'OPEX',
        },
        {
            header: "Activated",
            accessorKey: 'active',
            cell: ({ row }: { row: any }) => (  // TypeScript type annotation added here
                <div>
                    <button onClick={() => setProductToEdit(row.original)}>
                        Edit
                    </button>
                    {/* <button onClick={() => deleteProduct(row.original)}>
                        Delete
                    </button> */}
                    <button onClick={() => toggleActivateProduct(row.original)}>
                        {showOnlyActivated ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            ),
        },

    ]

    const [data, setData] = useState<ProductModel[]>([]);
    const [showOnlyActivated, setShowOnlyActivated] = useState(true);


    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const [productsLoading, setProductsLoading] = useState(true);
    const [showProductsLoadingError, setShowProductsLoadingError] = useState(false);

    const [productToEdit, setProductToEdit] = useState<ProductModel | null>(null);
    const [showAddProductDialog, setShowAddProductDialog] = useState(false);

    const filteredData = useMemo(() => {
        return showOnlyActivated
            ? data.filter(product => product.activated)
            : data.filter(product => !product.activated)
    }, [data, showOnlyActivated]);
    // Sets states for sorting and searching/filtering of the table
    const [sorting, setSorting] = useState([
        // Initial state of table sorting is ascending order by product name
        { id: "name", desc: false }
    ])
    const [filtering, setFiltering] = useState('')

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        sortDescFirst: false,
    })

    useEffect(() => {
        async function loadProducts() {
            try {
                setShowProductsLoadingError(false);
                setProductsLoading(true);
                const products = await ProductsApi.fetchProducts();
                setData(products);
            } catch (error) {
                console.error(error);
                setShowProductsLoadingError(true);
            }
            finally {
                setProductsLoading(false);
            }
        }
        loadProducts();
    }, []);

    async function deleteProduct(product: ProductModel) {
        try {
            await ProductsApi.deleteProduct(product._id);
            setData(data.filter(existingProduct => existingProduct._id !== product._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function toggleActivateProduct(product: ProductModel) {
        try {
            const toggledProduct = await ProductsApi.toggleActivateProduct(product);
            setData(data.map(existingProduct => existingProduct._id === toggledProduct._id ? toggledProduct : existingProduct));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return <div>
        <input
            type='checkbox'
            checked={showOnlyActivated}
            onChange={(e) => setShowOnlyActivated(e.target.checked)}
            className={styles.activatedCheckbox}></input>
        <div className="w3-container">
            {/* Creates global search bar for table */}
            <input type="text" value={filtering} onChange={e => setFiltering(e.target.value)} placeholder='Search...' />
            <table className={styles.productTable}>
                <thead>
                    {/* Render headers */}
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                {flexRender(header.column.columnDef.header,
                                    header.getContext()
                                )}
                                {
                                    header.column.getIsSorted() === 'asc' ? '🔼' : header.column.getIsSorted() === 'desc' ? '🔽' : null
                                }

                            </th>)}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {/* Render the rows of the table and their bodies */}
                    {table.getRowModel().rows.map(row => (
                        <
                            tr key={row.id}
                            className={`${styles.tableRow} ${row.id === selectedRowId ? styles.selected : ''}`}
                            onClick={() => setSelectedRowId(row.id === selectedRowId ? null : row.id)}
                        >
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Render pagination guiding */}
            <div>
                <button onClick={() => table.setPageIndex(0)}>First Page</button>
                <button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>Previous Page</button>
                <button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Next Page</button>
                <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>Last Page</button>
            </div>
            <IconButton onClick={() => setShowAddProductDialog(true)}>
                <IconCirclePlus size={50} stroke={3} color='#2fb344'></IconCirclePlus>
            </IconButton>
            {showAddProductDialog &&
                <AddEditProductDialog
                    onDismiss={() => setShowAddProductDialog(false)}
                    onProductSaved={(newProduct) => {
                        setData([...data, newProduct]);
                        setShowAddProductDialog(false);
                    }}
                />
            }
            {productToEdit &&
                <AddEditProductDialog
                    productToEdit={productToEdit}
                    onDismiss={() => setProductToEdit(null)}
                    onProductSaved={(updatedProduct) => {
                        setData(data.map(existingProduct => existingProduct._id === updatedProduct._id ? updatedProduct : existingProduct));
                        setProductToEdit(null);
                    }}
                />
            }
        </div>
    </div>
}