import sys
import os
import random
from typing import Any, Dict
import json

sys.path.append(os.path.dirname(os.path.dirname(os.getcwd())))

class Choices:

    def __init__(self) -> None:
        pass

    def choise_put_mana_from_hand(self):
        hand_civi_distribution = [x.civilization for x in self.hand]
        hand_cost_distribution = [x.manacost for x in self.hand]

        mana_civi_distribution = [m.civilization for m in self.mana_zone if m.civilization not in mana_civi_distribution]
        current_mana_count = len(self.mana_zone)

        if len(mana_civi_distribution) < len(self.civiList):
            element_counts = {}

            for sublist in hand_civi_distribution:
                count = sum(1 for element in sublist if element in self.civiList)
                element_counts[tuple(sublist)] = count

            max_count_sublist = max(element_counts, key=element_counts.get)
            max_count_index = hand_civi_distribution.index(list(max_count_sublist))

            removed_card = self.hand.pop(max_count_index)
            self.mana_zone.append(removed_card)


"""
future plan to breck player class
class PlayerDeck:
    def __init__(self, db, deckId):
        self.db = db
        self.deckId = deckId
        self.deck = []
        self._initialize_deck()

    def _initialize_deck(self):
        # Load deck from database and populate self.deck
        # ... (your existing _initializeDeck code)
        pass

    def draw_card(self):
        # Draw a card from the deck
        pass

    def put_top_card_shield(self):
        # Put a card from the deck to the shield zone
        pass

    def charge_mana_from_hand(self):
        # Charge mana from hand to the mana zone
        pass


class BattleZone:
    def __init__(self):
        self.cards = []

    def put_card(self, card):
        # Put a card in the battle zone
        pass

    def execute_card_put_effect(self, card):
        # Execute the effect of a card put in the battle zone
        pass


class ManaZone:
    def __init__(self):
        self.cards = []
        self.current_mana_number = 0

    def untap_all_cards(self):
        # Untap all cards in the mana zone
        pass

    def tap_cards(self, card_list):
        # Tap specific cards in the mana zone
        pass


class Player:
    def __init__(self, name, deckId):
        self.playerName = name
        self.playerDeckId = deckId
        self.db = Session()

        self.turn_step = {}
        self.civiList = []

        self.battle_zone = BattleZone()
        self.deck = PlayerDeck(self.db, self.playerDeckId)
        self.graveyard = []
        self.hand = []
        self.mana_zone = ManaZone()
        self.shield_zone = []
        self.hyperspatial_zone = []
        self.super_gacharange_zone = []
"""