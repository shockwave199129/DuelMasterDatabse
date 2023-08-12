"use client"
import TopNav from "@/shared/topNav";
import Footers from "@/shared/footer";
import Api from "@/shared/api";
import SearchComponent from "./serachComponent";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

export default function CreateDeck() {

    const cookies = new Cookies()
    var { push } = new useRouter()

    const [DeckDetails, setDeckDetails] = useState({});
    const [DeckDisplay, setDeckDisplay] = useState({});

    const [searchParams, setSearchParams] = useState({
        deck_name: '',
        deck_info: '',
        is_private: false,
        is_complete: false,
        deck_data: []
    });


    const handleRowClick = async (cardData) => {
        console.log(cardData)
        debugger
        const count = DeckDetails[cardData.id] || 0;
        const categories = JSON.parse(cardData.categories);
        if (categories.includes('Premium Hall of Fame card') || categories.includes('Disabled card')) {
            Swal.fire({
                icon: "error",
                text: "You can't have any copy of a card in the Premium Hall of Fame / Disabled in your deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        } else if (categories.includes('Hall of Fame card') && count >= 1) {
            Swal.fire({
                icon: "error",
                text: "You can only have one copy of any card in the Hall of Fame in a deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }
        if (count >= 4) {
            Swal.fire({
                icon: "error",
                text: "you can't have more than 4 copys in a deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }
        setDeckDetails({
            ...DeckDetails,
            [cardData.id]: count + 1
        });

        setDeckDisplay({
            ...DeckDisplay,
            [cardData.name]: { "count": count + 1, "data": cardData, "categories": cardData.categories }
        })
    };

    const handleIncreaseClick = async (cardData) => {
        const count = cardData.count || 0;

        const categories = JSON.parse(cardData.categories);
        if (categories.includes('Premium Hall of Fame card') || categories.includes('Disabled card')) {
            Swal.fire({
                icon: "error",
                text: "You can't have any copy of a card in the Premium Hall of Fame / Disabled in your deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        } else if (categories.includes('Hall of Fame card') && count >= 1) {
            Swal.fire({
                icon: "error",
                text: "You can only have one copy of any card in the Hall of Fame in a deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }
        if (count >= 4) {
            Swal.fire({
                icon: "error",
                text: "you can't have more than 4 copys in a deck",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            return;
        }
        setDeckDetails({
            ...DeckDetails,
            [cardData.data.id]: count + 1
        });

        setDeckDisplay({
            ...DeckDisplay,
            [cardData.data.name]: { "count": count + 1, "data": cardData.data, "categories": cardData.categories }
        })
    };

    const handleDecreaseClick = async (cardData) => {
        const count = cardData.count || 0;
        if (count === 0) {
            return;
        }

        const categories = JSON.parse(cardData.categories);
        if (categories.includes("Premium Hall of Fame card") || categories.includes("Disabled card")) {
            Swal.fire({
                icon: "error",
                text: "You can't have any copy of a card in the Premium Hall of Fame / Disabled in your deck",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        } else if (categories.includes("Hall of Fame card") && count > 1) {
            Swal.fire({
                icon: "error",
                text: "You can only have one copy of any card in the Hall of Fame in a deck",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        }

        const newCount = count - 1;
        if (newCount === 0) {
            const { [cardData.data.id]: removedCard, ...rest } = DeckDetails;
            setDeckDetails(rest);
            const { [cardData.data.name]: removedCardDisplay, ...restDisplay } = DeckDisplay;
            setDeckDisplay(restDisplay);
        } else {
            setDeckDetails({
                ...DeckDetails,
                [cardData.data.id]: newCount,
            });
            setDeckDisplay({
                ...DeckDisplay,
                [cardData.data.name]: { count: newCount, data: cardData.data, "categories": cardData.categories },
            });
        }
    };

    const handleInputChange = (event) => {
        event.persist();
        const { name, value, type, checked } = event.target;
        const newValue = type === "checkbox" ? checked : value;
        setSearchParams(values => ({ ...values, [name]: newValue }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formData = searchParams;

        Object.entries(DeckDetails).map((value) => {
            formData.deck_data.push({
                "deck_card_id": value[0],
                "deck_card_count": value[1]
            })
        })
        const deckdata = await Api().validatePost('create-deck', formData);
        if (deckdata) {
            Swal.fire({
                text: 'Deck created',
                confirmButtonText: 'OK',
            }).then(() => {
                push('decklist')
            });
        }
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
        }
    }, [])

    return (
        <>
            <TopNav />
            <section className="inner-page" style={{ paddingTop: "89px", minHeight: "calc(100vh - 81px)" }}>
                <div className="container-fluid">
                    <Tooltip id="card-tooltip" className="col-10 col-md-4" style={{ zIndex: "99999" }} />
                    <div className="d-flex justify-content-center align-items-start">
                        <div className="col-md-6 col-12 border-end border-secondary">
                            <SearchComponent rowFunction={handleRowClick} />
                        </div>
                        <div className="col-md-6 col-12">
                            <small>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="card-title text-center"><h5><u>Create Deck</u></h5></div>
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex flex-wrap">
                                                <div className="p-2 col-12 ">
                                                    <label>Name:</label>
                                                    <input type="text" className="form-control form-control-sm" maxLength={20} required id="deck_name" name="deck_name" defaultValue={searchParams.deck_name} onChange={handleInputChange}></input>
                                                </div>
                                                <div className="p-2 col-12 ">
                                                    <label>Info:</label>
                                                    <textarea className="form-control form-control-sm" rows={2} maxLength={100} style={{ resize: "none" }} name="deck_info" onChange={handleInputChange}>
                                                        {searchParams.deck_info}
                                                    </textarea>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="p-2 d-inline-flex flex-wrap align-items-center">
                                                    <span>Complete:</span>
                                                    <input type="checkbox" className="ms-2" name="is_complete" onChange={e => { handleChange(e) }} />
                                                </div>
                                                <div className="p-2 d-inline-flex flex-wrap align-items-center">
                                                    <span>Private:</span>
                                                    <input type="checkbox" className="ms-2" name="is_private" onChange={e => { handleChange(e) }} />
                                                </div>
                                                <input type="submit" value="Save" className="btn btn-sm btn-primary float-end" />
                                            </div>
                                        </form>
                                        <div className="border-top border-secondary col">
                                            <div className="list-group">
                                                {Object.values(DeckDisplay).map((card, index) => (
                                                    <div key={index} className="list-group-item px-0 d-flex">
                                                        <div className="col-10"
                                                            data-tooltip-id='card-tooltip'
                                                            data-tooltip-html={`<div>Civilization: ${card.data.civilization}, Type: ${card.data.cardtype}, Cost: ${card.data.manacost}</div>
                                                                <div>${card.data.englishtext}</div>`}
                                                        >
                                                            {card.data.name}
                                                        </div>
                                                        <div className="col-2 d-flex justify-content-around align-items-center">
                                                            <button type="button"
                                                                className="btn btn-sm btn-success"
                                                                onClick={(event) => {
                                                                    event.preventDefault();
                                                                    handleIncreaseClick(card);
                                                                }}
                                                            >
                                                                <i className="bi bi-plus-square"></i>
                                                            </button>
                                                            <span className="btn-sm">{card.count}</span>
                                                            <button type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={(event) => {
                                                                    event.preventDefault();
                                                                    handleDecreaseClick(card);
                                                                }}
                                                            >
                                                                <i className="bi bi-dash-square"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </small>
                        </div>
                    </div>
                </div>
            </section>
            <Footers />
        </>
    )
}