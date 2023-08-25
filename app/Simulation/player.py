import sys
import os
import random
from typing import Any, Dict
import json

sys.path.append(os.path.dirname(os.path.dirname(os.getcwd())))

from app.Database.db import Session
from app.Database.models import Deck, Category

class Card:

    def __init__(self, cardData:dict) -> None:
        self.name = self.swapPositions(cardData['name'].split('/'), 0, 1)
        self.id = cardData['id']
        self.civilization = cardData['civilization'].split('/')
        self.cardtype = cardData['cardtype'].split('/')
        self.manacost = self.swapPositions(cardData['manacost'].split('/'), 0, 1)
        self.race = cardData['race']
        self.power = cardData['power']
        self.text = cardData['englishtext'].split('/n')
        self.mananumber = cardData['mananumber']
        self.category = json.loads(cardData['category'])

    def swapPositions(self, my_list:list, pos1:int, pos2:int):
        # Check if my_list is an instance of list
        if not isinstance(my_list, list):
            return my_list

        # Check if pos1 and pos2 are valid indices
        if not (0 <= pos1 < len(my_list)) or not (0 <= pos2 < len(my_list)):
            return my_list
        my_list[pos1], my_list[pos2] = my_list[pos2], my_list[pos1]
        return my_list


class Player:

    def __init__(self, name:str, deckId:int) -> None:
        self.playerName = name
        self.playerDeckId = deckId
        self.db = Session()

        self.battle_zone = []
        self.deck = []
        self.graveyard = []
        self.hand = []
        self.mana_zone = []
        self.shield_zone = []
        self.hyperspatial_zone = []
        self.super_gacharange_zone = []

        self.civiList = []

        self._initializeDeck()
    
    def _initializeDeck(self) -> None:
        deck = self.db.query(Deck).filter(Deck.id == self.playerDeckId).first()

        if deck == None:
            raise Exception('No deck found')
        
        serializeDeck = self.__serialize_deck_details(deck.deck_details)

        for cards in serializeDeck:
            cardZone = getattr(self, cards['zone'])
            cardData = cards['deck_card_details']
            cardData['category'] = cards['deck_card_category']

            for _ in range(int(cards['deck_card_count'])):
                cardInfo = Card(cardData)
                if cards['zone'] == 'deck':
                    self.civiList.extend(civis for civis in cardInfo.civilization if civis not in self.civiList)
                cardZone.append(cardInfo)

        random.shuffle(self.deck)
        random.shuffle(self.super_gacharange_zone)

    def __serialize_deck_details(self, details) -> list[dict]:
        serialized_details = []
        for detail in details:
            card_category = self.db.query(Category).filter(Category.link == detail.deck_card_details.link).first()
            serialized_detail = {
                "deck_card_count": detail.deck_card_count,
                "deck_card_id": detail.deck_card_id,
                "zone": detail.zone_data.zone_name.replace(' ', '_').lower(),
                "zone_id": detail.zone,
                "deck_card_details": detail.deck_card_details.to_dict(),
                "deck_card_category": card_category.to_dict()
            }

            serialized_details.append(serialized_detail)
        return serialized_details
    
    def setTable(self) -> None:
        for _ in range(5):
            self.put_top_card_shield()
        for _ in range(5):
            self.draw_card()

    def draw_card(self) -> None:
        card = self.deck.pop(0)
        self.hand.append(card)
    
    def put_top_card_shield(self) -> None:
        card = self.deck.pop(0)
        self.shield_zone.append(card)


if __name__ == "__main__":
    player1 = Player('riki', 4)

    player1.setTable()
