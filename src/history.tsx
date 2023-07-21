import React, { useEffect, useState } from 'react';

import './App.css';
import { historyprops } from './interfaces'
import {
    DataGridBody,
    DataGridRow,
    DataGrid,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridCell,
    TableCellLayout,
    TableColumnDefinition,
    createTableColumn,
    FluentProvider,
    webLightTheme,
    Link,
    Text,
    Button
  } from "@fluentui/react-components";
type ItemLabel = {
label: string
}

type historydatatype = {
    project: ItemLabel;
    jobname: ItemLabel;
    status: ItemLabel;
    excel_link: ItemLabel;
    id: ItemLabel;
    [key: string]: unknown
}


export const History: React.FunctionComponent<historyprops> = ({apiBase, showModal, waitingOnApi, pollApiTime}) => {

    const [historydata, setHistorydata] = useState<historydatatype[]>([]);
    const columns: TableColumnDefinition<historydatatype>[] = [
        createTableColumn<historydatatype>({
          columnId: "project",
          renderHeaderCell: () => {
            return (<><Text weight="bold">Project</Text></>);
          },
          renderCell: (item:any) => {
            return (
              <TableCellLayout>
                {item.project.label}
              </TableCellLayout>
            );
          },
        }),
        createTableColumn<historydatatype>({
            columnId: "jobname",
            renderHeaderCell: () => {
              return (<><Text weight="bold">Job Name</Text></>);
            },
            renderCell: (item:any) => {
              return (
                <TableCellLayout>
                  {item.jobname.label}
                </TableCellLayout>
              );
            },
          }),
          createTableColumn<historydatatype>({
            columnId: "status",
            renderHeaderCell: () => {
              return (<><Text weight="bold">Graphs</Text></>);
            },
            renderCell: (item) => {
              return (
                <TableCellLayout>
                  {(item.status.label==="complete") && 
                      <Button appearance="primary" 
                        onClick={()=>{
                          waitingOnApi.current=item.id.label
                          pollApiTime.current=1000
                          showModal()
                        }}
                        >Graphs</Button>


                  }
                </TableCellLayout>
              );
            },
          }),
          createTableColumn<historydatatype>({
            columnId: "excel_link",
            renderHeaderCell: () => {
              return "Summary";
            },
            renderCell: (item) => {
              return (
                <TableCellLayout>
                  {item.excel_link.label!=='' &&
                    <Link href={item.excel_link.label}>
                        Excel download
                    </Link>
            }
                </TableCellLayout>
              );
            },
          }),       
    ]



    useEffect(()=> {
        const pollapi = async () => {
          const response = await fetch(apiBase.concat("/history"));
            try {
              if (response.ok) {
                  const jsonresp = await response.json()

                  //console.log("api up", text);
                  setHistorydata(jsonresp)
                } else {
                  console.log("api down");
                }
              } catch (error) {
              console.error("api really down:", error);
            }
        //   apiPollerTimer.current=setTimeout(pollapi, 3000)
        }
        pollapi();
        // return () => {
        //   clearTimeout(apiPollerTimer.current)
        // }
        // eslint-disable-next-line
      }, [])
    

    return (
    <FluentProvider theme={webLightTheme}>
        <DataGrid
            items={historydata }
            columns={columns}
            getRowId={(item) => item.id.label}
        >
        <DataGridHeader>
            <DataGridRow>
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                     )}
            </DataGridRow>
        </DataGridHeader>
        <DataGridBody<historydatatype>>
            {({ item, rowId }) => (
            <DataGridRow<historydatatype>
                key={rowId}
            >
                {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
          </DataGridRow>       
                  )}
        </DataGridBody>         
        </DataGrid>

        
    </FluentProvider>)

}