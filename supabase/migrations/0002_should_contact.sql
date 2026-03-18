alter table contacts
  add column if not exists should_contact boolean not null default false;

drop view if exists contact_with_status;

create view contact_with_status as
select
  c.id,
  c.user_id,
  c.name,
  c.category,
  c.target_frequency_days,
  c.notes,
  c.should_contact,
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
