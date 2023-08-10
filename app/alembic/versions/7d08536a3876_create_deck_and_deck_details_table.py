"""create deck and deck_details table

Revision ID: 7d08536a3876
Revises: a8baaac520c4
Create Date: 2023-08-10 10:36:13.117720

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7d08536a3876'
down_revision = 'a8baaac520c4'
branch_labels = None
depends_on = 'a8baaac520c4'


def upgrade() -> None:
    op.create_table(
        "deck",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("deck_name", sa.String(length=20)),
        sa.Column("deck_info", sa.String(length=100), nullable=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id")),
        sa.Column("is_private", sa.Boolean(), default=False),
        sa.Column("is_complete", sa.Boolean(), default=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "deck_details",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("deck_id", sa.Integer(), sa.ForeignKey("deck.id")),
        sa.Column("deck_card_id", sa.Integer()),
        sa.Column("deck_card_count", sa.Integer()),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("deck_details")
    op.drop_table("deck")
