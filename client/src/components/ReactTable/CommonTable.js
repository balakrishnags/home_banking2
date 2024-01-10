import React, { useEffect, useMemo, useState } from "react";
import {
    useGlobalFilter,
    useTable,
    usePagination,
    useFilters,
} from "react-table";
import { TableNavigation } from "../../utils/TableNavigation";
import { GlobalFilter } from "../../utils/GlobalFilter";

export const CommonTable = (props) => {
    const { propColumns, propData, isVisible } = props
    const [fieldData, setFieldData] = useState([]);

    useEffect(() => {
        setFieldData(propData || [])
    }, [propData])

    const columns = propColumns;
    const data = useMemo(() => fieldData);


    const {
        tableInstance,
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state,
        setGlobalFilter,
        gotoPage,
        pageCount,
        setPageSize,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useFilters,
        usePagination
    );

    const { globalFilter, pageSize, pageIndex } = state;

    return (
        <>
            {!isVisible && <div className="mt-4 mb-2 d-flex justify-content-between">
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                <div>
                    <select
                        id="tablenumber"
                        value={pageSize}
                        className="selectTag"
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        <option value="" disabled>
                            Select
                        </option>
                        {[5, 10, 15, 25, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>}
            <div className="text-center table_scroll">
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {!isVisible && <div className="text-center">
                <TableNavigation pageIndex={pageIndex} gotoPage={gotoPage} previousPage={previousPage}
                    nextPage={nextPage} pageCount={pageCount} canNextPage={canNextPage} canPreviousPage={canPreviousPage} />
            </div>}
        </>
    );
};
