from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

from ..Database.db import Session
from ..Database.models import Deck, DeckDetails, Category, Zones
from .cardSearch import get_db
from ..Database import schemas
from .Core import security


router = APIRouter()

@router.get("/decks", response_model=List[schemas.SimplifiedDeckResponse])
def get_all_decks(
    current_user: dict = Depends(security.authenticate_token),
    db: Session = Depends(get_db)
)-> Any:
    """
    get all deck list
    """
    user_id = current_user.get("sub")
    decks = db.query(Deck).all()

    simplified_decks = []
    for deck in decks:
        simplified_details = []
        for detail in deck.deck_details:
            simplified_detail = {
                "deck_card_count": detail.deck_card_count,
                "deck_card_id": detail.deck_card_id,
            }
            simplified_details.append(simplified_detail)

        simplified_deck = {
            "deck_name": deck.deck_name,
            "deck_info": deck.deck_info,
            "user_id": deck.user_id,
            "user_info": deck.user_details.user_name,
            "is_editable": True if deck.user_id == int(user_id) else False,
            "is_complete": deck.is_complete,
            "id": deck.id,
            "is_private": deck.is_private,
            "deck_details": simplified_details,
        }
        simplified_decks.append(simplified_deck)

    return JSONResponse(content=simplified_decks)

@router.get("/deck-details/{deck_id}")
def get_deck_details(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.authenticate_token),
)-> Any:
    """
    get a deck details
    """
    user_id = current_user.get("sub")
    deck = db.query(Deck).filter(Deck.id == deck_id).first()

    if deck == None:
        return {'No deck found'}

    if (int(user_id) != deck.user_id) and (deck.is_private):
        raise HTTPException(status_code=422, detail="You can not view others private deck")
    
    def serialize_deck_details(details):
        serialized_details = []
        for detail in details:
            card_category = db.query(Category).filter(Category.link == detail.deck_card_details.link).first()
            serialized_detail = {
                "deck_card_count": detail.deck_card_count,
                "deck_card_id": detail.deck_card_id,
                "zone": detail.zone,
                "deck_card_details": detail.deck_card_details.to_dict(),
                "deck_card_category": card_category.to_dict()
            }
            serialized_details.append(serialized_detail)
        return serialized_details

    simplified_deck = {
        "deck_name": deck.deck_name,
        "deck_info": deck.deck_info,
        "user_id": deck.user_id,
        "user_info": deck.user_details.user_name,
        "is_editable": True if deck.user_id == int(user_id) else False,
        "is_complete": deck.is_complete,
        "id": deck.id,
        "is_private": deck.is_private,
        "deck_details": serialize_deck_details(deck.deck_details),
    }
    return JSONResponse(content=simplified_deck)

@router.post("/create-deck")
def create_deck(
    *,
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.authenticate_token),
    deck: schemas.DeckBuild
)-> Any:
    """
    create a deck
    """
    user_id = current_user.get("sub")
    
    # Create DeckDetails instances
    deck_details = [
        DeckDetails(
            deck_card_id=entry.deck_card_id,
            deck_card_count=entry.deck_card_count,
            zone=entry.zone
        )
        for entry in deck.deck_data
    ]

    # Create Deck instance
    new_deck = Deck(
        deck_name=deck.deck_name,
        deck_info=deck.deck_info,
        user_id=user_id,
        is_private=deck.is_private,
        is_complete=deck.is_complete,
        deck_details=deck_details  # Assign the created DeckDetails instances
    )

    # Add to session and commit
    db.add(new_deck)
    db.commit()
    db.refresh(new_deck)

    return {'Deck created successfully'}

@router.post("/update-deck/{deck_id}")
def update_deck(
    *,
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.authenticate_token),
    updated_deck: schemas.DeckBuild
)->Any:
    """
    Update a deck
    """
    user_id = current_user.get("sub")

    # Retrieve the existing deck
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if deck is None:
        return {'No deck found'}

    # Check if the current user is the owner of the deck
    if (int(user_id) != deck.user_id):
        raise HTTPException(status_code=403, detail="You can not edit others deck")
    
    # Update deck attributes
    deck.deck_name = updated_deck.deck_name
    deck.deck_info = updated_deck.deck_info
    deck.is_private = updated_deck.is_private
    deck.is_complete = updated_deck.is_complete

    # Update deck details
    updated_deck_data = updated_deck.deck_data

    existing_detail_ids = {detail.deck_card_id: detail for detail in deck.deck_details}
    new_detail_ids = {detail.deck_card_id: detail for detail in updated_deck_data}

    for existing_id, existing_detail in existing_detail_ids.items():
        updated_detail = new_detail_ids.get(existing_id)

        if updated_detail:
            existing_detail.deck_card_count = updated_detail.deck_card_count
            new_detail_ids.pop(existing_id)
        else:
            deck.deck_details.remove(existing_detail)
            db.delete(existing_detail)

    for new_id, new_detail in new_detail_ids.items():
        deck_detail = existing_detail_ids.get(new_id)

        if deck_detail:
            deck_detail.deck_card_count = new_detail.deck_card_count
        else:
            deck_detail = DeckDetails(
                deck_card_id=new_id,
                deck_card_count=new_detail.deck_card_count,
                zone= new_detail.zone
            )
            deck.deck_details.append(deck_detail)

    # Commit changes
    db.commit()

    return {'Deck update successfully'}

@router.get("/delete-deck/{deck_id}")
def delete_deck(
    *,
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.authenticate_token),
)->Any:
    """
    delete a deck
    """
    user_id = current_user.get("sub")

    # Retrieve the existing deck
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if deck is None:
        return {'No deck found'}
    # Check if the current user is the owner of the deck
    if (int(user_id) != deck.user_id):
        raise HTTPException(status_code=403, detail="You can not delete others deck")
    
    # Delete associated deck details
    deck_details = db.query(DeckDetails).filter(DeckDetails.deck_id == deck_id).all()
    for detail in deck_details:
        db.delete(detail)

    # Delete the deck
    db.delete(deck)
    db.commit()
    return {"message": "Deck deleted successfully"}

@router.get("/zones")
def get_zones(db: Session = Depends(get_db))->Any:
    zones = db.query(Zones).all()

    return zones