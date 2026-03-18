-- ============================================================
-- USERS  (managed by the app, no Supabase auth dependency)
-- ============================================================
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- CONTACTS
-- ============================================================
create table if not exists contacts (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references users(id) on delete cascade,
  name                    text not null,
  category                text not null check (category in ('friend','family','colleague','other')),
  target_frequency_days   integer not null check (target_frequency_days > 0),
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists contacts_user_id_idx on contacts(user_id);

-- ============================================================
-- CONTACT EVENTS
-- ============================================================
create table if not exists contact_events (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid not null references contacts(id) on delete cascade,
  user_id     uuid not null references users(id) on delete cascade,
  event_date  date not null,
  type        text not null check (type in ('call','text','email','in-person','other')),
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists contact_events_contact_id_idx on contact_events(contact_id);
create index if not exists contact_events_user_id_idx    on contact_events(user_id);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger contacts_updated_at
  before update on contacts
  for each row execute function set_updated_at();

-- ============================================================
-- VIEW: contact_with_status
-- ============================================================
create or replace view contact_with_status as
select
  c.id,
  c.user_id,
  c.name,
  c.category,
  c.target_frequency_days,
  c.notes,
  c.created_at,
  c.updated_at,
  max(e.event_date)                                                              as last_contact_date,
  extract(day from now() - max(e.event_date::timestamptz))::integer              as days_since_contact,
  (
    extract(day from now() - max(e.event_date::timestamptz))::integer
    - c.target_frequency_days
  )                                                                              as days_overdue,
  count(e.id)::integer                                                           as total_events
from contacts c
left join contact_events e on e.contact_id = c.id
group by c.id;
