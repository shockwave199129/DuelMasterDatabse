"use client"
import TopNav from "@/shared/topNav";
import Footers from "@/shared/footer";
import Api from "@/shared/api";
import './style.css'

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import $ from 'jquery';

export default function SearchPage() {

    const [civilizations, setCivilizations] = useState([]);
    const [races, setRaces] = useState([]);
    const [manacosts, setManacosts] = useState([]);
    const [power, setPower] = useState([]);
    const [cardtypes, setCardtypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sets, setSets] = useState([]);
    const [searchParams, setSearchParams] = useState({
        name: '',
        civilization: '',
        race: '',
        cost: '',
        power: '',
        text: '',
        cardtype: '',
        category: '',
        ocg_set: '',
        sort_by: 'name',
        sort_order: 'asc',
    });
    const [searchResults, setSearchResults] = useState([]);

    var [dataTableColumns, setDataTableColumns] = useState([]);
    var [dataTableData, setDataTableData] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailsCradId, setDetailsCardId] = useState({});
    const [cardDetail, setCardDetail] = useState({});

    useEffect(() => {
        Swal.fire({
            title: "Loading...",
            text: "Please wait while we load the data",
            showConfirmButton: false,
            allowOutsideClick: false
        });
        async function fetchData() {
            try {
                const civilizationResponse = await Api().get('get-civilization');
                setCivilizations(civilizationResponse.data);

                const raceResponse = await Api().get('get-race');
                setRaces(raceResponse.data);

                const manacostResponse = await Api().get('get-manacost');
                setManacosts(manacostResponse.data);

                const powerResponse = await Api().get('get-power');
                setPower(powerResponse.data);

                const cardtypeResponse = await Api().get('get-cardtype');
                setCardtypes(cardtypeResponse.data);

                const categoryResponse = await Api().get('get-category');
                setCategories(categoryResponse.data);

                const setResponse = await Api().get('get-set');
                setSets(setResponse.data);

                return Promise.resolve();
            } catch (error) {
                console.error(error);
                return Promise.reject(error);
            }
        }
        fetchData().then(
            () => {
                Swal.close();
            }).catch((error) => {
                console.error(error);
                Swal.close();
            })
    }, []);

    const handleInputChange = (event) => {
        setSearchParams((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };


    const handleFormSubmit = async (event) => {
        event.preventDefault();
        Swal.fire({
            title: "Searching...",
            text: "Please wait while we search data",
            showConfirmButton: false,
            allowOutsideClick: false
        });
        const response = await Api().get('card-search', searchParams);
        setSearchResults(response.data);

        setDataTableColumns([
            {
                name: 'Name',
                selector: row => row.name,
                wrap: true,
            },
            {
                name: 'Civilization',
                selector: row => row.civilization,
                allowOverflow: false,
                wrap: true,
                maxWidth: '250px'
            },
            /* {
                name: 'Race',
                selector: row => row.race,
            },
            {
                name: 'Cost',
                selector: row => row.manacost,
            },
            {
                name: 'Power',
                selector: row => row.power,
            },
            {
                name: 'Cardtype',
                selector: row => row.cardtype,
            },
            {
                name: 'Sets',
                selector: row => row.set,
            }, */
        ])

        var tableData = []
        Object.values(response.data).map(value => {
            let tmp = value.Card
            tmp['set'] = value.sets
            tmp['image_data'] = value.image_data
            tableData.push(tmp)
        })
        setDataTableData(tableData)
        Swal.close();
    };
    const cardResponse = async (cardId) => {
        try {
            let data = await Api().get('card-details/' + cardId);
            setCardDetail(data.data)
            return Promise.resolve();
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    function showCardDeatils(row) {
        if (isModalOpen) {
            if (detailsCradId.id != row.id) {
                Swal.fire({
                    title: "Geting...",
                    text: "Please wait while we geting card data",
                    showConfirmButton: false,
                    allowOutsideClick: false
                });
                cardResponse(row.id).then(
                    () => {
                        console.log(cardDetail)
                        setDetailsCardId(row)
                        Swal.close();
                    }).catch((error) => {
                        console.error(error);
                        Swal.close();
                    })
            } else {
                setIsModalOpen(false);
            }
        } else {
            Swal.fire({
                title: "Geting...",
                text: "Please wait while we geting card data",
                showConfirmButton: false,
                allowOutsideClick: false
            });
            cardResponse(row.id).then(
                () => {
                    setDetailsCardId(row)
                    setIsModalOpen(true)
                    Swal.close();
                }).catch((error) => {
                    console.error(error);
                    Swal.close();
                })
        }
    }

    const handleCardDeatailClick = () => {
        setIsModalOpen(false);
        //setDetailsCardId({});
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 27) {
            handleCardDeatailClick()
        }
    }

    return (
        <>
            <TopNav />
            <section className="inner-page" onKeyDown={e => handleKeyDown(e)}>
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <div className="card-title text-center">
                                <h3>Search for Cards</h3>
                            </div>
                            <form onSubmit={handleFormSubmit}>

                                <div className="d-flex flex-wrap">
                                    <div className="col-md-6 p-2 col-12 ">
                                        <label>Name:</label>
                                        <input type="text" className="form-control" id="name" name="name" defaultValue={searchParams.name} onChange={handleInputChange}></input>
                                    </div>
                                    <div className="col-md-6 p-2 col-12 ">
                                        <label>Civilization:</label>
                                        <select className="form-control"
                                            id="civilization"
                                            name="civilization"
                                            defaultValue={searchParams.civilization}
                                            onChange={handleInputChange}>
                                            <option value="">-- Select a civilization --</option>
                                            {Object.values(civilizations).map((civilization) => (
                                                <option key={civilization} value={civilization}>
                                                    {civilization}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap">
                                    <div className="col-md-5 p-2 col-12 ">
                                        <label>Race:</label>
                                        <select className="form-control"
                                            id="race"
                                            name="race"
                                            defaultValue={searchParams.race}
                                            onChange={handleInputChange}>
                                            <option value="">-- Select a race --</option>
                                            {Object.values(races).map((race) => (
                                                <option key={race} value={race}>
                                                    {race}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3 p-2 col-12 ">
                                        <label>Cost:</label>
                                        <select className="form-control"
                                            id="cost"
                                            name="cost"
                                            defaultValue={searchParams.cost}
                                            onChange={handleInputChange}>
                                            <option value="">-- Select a cost --</option>
                                            {Object.values(manacosts).map((manacost) => (
                                                <option key={manacost} value={manacost}>
                                                    {manacost}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4 p-2 col-12 ">
                                        <label>Power:</label>
                                        <select className="form-control"
                                            id="power"
                                            name="power"
                                            defaultValue={searchParams.cost}
                                            onChange={handleInputChange}>
                                            <option value="">-- Select a power --</option>
                                            {Object.values(power).map((power) => (
                                                <option key={power} value={power}>
                                                    {power}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap">
                                    <div className="col-md-12 p-2 col-12 ">
                                        <label>Text:</label>
                                        <input type="text" className="form-control" id="text" name="text" defaultValue={searchParams.text} onChange={handleInputChange}></input>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap">
                                    <div className="col-md-6 p-2 col-12 ">
                                        <label>Card Type:</label>
                                        <select className="form-control"
                                            id="cardtype"
                                            name="cardtype"
                                            defaultValue={searchParams.cardtype}
                                            onChange={handleInputChange}>
                                            <option value="">-- Select a card type --</option>
                                            {Object.values(cardtypes).map((cardtype) => (
                                                <option key={cardtype} value={cardtype}>
                                                    {cardtype}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 p-2 col-12 ">
                                        <label>Category:</label>
                                        <select className="form-control"
                                            id="category"
                                            name="category"
                                            defaultValue={searchParams.category}
                                            onChange={handleInputChange}>
                                            <option value="">-- Select a category --</option>
                                            {Object.values(categories).map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap">
                                    <div className="col-md-12 p-2 col-12 ">
                                        <label>Set:</label>
                                        <select className="form-control"
                                            id="ocg_set"
                                            name="ocg_set"
                                            defaultValue={searchParams.ocg_set}
                                            onChange={handleInputChange}>
                                            <option value="">-- Select a set --</option>
                                            {Object.values(sets).map((set) => (
                                                <option key={set} value={set}>
                                                    {set}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap">
                                    <div className="col-md-12 p-2 col-12  text-center">
                                        <input type="submit" value="Search" className="btn btn-primary" />
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>

                    <DataTable
                        columns={dataTableColumns}
                        data={dataTableData}
                        onRowClicked={showCardDeatils}
                        pagination
                        fixedHeader
                        highlightOnHover
                        persistTableHead
                        responsive
                        striped
                        pointerOnHover
                        title={'Search Result'}
                    />
                </div>
            </section>

            <div className={`col-md-5 col-11 sidebar border ${isModalOpen ? 'active' : ''}`}>
                <div className=' col-12 d-flex justify-content-end'>
                    <i
                        className='bi bi-x-square-fill'
                        style={{ "fontSize": "25px", "padding": "0px 20px", "cursor": "pointer" }}
                        onClick={(event) => {
                            event.preventDefault();
                            handleCardDeatailClick();
                        }}
                    ></i>
                </div>
                <div className="sidebar-list col-12">
                    {Object.keys(detailsCradId).length > 0 &&
                        <table className={`table table-bordered table-sm sidebar-item ${isModalOpen ? 'active' : ''}`}>
                            <tbody>
                                <tr>
                                    <th className="d-flex justify-content-center">
                                        {detailsCradId.name}
                                    </th>
                                </tr>
                                <tr>
                                    <td className="d-flex justify-content-center">
                                        <img src={`data:image/png;base64,${cardDetail.image_data}`} alt={detailsCradId.name} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="d-flex">
                                        <div className="col-6 text-center fw-bolder"><strong>Civilization:</strong></div>
                                        <div className="col-6 text-center fw-bolder">{detailsCradId.civilization}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="d-flex">
                                        <div className="col-6 text-center fw-bolder"><strong>Type:</strong></div>
                                        <div className="col-6 text-center fw-bolder">{detailsCradId.cardtype}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="d-flex">
                                        <div className="col-6 text-center fw-bolder"><strong>Race:</strong></div>
                                        <div className="col-6 text-center fw-bolder">{detailsCradId.race}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="d-flex">
                                        <div className="col-6 text-center fw-bolder"><strong>Cost:</strong></div>
                                        <div className="col-6 text-center fw-bolder">{detailsCradId.manacost}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="d-flex">
                                        <div className="col-6 text-center fw-bolder"><strong>Text:</strong></div>
                                        <div className="col-6 text-center fw-bolder">{detailsCradId.englishtext}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="d-flex">
                                        <div className="col-6 text-center fw-bolder"><strong>Power:</strong></div>
                                        <div className="col-6 text-center fw-bolder">{detailsCradId.power}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="d-flex">
                                        <div className="col-6 text-center fw-bolder"><strong>Mana:</strong></div>
                                        <div className="col-6 text-center fw-bolder">{detailsCradId.mananumber}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="d-flex flex-wrap">
                                        <div className="col-12 text-center fw-bolder"><strong>Sets</strong></div>
                                        <div className="col-12 text-center fw-bolder">{detailsCradId.set}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    }
                </div>
            </div>
            <Footers />
        </>
    )

}