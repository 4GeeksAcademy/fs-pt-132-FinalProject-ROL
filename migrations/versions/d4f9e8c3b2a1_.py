"""change genres and platforms from ARRAY to JSON in user_survey

Revision ID: d4f9e8c3b2a1
Revises: b3b1c5a7d9e2
Create Date: 2026-05-17 19:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'd4f9e8c3b2a1'
down_revision = 'b3b1c5a7d9e2'
branch_labels = None
depends_on = None


def upgrade():
    # genres: ARRAY(VARCHAR(60)) → JSON
    op.alter_column('user_survey', 'genres',
                    existing_type=postgresql.ARRAY(sa.String(60)),
                    type_=sa.JSON(),
                    postgresql_using='genres::text::json')
    # platforms: ARRAY(VARCHAR(35)) → JSON
    op.alter_column('user_survey', 'platforms',
                    existing_type=postgresql.ARRAY(sa.String(35)),
                    type_=sa.JSON(),
                    postgresql_using='platforms::text::json')
    # favorite_themes: ARRAY(VARCHAR(50)) → JSON (already nullable)
    op.alter_column('user_survey', 'favorite_themes',
                    existing_type=postgresql.ARRAY(sa.String(50)),
                    type_=sa.JSON(),
                    postgresql_using='favorite_themes::text::json')


def downgrade():
    # JSON → ARRAY(VARCHAR(60))
    op.alter_column('user_survey', 'favorite_themes',
                    existing_type=sa.JSON(),
                    type_=postgresql.ARRAY(sa.String(50)))
    # JSON → ARRAY(VARCHAR(35))
    op.alter_column('user_survey', 'platforms',
                    existing_type=sa.JSON(),
                    type_=postgresql.ARRAY(sa.String(35)))
    # JSON → ARRAY(VARCHAR(60))
    op.alter_column('user_survey', 'genres',
                    existing_type=sa.JSON(),
                    type_=postgresql.ARRAY(sa.String(60)))
