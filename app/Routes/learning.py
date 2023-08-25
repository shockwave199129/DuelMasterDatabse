from typing import Any
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, HTMLResponse
import pandas as pd
import json
import io
import base64

import matplotlib.pyplot as plt
import seaborn as sns

from ..Database.db import Session
from ..Database.models import Deck, Category
from .cardSearch import get_db


router = APIRouter()

@router.get("/deck-analysis/{deck_id}")
def get_deck_details(
    deck_id: int,
    db: Session = Depends(get_db),
)-> Any:
    """
    get a deck details
    """
    deck = db.query(Deck).filter(Deck.id == deck_id).first()

    if deck == None:
        return {'No deck found'}
    
    def serialize_deck_details(details):
        serialized_details = []
        for detail in details:
            card_category = db.query(Category).filter(Category.link == detail.deck_card_details.link).first()
            serialized_detail = {
                "deck_card_count": detail.deck_card_count,
                "deck_card_id": detail.deck_card_id,
                "zone": detail.zone_data.zone_name,
                "zone_id": detail.zone,
                #"deck_card_details": detail.deck_card_details.to_dict(),
                "deck_card_category": json.loads(card_category.to_dict())
            }
            for key, value in detail.deck_card_details.to_dict().items():
                serialized_detail[key] = value

            serialized_details.append(serialized_detail)
        return serialized_details

    df = pd.DataFrame(serialize_deck_details(deck.deck_details))
    cats = df['deck_card_category']
    
    string_count = {}

    # Step 2: Update the string counts
    for categories in cats:
    # Split the comma-separated string into individual categories
        for cat in categories:
            string_count[cat] = string_count.get(cat, 0) + 1
    filtered_strings = {string : count for string, count in string_count.items() if (count < len(cats) and (string.find('Mana Cost') == -1 and string.find('Power Creatures') == -1))}

    return dict(sorted(filtered_strings.items()))
    #html_content = df.to_html()
    return HTMLResponse(content=html_content)

if __name__ == "__main__":
    deckId = input('deck id: ')
    get_deck_details(deck_id=deckId)