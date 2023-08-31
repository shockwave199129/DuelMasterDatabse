import sys
import os
import random
from typing import Any, Dict
import json

sys.path.append(os.path.dirname(os.path.dirname(os.getcwd())))

from app.Database.db import Session
from app.Database.models import Deck, Category
from app.Simulation.choice import Choices

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
        self.is_taped = False
        self.is_frezed = False
        self.is_sealed = False
        self.sealed_cards = []
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


class Player(Choices):

    def __init__(self, name:str, deckId:int) -> None:
        self.playerName = name
        self.playerDeckId = deckId
        self.db = Session()

        self.turn_step = {}

        self.battle_zone = []
        self.deck = []
        self.graveyard = []
        self.hand = []
        self.mana_zone = []
        self.shield_zone = []
        self.hyperspatial_zone = []
        self.super_gacharange_zone = []

        self.civiList = []

        self.current_mana_number = 0
        self.current_mana_civi_distribution = []

        self._initializeDeck()

    def register(self, tag):
        def decorator(func):
            if tag not in self.turn_step:
                self.turn_step[tag] = []
            self.turn_step[tag].append(func)
            return func
        return decorator
    
    def _initializeDeck(self) -> None:
        deck = self.db.query(Deck).filter(Deck.id == self.playerDeckId).first()

        if deck == None:
            raise Exception('No deck found')
        
        self.battle_zone = []
        self.deck = []
        self.graveyard = []
        self.hand = []
        self.mana_zone = []
        self.shield_zone = []
        self.hyperspatial_zone = []
        self.super_gacharange_zone = []
        
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
    
    def _setTable(self) -> None:
        for _ in range(5):
            self.put_top_card_shield()
        for _ in range(5):
            self.draw_card()

    @register('setup')
    def reset_and_setup(self) -> None:
        self._initializeDeck()
        self._setTable()

    @register('start_turn')
    def untap_all_mana_cards(self):
        for card in self.mana_zone:
            card.is_taped = False
        self.current_mana_number = len(self.mana_zone)

    @register('draw')
    def draw_card(self) -> None:
        card = self.deck.pop(0)
        self.hand.append(card)
    
    def put_top_card_shield(self) -> None:
        card = self.deck.pop(0)
        self.shield_zone.append(card)

    @register('put_mana')
    def charge_mana_from_hand(self) -> None:
        if len(self.hand) == 0:
            return None
        else:
            removed_card = self.hand.pop(random.randint(0, len(self.hand) - 1))
            self.mana_zone.append(removed_card)
            self.current_mana_number += int(removed_card.mananumber)
            self.current_mana_civi_distribution.append(removed_card.civilization)

    def is_summon_possible(self):
        if not self.hand:
            return False

        min_manacost = min(card.manacost for card in self.hand)
        return self.current_mana_number >= min_manacost
    
    @register('summon')
    def take_summon_action(self):

        while self.is_summon_possible() and random.choice([True, False]):
            self.put_card_from_hand()

    def put_card_from_hand(self) -> bool:
        if len(self.hand) == 0:
            return False
        else:
            chosen_card = self.hand[random.randint(0, len(self.hand) - 1)]
            if int(chosen_card.manacost) <= self.current_mana_number:

                # Collect the available mana cards for each civilization in the chosen card
                available_mana = {civ: [] for civ in chosen_card.civilization}
                for crd in self.mana_zone:
                    if crd.civilization in chosen_card.civilization and not crd.is_taped:
                        available_mana[crd.civilization].append(crd)

                # Check if enough matching untapped mana cards are available for each civilization
                if all(len(available) >= 1 for available in available_mana.values()):
                    for civ in chosen_card.civilization:
                        # Tap one untapped mana card of the matching civilization
                        untapped_available = available_mana[civ]
                        tapped_mana = random.choice(untapped_available)
                        tapped_mana.is_taped = True
                        self.current_mana_number -= 1

                    # Calculate remaining manacost after tapping for each civilization
                    remaining_manacost = int(chosen_card.manacost) - len(chosen_card.civilization)

                    # Tap additional untapped mana for the remaining manacost
                    for _ in range(remaining_manacost):
                        untapped_mana = [mana for mana in self.mana_zone if not mana.is_taped]
                        if untapped_mana:
                            tapped_mana = random.choice(untapped_mana)
                            tapped_mana.is_taped = True
                            self.current_mana_number -= 1
                    index_of_chosen_card = self.hand.index(chosen_card)
                    summon_card = self.hand.pop(index_of_chosen_card)
                    self.battle_zone.append(summon_card)
                    self.execute_card_put_effect(summon_card)
                    return True

                else:
                    return False

            else:
                return False
            
    @register('put_on_effect')
    def execute_card_put_effect(self, chosen_card:Card):
        pass


if __name__ == "__main__":

    turn = 1

    player1 = Player('riki', 4)
    player1.reset_and_setup()

    #start turn steps
    player1.untap_all_mana_cards()
    if not turn == 1:
        player1.draw_card()
    player1.charge_mana_from_hand()

    player1.take_summon_action()
