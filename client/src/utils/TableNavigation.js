import React from 'react'
import "../style/tableStyle.scss"

export const TableNavigation = (props) => {
    const { pageIndex, gotoPage, previousPage, nextPage, pageCount, canNextPage, canPreviousPage } = props
    return (
        <div className="tablenav">
            <button
                id='skiptobtn1'
                className="mx-1 skipToBtn"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
            >
                {"<<"}
            </button>
            <button
                id='prevbtn'
                className="mx-1 actionBtn"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
            >
                Prev
            </button>
            <span className="mx-2 pageNumber">
                <strong>{pageIndex + 1}</strong>{" "}
            </span>
            <button
                id='nextbtn'
                className="mx-1 actionBtn"
                onClick={() => nextPage()}
                disabled={!canNextPage}
            >
                Next
            </button>
            <button
                id='skiptobtn2'
                className="skipToBtn"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
            >
                {">>"}
            </button>
        </div>
    )
}
