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