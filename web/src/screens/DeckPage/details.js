"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { Tooltip } from 'react-tooltip'
import Swal from "sweetalert2";
import Api from "@/shared/api";

import 'react-tooltip/dist/react-tooltip.css'
import './modal.css';

export default function DeckDeatail(props) {

    var { push } = new useRouter()
    var [dataTableColumns, setDataTableColumns] = useState([]);
    var [dataTableData, setDataTableData] = useState([]);

    useEffect(() => {
        var deckCardInfo = []
        if ('deck_details' in props.DeckData) {
            deckCardInfo = props.DeckData.deck_details
        }
        var tableData = []
        Object.values(deckCardInfo).map(value => {
            let tmp = {}
            tmp['count'] = value.deck_card_count
            tmp['name'] = value.deck_card_details.name
            tmp['civilization'] = value.deck_card_details.civilization
            tmp['cardtype'] = value.deck_card_details.cardtype
            tmp['manacost'] = value.deck_card_details.manacost
            tmp['text'] = value.deck_card_details.englishtext
            tableData.push(tmp)
        })

        setDataTableData(tableData)
        setDataTableColumns([
            {
                name: 'Name',
                selector: row => row.name,
                wrap: true,
                cell: (row) => <span data-tooltip-id='card-tooltip' data-tooltip-content={row.text}>{row.name}</span>,
            },
            {
                name: 'Civilization',
                selector: row => row.civilization,
                allowOverflow: false,
                wrap: true,
                maxWidth: '200px',
            },
            {
                name: 'Type',
                selector: row => row.cardtype,
                allowOverflow: false,
                wrap: true,
                maxWidth: '200px',
            },
            {
                name: 'Cost',
                selector: row => row.manacost,
                allowOverflow: false,
                wrap: true,
                maxWidth: '100px',
            },
            {
                name: 'Count',
                selector: row => row.count,
                allowOverflow: false,
                wrap: true,
                maxWidth: '100px',
            },
        ])
    }, [])

    function handleCardDeatailClick() {
        props.eventHandeler(false)
    }

    function toDeckEditPage() {
        push('createdeck/' + props.DeckData.id)
    }

    function deleteDeck() {
        async function deleteDeckData() {
            try {
                const decksDetailResponse = await Api().validateGet('delete-deck/' + props.DeckData.id);
                return Promise.resolve();
            } catch (error) {
                console.error(error);
                return Promise.reject(error);
            }
        }
        debugger
        Swal.fire({
            title: "Deleting...",
            text: "Please wait while we delete Deck Deatils",
            showConfirmButton: false,
            allowOutsideClick: false
        });
        deleteDeckData().then(() => {
            props.eventHandeler(false)
            props.update(true)
            Swal.close();
        }).catch((error) => {
            console.error(error);
            Swal.close();
        })
    }

    return (
        <>
            <div className="modal">
                <article className="modal-container border">
                    <header className="modal-container-header">
                        <div className="col-11 d-flex align-items-center">
                            <h3 className="modal-container-title">{props.DeckData.deck_name}</h3>
                            <span className="small ms-2">{props.DeckData.deck_info}</span>
                        </div>
                        <i
                            className='bi bi-x-square-fill'
                            style={{ "fontSize": "25px", "padding": "0px 20px", "cursor": "pointer" }}
                            onClick={(event) => {
                                event.preventDefault();
                                handleCardDeatailClick();
                            }}
                        ></i>
                    </header>
                    <div className="modal-container-subtitle">
                        <div>
                            <span className="badge bg-primary" style={{ fontWeight: "400" }}>{props.DeckData.user_info}</span>
                            {props.DeckData.is_private && <i className="bi bi-lock-fill" style={{ color: "burlywood" }}></i>}
                        </div>
                        {props.DeckData.is_editable &&
                            <>
                                <div>
                                    <button type="button" onClick={toDeckEditPage} className="badge btn-primary btn me-2">Edit</button>
                                    <button type="button" onClick={deleteDeck} className="badge btn-danger btn me-4">Delete</button>
                                </div>
                            </>
                        }
                    </div>
                    <section className="modal-container-body">
                        <Tooltip id="card-tooltip" className="col-10 col-md-4" style={{ zIndex: "99999" }} />
                        <DataTable
                            columns={dataTableColumns}
                            data={dataTableData}
                            responsive
                            striped
                            pointerOnHover
                            className="border"
                            customStyles={{
                                headCells: {
                                    style: {
                                        fontWeight: 'bold',
                                        backgroundColor: '#9e9e9e',
                                        fontSize: '15px',
                                    },
                                },
                                rows: {
                                    style: {
                                        border: '1px solid black',
                                        borderCollapse: 'collapse'
                                    }
                                }
                            }}
                        />
                    </section>
                    <section className="modal-container-footer"></section>
                </article>
            </div>
        </>
    )
}