"use client"
import Api from "@/shared/api";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export default function SearchComponent(properties) {

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
                maxWidth: '100px'
            },
        ])

        var tableData = []
        Object.values(response.data).map(value => {
            let tmp = value.Card
            tmp['set'] = value.sets
            tmp['categories'] = value.categories
            tableData.push(tmp)
        })
        setDataTableData(tableData)
        Swal.close();
    };

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="card-title text-center">
                        <h3>Search for Cards</h3>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <small>
                            <div className="d-flex flex-wrap">
                                <div className="col-md-6 p-2 col-12 ">
                                    <label>Name:</label>
                                    <input type="text" className="form-control form-control-sm" id="name" name="name" defaultValue={searchParams.name} onChange={handleInputChange}></input>
                                </div>
                                <div className="col-md-6 p-2 col-12 ">
                                    <label>Civilization:</label>
                                    <select className="form-control form-control-sm"
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
                                    <select className="form-control form-control-sm"
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
                                    <select className="form-control form-control-sm"
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
                                    <select className="form-control form-control-sm"
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
                                    <input type="text" className="form-control form-control-sm" id="text" name="text" defaultValue={searchParams.text} onChange={handleInputChange}></input>
                                </div>
                            </div>

                            <div className="d-flex flex-wrap">
                                <div className="col-md-6 p-2 col-12 ">
                                    <label>Card Type:</label>
                                    <select className="form-control form-control-sm"
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
                                    <select className="form-control form-control-sm"
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
                                    <select className="form-control form-control-sm"
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
                        </small>
                    </form>
                </div>
            </div>
            <small>
                <DataTable
                    columns={dataTableColumns}
                    data={dataTableData}
                    onRowClicked={properties.rowFunction}
                    pagination
                    fixedHeader
                    highlightOnHover
                    persistTableHead
                    responsive
                    striped
                    pointerOnHover
                    title={'Search Result'}
                    customStyles={{
                        headCells: {
                            style: {
                                fontWeight: 'bold',
                                backgroundColor: '#9e9e9e',
                                fontSize: '15px',
                            },
                        },
                        table: {
                            style: {
                                fontSize: "80%",
                                fontWeight: "400"
                            }
                        }
                    }}
                />
            </small>
        </>
    )
}