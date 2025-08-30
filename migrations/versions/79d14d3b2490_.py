"""dummy base revision so Alembic has a root"""
from alembic import op  # noqa: F401
import sqlalchemy as sa  # noqa: F401

revision = "79d14d3b2490"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    pass

def downgrade():
    pass
