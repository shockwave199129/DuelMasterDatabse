"use client"
import TopNav from "@/shared/topNav";
import Footers from "@/shared/footer";
import Api from "@/shared/api";
import DeckDeatail from "./details";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";

export default function Decklist() {

    const [decks, setDecks] = useState([]);
    var [dataTableColumns, setDataTableColumns] = useState([]);
    var [dataTableData, setDataTableData] = useState([]);

    const [showDeckDeatils, setShowDeckDeatils] = useState(false);
    const [deckDeatails, setDeckDeatails] = useState({});

    var [isLoad, setIsload] = useState(false)

    const cookies = new Cookies()
    var { push, refresh} = new useRouter()

    function showCardDeatils(row) {
        Swal.fire({
            title: "Loading...",
            text: "Please wait while we getting Deck Deatils",
            showConfirmButton: false,
            allowOutsideClick: false
        });
        async function fetchDeckData() {
            try {
                const decksDetailResponse = await Api().validateGet('deck-details/' + row.id);
                setDeckDeatails(decksDetailResponse);
                return Promise.resolve();
            } catch (error) {
                console.error(error);
                return Promise.reject(error);
            }
        }
        fetchDeckData().then(() => {
            setShowDeckDeatils(true)
            Swal.close();
        }).catch((error) => {
            console.error(error);
            Swal.close();
        })
    }

    const handleSearch = (value) => {
        let filteredData = decks.filter((item) =>
            item.deck_name.toLowerCase().includes(value.toLowerCase())
        )
        setDataTableData(filteredData)
    };

    function letsCreateDeck() {
        push('createdeck')
    }

    useEffect(() => {
        let auth = cookies.get('dm_a_token');

        if (typeof auth == 'undefined') {
            Swal.fire({
                text: 'Kindly Login to view this page',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    push('auth?redirect_to=decklist')
                }
            })
        } else {
            Swal.fire({
                title: "Loading...",
                text: "Please wait while we load the data",
                showConfirmButton: false,
                allowOutsideClick: false
            });
            async function fetchData() {
                try {
                    const decksResponse = await Api().validateGet('decks');
                    setDecks(decksResponse);
                    setDataTableData(decksResponse)
                    return Promise.resolve();
                } catch (error) {
                    console.error(error);
                    return Promise.reject(error);
                }
            }
            fetchData().then(
                () => {
                    setDataTableColumns([
                        {
                            name: 'Name',
                            selector: row => row.deck_name,
                            wrap: true,
                        },
                        {
                            name: 'Info',
                            selector: row => row.deck_info,
                            allowOverflow: false,
                            wrap: true,
                            maxWidth: '550px'
                        },
                        {
                            name: "Creator",
                            selector: row => row.user_info
                        }
                    ])
                    Swal.close();
                }).catch((error) => {
                    console.error(error);
                    Swal.close();
                })
        }
    }, [isLoad])

    return (
        <>
            <TopNav />
            <section className="inner-page" style={{ paddingTop: "89px", minHeight: "calc(100vh - 81px)" }}>
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <div className="card-header">
                                <div className="d-flex justify-content-between">
                                    <div className="col-md-6 col-12 row">
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            className="form-control"
                                            onChange={(e) => handleSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 col-12 text-end">
                                        <button className="btn btn-primary" type="button" onClick={letsCreateDeck}>Create Deck</button>
                                    </div>
                                </div>
                            </div>
                            <DataTable
                                columns={dataTableColumns}
                                data={dataTableData}
                                onRowClicked={showCardDeatils}
                                pagination
                                fixedHeader
                                highlightOnHover
                                responsive
                                striped
                                pointerOnHover
                                title={'Deck Lists'}
                                customStyles={{
                                    headCells: {
                                        style: {
                                            fontWeight: 'bold',
                                            backgroundColor: '#9e9e9e',
                                            fontSize: '15px',
                                        },
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>
            {showDeckDeatils && <DeckDeatail DeckData={deckDeatails} eventHandeler={setShowDeckDeatils} update={setIsload} />}
            <Footers />
        </>
    )
}