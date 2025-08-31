"""create user, userdata, events, followers, goals, attendee_relation_table (safe if already present)"""
from alembic import op
import sqlalchemy as sa

# Alembic identifiers
revision = "26e518bdd568"
down_revision = "79d14d3b2490"
branch_labels = None
depends_on = None


def _has_table(name: str, schema: str | None = "public") -> bool:
    """Return True if the table already exists."""
    bind = op.get_bind()
    insp = sa.inspect(bind)
    # some dialects have has_table; otherwise fall back to get_table_names
    try:
        # type: ignore[attr-defined]
        return insp.has_table(name, schema=schema)
    except Exception:
        return name in set(insp.get_table_names(schema=schema))


def upgrade():
    schema = "public"  # PG default schema

    if not _has_table("user", schema):
        op.create_table(
            "user",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("email", sa.String(length=120), nullable=False),
            sa.Column("password", sa.String(), nullable=False),
            sa.Column("is_active", sa.Boolean(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("email"),
        )

    if not _has_table("userdata", schema):
        op.create_table(
            "userdata",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("username", sa.String(length=120), nullable=False),
            sa.Column("first_name", sa.String(length=120), nullable=False),
            sa.Column("last_name", sa.String(length=120), nullable=False),
            sa.Column("email", sa.String(length=120), nullable=False),
            sa.Column("password", sa.String(), nullable=False),
            sa.Column("gender", sa.String(length=10), nullable=True),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("email"),
            sa.UniqueConstraint("username"),
        )

    if not _has_table("events", schema):
        op.create_table(
            "events",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("name", sa.String(), nullable=False),
            sa.Column("date", sa.Date(), nullable=False),
            sa.Column("time", sa.Time(), nullable=False),
            sa.Column("timezone", sa.String(), nullable=True),
            sa.Column("visibility", sa.String(), nullable=False),
            sa.Column("host_id", sa.Integer(), nullable=False),
            sa.Column("repeat", sa.JSON(), nullable=True),
            sa.Column("description", sa.String(), nullable=True),
            sa.Column("timer", sa.JSON(), nullable=True),
            sa.ForeignKeyConstraint(["host_id"], ["userdata.id"]),
            sa.PrimaryKeyConstraint("id"),
        )

    if not _has_table("followers", schema):
        op.create_table(
            "followers",
            sa.Column("follower_id", sa.Integer(), nullable=False),
            sa.Column("followed_id", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(["followed_id"], ["userdata.id"]),
            sa.ForeignKeyConstraint(["follower_id"], ["userdata.id"]),
            sa.PrimaryKeyConstraint("follower_id", "followed_id"),
        )

    if not _has_table("goals", schema):
        op.create_table(
            "goals",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("name", sa.String(), nullable=False),
            sa.Column("visibility", sa.String(), nullable=False),
            sa.Column("host_id", sa.Integer(), nullable=False),
            sa.Column("goalAmount", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(["host_id"], ["userdata.id"]),
            sa.PrimaryKeyConstraint("id"),
        )

    if not _has_table("attendee_relation_table", schema):
        op.create_table(
            "attendee_relation_table",
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("event_id", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(["event_id"], ["events.id"]),
            sa.ForeignKeyConstraint(["user_id"], ["userdata.id"]),
            sa.PrimaryKeyConstraint("user_id", "event_id"),
        )


def downgrade():
    # Use raw SQL to avoid errors if the table is already gone
    op.execute('DROP TABLE IF EXISTS "attendee_relation_table" CASCADE')
    op.execute('DROP TABLE IF EXISTS "goals" CASCADE')
    op.execute('DROP TABLE IF EXISTS "followers" CASCADE')
    op.execute('DROP TABLE IF EXISTS "events" CASCADE')
    op.execute('DROP TABLE IF EXISTS "userdata" CASCADE')
    op.execute('DROP TABLE IF EXISTS "user" CASCADE')
