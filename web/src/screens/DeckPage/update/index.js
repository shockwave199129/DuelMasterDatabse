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

export default function UpdateDeck({ id }) {
    const cookies = new Cookies()
    var { push } = new useRouter()

    const [DeckDetails, setDeckDetails] = useState({});
    const [PsychicDetails, setPsychicDetails] = useState({});
    const [GachaDetails, setGachaDetails] = useState({});

    const [DeckDisplay, setDeckDisplay] = useState({});
    const [PsychicDisplay, setPsychicDisplay] = useState({});
    const [GachaDisplay, setGachaDisplay] = useState({});

    const [PsychicSectionRule, setPsychicSectionRule] = useState('');
    const [GachaSectionRule, setGachaSectionRule] = useState('')

    const [searchParams, setSearchParams] = useState({
        deck_name: '',
        deck_info: '',
        is_private: false,
        is_complete: false,
        deck_data: []
    });


    const handleRowClick = async (cardData) => {

        const categories = JSON.parse(cardData.categories);

        let gachaCrad = categories.some(category => GachaSectionRule.test(category));
        let psychicCard = categories.some(category => PsychicSectionRule.test(category));

        if (gachaCrad) {
            const count = GachaDetails[cardData.id] || 0;
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
            if (count >= 1) {
                Swal.fire({
                    icon: "error",
                    text: "you can't have more than 1 copys in a deck",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })
                return;
            }

            setGachaDetails({
                ...GachaDetails,
                [cardData.id]: count + 1
            });

            setGachaDisplay({
                ...GachaDisplay,
                [cardData.name]: { "count": count + 1, "data": cardData, "categories": cardData.categories }
            })

        } else if (psychicCard) {
            const count = PsychicDetails[cardData.id] || 0;
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

            setPsychicDetails({
                ...PsychicDetails,
                [cardData.id]: count + 1
            });

            setPsychicDisplay({
                ...PsychicDisplay,
                [cardData.name]: { "count": count + 1, "data": cardData, "categories": cardData.categories }
            })
        } else {
            const count = DeckDetails[cardData.id] || 0;
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
        }
    };

    const handleIncreaseClick = async (cardData) => {
        const categories = JSON.parse(cardData.categories);

        let gachaCrad = categories.some(category => GachaSectionRule.test(category));
        let psychicCard = categories.some(category => PsychicSectionRule.test(category));

        if (gachaCrad) {
            const count = GachaDetails[cardData.data.id] || 0;
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
            if (count >= 1) {
                Swal.fire({
                    icon: "error",
                    text: "you can't have more than 1 copys in a deck",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })
                return;
            }

            setGachaDetails({
                ...GachaDetails,
                [cardData.data.id]: count + 1
            });

            setGachaDisplay({
                ...GachaDisplay,
                [cardData.data.name]: { "count": count + 1, "data": cardData.data, "categories": cardData.categories }
            })

        } else if (psychicCard) {
            const count = PsychicDetails[cardData.data.id] || 0;
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

            setPsychicDetails({
                ...PsychicDetails,
                [cardData.data.id]: count + 1
            });

            setPsychicDisplay({
                ...PsychicDisplay,
                [cardData.data.name]: { "count": count + 1, "data": cardData.data, "categories": cardData.categories }
            })
        } else {
            const count = DeckDetails[cardData.data.id] || 0;
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
        }
    };

    const handleDecreaseClick = async (cardData) => {

        const categories = JSON.parse(cardData.categories);
        let gachaCrad = categories.some(category => GachaSectionRule.test(category));
        let psychicCard = categories.some(category => PsychicSectionRule.test(category));

        if (gachaCrad) {
            const gachaCount = GachaDetails[cardData.data.id] || 0;
            if (gachaCount === 0) {
                return;
            }
            if (categories.includes("Premium Hall of Fame card") || categories.includes("Disabled card")) {
                Swal.fire({
                    icon: "error",
                    text: "You can't have any copy of a card in the Premium Hall of Fame / Disabled in your deck",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
                return;
            } else if (categories.includes("Hall of Fame card") && gachaCount > 1) {
                Swal.fire({
                    icon: "error",
                    text: "You can only have one copy of any card in the Hall of Fame in a deck",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
                return;
            }
            const newGachaCount = gachaCount - 1;
            if (newGachaCount === 0) {
                const { [cardData.data.id]: removedCard, ...rest } = GachaDetails;
                setGachaDetails(rest);
                const { [cardData.data.name]: removedCardDisplay, ...restDisplay } = GachaDisplay;
                setGachaDisplay(restDisplay);
            } else {
                setGachaDetails({
                    ...GachaDetails,
                    [cardData.data.id]: newGachaCount,
                });
                setGachaDisplay({
                    ...GachaDisplay,
                    [cardData.data.name]: { count: newGachaCount, data: cardData.data, "categories": cardData.categories },
                });
            }
        } else if (psychicCard) {
            const psychicCount = PsychicDetails[cardData.data.id] || 0;
            if (psychicCount === 0) {
                return;
            }
            if (categories.includes("Premium Hall of Fame card") || categories.includes("Disabled card")) {
                Swal.fire({
                    icon: "error",
                    text: "You can't have any copy of a card in the Premium Hall of Fame / Disabled in your deck",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
                return;
            } else if (categories.includes("Hall of Fame card") && psychicCount > 1) {
                Swal.fire({
                    icon: "error",
                    text: "You can only have one copy of any card in the Hall of Fame in a deck",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
                return;
            }
            const newPsychicCount = psychicCount - 1;
            if (newPsychicCount === 0) {
                const { [cardData.data.id]: removedCard, ...rest } = PsychicDetails;
                setPsychicDetails(rest);
                const { [cardData.data.name]: removedCardDisplay, ...restDisplay } = PsychicDisplay;
                setPsychicDisplay(restDisplay);
            } else {
                setPsychicDetails({
                    ...PsychicDetails,
                    [cardData.data.id]: newPsychicCount,
                });
                setPsychicDisplay({
                    ...PsychicDisplay,
                    [cardData.data.name]: { count: newPsychicCount, data: cardData.data, "categories": cardData.categories },
                });
            }
        } else {
            const deckCount = DeckDetails[cardData.data.id] || 0;
            if (deckCount === 0) {
                return;
            }
            if (categories.includes("Premium Hall of Fame card") || categories.includes("Disabled card")) {
                Swal.fire({
                    icon: "error",
                    text: "You can't have any copy of a card in the Premium Hall of Fame / Disabled in your deck",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
                return;
            } else if (categories.includes("Hall of Fame card") && deckCount > 1) {
                Swal.fire({
                    icon: "error",
                    text: "You can only have one copy of any card in the Hall of Fame in a deck",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
                return;
            }
            const newDeckCount = deckCount - 1;
            if (newDeckCount === 0) {
                const { [cardData.data.id]: removedCard, ...rest } = DeckDetails;
                setDeckDetails(rest);
                const { [cardData.data.name]: removedCardDisplay, ...restDisplay } = DeckDisplay;
                setDeckDisplay(restDisplay);
            } else {
                setDeckDetails({
                    ...DeckDetails,
                    [cardData.data.id]: newDeckCount,
                });
                setDeckDisplay({
                    ...DeckDisplay,
                    [cardData.data.name]: { count: newDeckCount, data: cardData.data, "categories": cardData.categories },
                });
            }
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
                "deck_card_count": value[1],
                "zone": 2
            })
        })
        Object.entries(PsychicDetails).map((value) => {
            formData.deck_data.push({
                "deck_card_id": value[0],
                "deck_card_count": value[1],
                "zone": 7
            })
        })
        Object.entries(GachaDetails).map((value) => {
            formData.deck_data.push({
                "deck_card_id": value[0],
                "deck_card_count": value[1],
                "zone": 8
            })
        })
        const deckdata = await Api().validatePost('update-deck/' + id, formData);
        if (deckdata) {
            Swal.fire({
                text: 'Deck Updated',
                confirmButtonText: 'OK',
            }).then(() => {
                push('/decklist')
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
        } else {
            Api().get('zones').then(response => {
                var apiResponse = response.data
                setPsychicSectionRule(new RegExp(apiResponse.filter(obj => obj.zone_name === "Hyperspatial Zone")[0].type_regex))
                setGachaSectionRule(new RegExp(apiResponse.filter(obj => obj.zone_name === "Super Gacharange Zone")[0].type_regex))
            });

            Api().validateGet('deck-details/' + id).then(deckData => {
                setSearchParams({
                    deck_name: deckData.deck_name,
                    deck_info: deckData.deck_info,
                    is_private: deckData.is_private,
                    is_complete: deckData.is_complete,
                    deck_data: []
                })

                let updatedDeckDetails = {};
                let updatedPsychicDetails = {};
                let updatedGachaDetails = {};

                let updatedDeckDisplay = {};
                let updatedPsychicDisplay = {};
                let updatedGachaDisplay = {};

                if ('deck_details' in deckData) {
                    Object.values(deckData.deck_details).map(value => {
                        if (value.zone == 2) {
                            updatedDeckDetails[value.deck_card_id] = value.deck_card_count;

                            updatedDeckDisplay[value.deck_card_details.name] = {
                                count: value.deck_card_count,
                                data: value.deck_card_details,
                                "categories": value.deck_card_category
                            };
                        }

                        if (value.zone == 7) {
                            updatedPsychicDetails[value.deck_card_id] = value.deck_card_count;

                            updatedPsychicDisplay[value.deck_card_details.name] = {
                                count: value.deck_card_count,
                                data: value.deck_card_details,
                                "categories": value.deck_card_category
                            };
                        }

                        if (value.zone == 8) {
                            updatedGachaDetails[value.deck_card_id] = value.deck_card_count;

                            updatedGachaDisplay[value.deck_card_details.name] = {
                                count: value.deck_card_count,
                                data: value.deck_card_details,
                                "categories": value.deck_card_category
                            };
                        }
                    })
                }
                setDeckDetails(updatedDeckDetails);
                setPsychicDetails(updatedPsychicDetails);
                setGachaDetails(updatedGachaDetails);

                setDeckDisplay(updatedDeckDisplay);
                setPsychicDisplay(updatedPsychicDisplay);
                setGachaDisplay(updatedGachaDisplay);
            })
        }
    }, [id])

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
                                        <div className="card-title text-center"><h5><u>Update Deck</u></h5></div>
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex flex-wrap">
                                                <div className="p-2 col-12 ">
                                                    <label>Name:</label>
                                                    <input type="text" className="form-control form-control-sm" maxLength={20} required id="deck_name" name="deck_name" defaultValue={searchParams.deck_name} onChange={handleInputChange}></input>
                                                </div>
                                                <div className="p-2 col-12 ">
                                                    <label>Info:</label>
                                                    <textarea className="form-control form-control-sm" rows={2} defaultValue={searchParams.deck_info} maxLength={100} style={{ resize: "none" }} name="deck_info" onChange={handleInputChange}>
                                                    </textarea>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="p-2 d-inline-flex flex-wrap align-items-center">
                                                    <span>Complete:</span>
                                                    <input type="checkbox" className="ms-2" name="is_complete" checked={searchParams.is_complete} onChange={e => { handleInputChange(e) }} />
                                                </div>
                                                <div className="p-2 d-inline-flex flex-wrap align-items-center">
                                                    <span>Private:</span>
                                                    <input type="checkbox" className="ms-2" name="is_private" checked={searchParams.is_private} onChange={e => { handleInputChange(e) }} />
                                                </div>
                                                <input type="submit" value="Save" className="btn btn-sm btn-primary float-end" />
                                            </div>
                                        </form>
                                        <div className="border-top border-secondary col">
                                            <div className="list-group">
                                                <h6 className="card-subtitle mt-1 text-muted border-bottom border-secondary p-2">Deck</h6>
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
                                            <div className="list-group">
                                                <h6 className="card-subtitle mt-1 text-muted border-bottom border-secondary p-2">Hyperspatial Zone</h6>
                                                {Object.values(PsychicDisplay).map((card, index) => (
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
                                            <div className="list-group">
                                                <h6 className="card-subtitle mt-1 text-muted border-bottom border-secondary p-2">Gacharange Zone</h6>
                                                {Object.values(GachaDisplay).map((card, index) => (
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