"""Add new table

Revision ID: a2fabc2b95f6
Revises: 
Create Date: 2023-04-23 14:42:18.071822

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a2fabc2b95f6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
     op.create_table('cardDataBase',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('name', sa.Text()),
        sa.Column('image', sa.Text()),
        sa.Column('civilization', sa.Text()),
        sa.Column('cardtype', sa.Text()),
        sa.Column('manacost', sa.Text()),
        sa.Column('race', sa.Text()),
        sa.Column('power', sa.Text()),
        sa.Column('englishtext', sa.Text()),
        sa.Column('subtype', sa.Text()),
        sa.Column('mananumber', sa.Integer(), default=0),
        sa.Column('link', sa.Text()),
        sa.PrimaryKeyConstraint('id')
    ),
     
     op.create_table('categories',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('categories',sa.Text()),
        sa.Column('link', sa.Text()),
        sa.PrimaryKeyConstraint('id')
    ),
     
     op.create_table('sets',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('set',sa.Text()),
        sa.Column('set_link', sa.Text()),
        sa.Column('card_link', sa.Text()),
        sa.PrimaryKeyConstraint('id')
    ),
     op.create_table('crawler_task',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('task_name',sa.Text()),
        sa.Column('status', sa.Text()),
        sa.Column('massage', sa.Text()),
        sa.Column('start_at', sa.DateTime(), default="NOW()"),
        sa.Column('end_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('cardDataBase'),
    op.drop_table('categories'),
    op.drop_table('sets'),
    op.drop_table('crawler_task')
