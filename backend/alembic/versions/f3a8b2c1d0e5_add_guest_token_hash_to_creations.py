"""add guest_token_hash to creations

Revision ID: f3a8b2c1d0e5
Revises: ede4bede6d77
Create Date: 2026-10-29 13:10:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f3a8b2c1d0e5'
down_revision: Union[str, None] = 'ede4bede6d77'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('creations', sa.Column('guest_token_hash', sa.String(length=128), nullable=True))


def downgrade() -> None:
    op.drop_column('creations', 'guest_token_hash')
