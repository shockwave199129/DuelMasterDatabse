"""create_duel_master_rule_table

Revision ID: 5ae7c29e44ea
Revises: 7d08536a3876
Create Date: 2023-08-13 19:50:27.633473

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
import re
import os


# revision identifiers, used by Alembic.
revision = '5ae7c29e44ea'
down_revision = '7d08536a3876'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'duel_master_rule',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('head', sa.Text(), nullable=False),
        sa.Column('section', sa.Text()),
        sa.Column('content', sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    if os.path.exists('dm_rule.txt'):
        with open('dm_rule.txt', 'r', encoding='utf-8') as file:
            lines = file.readlines()

        # Initialize an empty list to store dictionaries
        result_list = []
        # Initialize variables to hold values
        current_head = None
        current_section = None
        current_content = None

        # Regular expression patterns
        head_pattern = re.compile(r'^(\d{1})\.\s+(.*)$')
        section_pattern = re.compile(r'^(\d{3})\.\s+(.*)$') #re.compile(r'^(\d+\.\d+[a-z]*)\.\s+(.*)$')
        content_pattern = re.compile(r'^(\d{3}\.\d{1,}[a-z]*)(.|\s)(.*)$')

        # Iterate through each line in the file
        for line in lines:
            line = line.strip()  # Remove leading/trailing whitespace

            match_head = head_pattern.match(line)
            match_section = section_pattern.match(line)
            match_content = content_pattern.match(line)

            if match_head:
                current_head = match_head.group(2)
                current_section = None
                current_content = None
            elif match_section:
                current_section = match_section.group(2)
                current_content = None
            elif match_content:
                current_content = match_content.group(3)
                if current_section and current_head:  # Make sure section and head are defined
                # Create a dictionary and add it to the result list
                    result_list.append({
                        'head': current_head,
                        'section': current_section,
                        'content': current_content
                    })
            elif (len(line) > 0) and (not line[0].isdigit()):
                # This is a continuation line, append to current_content
                if result_list[-1]['content'] is not None:
                    result_list[-1]['content'] += " " + line

        rule_table = table(
            "duel_master_rule",
            sa.Column('head', sa.Text(), nullable=False),
            sa.Column('section', sa.Text()),
            sa.Column('content', sa.Text(), nullable=False),
        )
        op.bulk_insert(rule_table, result_list)

    op.create_table(
        'duel_master_zone',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('zone_name', sa.String(length=50), nullable=False),
        sa.Column('card_type_like', sa.Text()),
        sa.Column('type_regex', sa.String(length=50)),
        sa.PrimaryKeyConstraint('id')
    )

    zone_table = table(
        "duel_master_zone",
        sa.Column('zone_name', sa.String(length=50), nullable=False),
        sa.Column('card_type_like', sa.Text()),
        sa.Column('type_regex', sa.String(length=50))
    )
    op.bulk_insert(zone_table, [
        {"zone_name": "Battle Zone","card_type_like": "", "type_regex": ""},
        {"zone_name": "Deck","card_type_like": "", "type_regex": ""},
        {"zone_name": "Graveyard","card_type_like": "", "type_regex": ""},
        {"zone_name": "Hand","card_type_like": "", "type_regex": ""},
        {"zone_name": "Mana Zone","card_type_like": "", "type_regex": ""},
        {"zone_name": "Shield Zone","card_type_like": "", "type_regex": ""},
        {"zone_name": "Hyperspatial Zone","card_type_like": "Psychic", "type_regex": "^(Psychic|Dragheart)\s(.*)$"},
        {"zone_name": "Super Gacharange Zone","card_type_like": "Gacharange", "type_regex": "^(Gacharange)\s(.*)$"},
    ])

    op.add_column('deck_details', sa.Column('zone', sa.Integer(), default= 2))



def downgrade() -> None:
    op.drop_table('duel_master_rule')
    op.drop_table('duel_master_zone')
    op.drop_column('deck_details', 'zone')
