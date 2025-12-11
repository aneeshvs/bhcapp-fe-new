'use client';
import 'mantine-datatable/styles.css';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import { DataTable  } from 'mantine-datatable';
import React from 'react';



/* eslint-disable */
interface ChildProps {
    listData: {
        current_page: number,
        data: any[],
        first_page_url: string,
        from: number|null,
        last_page: number|null,
        last_page_url: string,
        links:any[],
        next_page_url:string|null,
        per_page:number,
        to:number|null,
        total:number,
        page:number
    },
    onPageChange: (newPage: number) => void;
    onPerPageChange?: (newPerPage: number) => void;
    columnData:any[];
  }
/* eslint-enable */


const ListComponents = ({ listData, columnData, onPageChange}: ChildProps) => {
    return (
        <div className="datatables pagination-padding">
            <DataTable
                className="table-hover whitespace-nowrap"
                records={listData.data}
                columns={columnData}
                highlightOnHover
                totalRecords={listData.total}
                recordsPerPage={listData.per_page}
                page={listData.current_page}
                onPageChange={onPageChange}
                //onPageChange={(p) => setPage(p)}
                // recordsPerPageOptions={PAGE_SIZES}
                // onRecordsPerPageChange={setPageSize}
                paginationText={({ from, to, totalRecords }) =>
                    `Showing ${from} to ${to} of ${totalRecords} entries` // Fixed parameter names
                }
            />
        </div>
    );
};

export default ListComponents;
