/* eslint-disable react-hooks/incompatible-library */
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type { DataTableProps } from "./types";
import { useTableState } from "./hooks/useTableState";
import { useColumnWidths } from "./hooks/useColumnWidths";
import { useTableColumns } from "./hooks/useTableColumns";
import { useRowSelection } from "./hooks/useRowSelection";
import { TableLoading } from "./components/TableLoading";
import { TableHeader } from "./components/TableHeader";
import { TableHeaderRow } from "./components/TableHeaderRow";
import { TableBody } from "./components/TableBody";
import { DataTablePagination } from "./DataTablePagination";

/**
 * DataTable - Reusable table component with sorting, filtering, pagination, and row selection
 *
 * @example
 * <DataTable
 *   data={users}
 *   columns={userColumns}
 *   title="Users"
 *   enableRowSelection
 *   onRowSelectionChange={setSelectedUsers}
 * />
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  initialPageSize = 10,
  isLoading = false,
  enableColumnFilters = true,
  enableGlobalSearch = true,
  title,
  enableColumnResizing = false,
  onColumnSizingChange,
  pageSizeOptions = [5, 10, 20, 50],
  disableAutoSize = false,
  enableRowSelection = false,
  onRowSelectionChange,
  enableExport = false,
  onExport,
  toolbarButtons = [],
  stableHeight = false,
  stickyActions = true,
  enablePagination = true,
}: DataTableProps<T>) {
  // Initialize all state
  const tableState = useTableState(initialPageSize);
  const MIN_TABLE_HEIGHT = 300; // px (tweak if needed)

  // Calculate column widths
  const columnWidths = useColumnWidths(columns, data, disableAutoSize);

  // Build TanStack columns
  const tableColumns = useTableColumns(
    columns,
    actions,
    columnWidths,
    enableRowSelection,
    stickyActions,
  );

  // Initialize table
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting: tableState.sorting,
      columnFilters: tableState.columnFilters,
      globalFilter: tableState.globalFilter,
      pagination: tableState.pagination,
      ...(enableColumnResizing && { columnSizing: tableState.columnSizing }),
      ...(enableRowSelection && { rowSelection: tableState.rowSelection }),
    },
    onSortingChange: tableState.setSorting,
    onColumnFiltersChange: tableState.setColumnFilters,
    onGlobalFilterChange: tableState.setGlobalFilter,
    onPaginationChange: tableState.setPagination,
    ...(enableColumnResizing && {
      onColumnSizingChange: onColumnSizingChange || tableState.setColumnSizing,
      columnResizeMode: "onChange" as const,
      enableColumnResizing: true,
    }),
    ...(enableRowSelection && {
      onRowSelectionChange: tableState.setRowSelection,
      enableRowSelection: true,
    }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Handle row selection changes
  useRowSelection(
    table,
    tableState.rowSelection,
    enableRowSelection,
    onRowSelectionChange,
  );

  // Show loading state
  if (isLoading) {
    return <TableLoading />;
  }

  return (
    <div className="w-full">
      {/* Header with title and search */}
      <TableHeader
        title={title}
        enableGlobalSearch={enableGlobalSearch}
        globalFilter={tableState.globalFilter}
        onGlobalFilterChange={tableState.setGlobalFilter}
        enableExport={enableExport}
        onExport={onExport}
        toolbarButtons={toolbarButtons}
      />

      {/* Table */}
      <div className="rounded-md border bg-background overflow-x-auto" style={
        stableHeight
          ? { minHeight: `${MIN_TABLE_HEIGHT}px` }
          : undefined
      }>
        <table className="w-full caption-bottom text-sm">
          <TableHeaderRow
            table={table}
            columns={columns}
            enableColumnFilters={enableColumnFilters}
            enableColumnResizing={enableColumnResizing}
            disableAutoSize={disableAutoSize}
            stickyActions={stickyActions}
          />
          <TableBody table={table} columns={columns} enableColumnResizing={enableColumnResizing} stickyActions={stickyActions} />
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <DataTablePagination
          totalItems={table.getFilteredRowModel().rows.length}
          pageSize={tableState.pagination.pageSize}
          currentPage={tableState.pagination.pageIndex + 1}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onPageSizeChange={(size) => table.setPageSize(size)}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}

/* ========================================
 * DATATABLE USAGE REFERENCE EXAMPLES
 * ========================================
 * 
 * // Basic Usage - Minimal Required Props
 * <DataTable
 *   data={users}                    // Required: Array of data objects
 *   columns={userColumns}           // Required: Column definitions array
 * />
 * 
 * // Full Usage - All Props with Optional Markers
 * <DataTable
 *   data={users}                              // Required: Array of data objects
 *   columns={userColumns}                     // Required: Column definitions array
 *   actions={{                                // Optional: Action buttons config
 *     header: "Actions",                      // Optional: Actions column header
 *     width: "120px",                         // Optional: Actions column width
 *     items: [                                // Required if actions provided
 *       {
 *         icon: <EditIcon />,                 // Required: Action icon
 *         label: "Edit",                      // Required: Action tooltip/label
 *         onClick: (row) => handleEdit(row),  // Required: Click handler
 *         hide: (row) => !row.canEdit         // Optional: Conditional hide function
 *       }
 *     ]
 *   }}
 *   rowKey="id"                               // Optional: Row key field (default: 'id')
 *   initialPageSize={20}                      // Optional: Initial page size (default: 10)
 *   isLoading={false}                         // Optional: Loading state (default: false)
 *   enableColumnFilters={true}                // Optional: Show column filters (default: true)
 *   enableGlobalSearch={true}                 // Optional: Show global search (default: true)
 *   title="User Management"                   // Optional: Table title
 *   enableColumnResizing={false}              // Optional: Enable column resizing (default: false)
 *   onColumnSizingChange={handleResize}       // Optional: Column resize callback
 *   pageSizeOptions={[10, 25, 50, 100]}      // Optional: Page size options (default: [5, 10, 20, 50])
 *   disableAutoSize={false}                   // Optional: Disable auto-sizing (default: false)
 *   enableRowSelection={true}                 // Optional: Enable row selection (default: false)
 *   onRowSelectionChange={setSelectedRows}    // Optional: Row selection callback
 *   enableExport={true}                       // Optional: Enable export button - DEPRECATED, use toolbarButtons
 *   onExport={handleExport}                   // Optional: Export callback - DEPRECATED, use toolbarButtons
 *   toolbarButtons={[                         // Optional: Toolbar buttons (top-right of table)
 *     {
 *       icon: <ThumbsUp />,                   // Required: Button icon
 *       label: "Select All",                  // Required: Button label
 *       onClick: handleSelectAll,             // Required: Click handler
 *       variant: "default",                   // Optional: Button variant (default: "default")
 *       className: "bg-green-600 hover:bg-green-700", // Optional: Custom styling
 *       hide: false,                          // Optional: Conditional hide
 *       disabled: false                       // Optional: Disabled state
 *     },
 *     {
 *       icon: <RotateCcw />,
 *       label: "Reset All",
 *       onClick: handleResetAll,
 *       variant: "outline",
 *       className: "border-red-500 text-red-600"
 *     },
 *     {
 *       icon: <FileDown />,
 *       label: "Export",
 *       onClick: handleExport,
 *       variant: "outline",
 *       className: "border-blue-600 text-blue-600"
 *     }
 *   ]}
 * />
 * 
 * // Column Definition Examples
 * const userColumns: ColumnDef<User>[] = [
 *   {
 *     key: "name",                            // Required: Data object key
 *     header: "Full Name",                    // Required: Column header text
 *     width: 200,                             // Optional: Fixed width in px
 *     align: "left",                          // Optional: Text alignment (default: "left")
 *     sortable: true,                         // Optional: Enable sorting (default: true)
 *     render: (value, row) => <CustomCell />, // Optional: Custom cell renderer
 *     minWidth: 100,                          // Optional: Min width for auto-sizing (default: 80px)
 *     maxWidth: 300,                          // Optional: Max width for auto-sizing (default: 400px)
 *     visible: true,                          // Optional: Column visibility (default: true)
 *     clickable: false                        // Optional: Make cell clickable with green color (default: false)
 *   }
 * ];
 * 
 * // Dynamic Actions Example
 * actions={{
 *   header: "Actions",                        // Optional: Actions column header
 *   width: "150px",                           // Optional: Actions column width
 *   items: (row) => [                         // Function returning actions per row
 *     {
 *       icon: <EditIcon />,
 *       label: "Edit User",
 *       onClick: () => handleEdit(row),
 *       hide: !row.permissions.canEdit        // Optional: Hide based on row data
 *     },
 *     {
 *       icon: <DeleteIcon />,
 *       label: "Delete User",
 *       onClick: () => handleDelete(row),
 *       hide: !row.permissions.canDelete      // Optional: Hide based on row data
 *     }
 *   ]
 * }}
 */
