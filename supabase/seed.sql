create table public.rooms (
    id text not null,
    status text not null default 'waiting'::text,
    majority_word text null,
    wolf_word text null,
    game_sec integer not null default 300,
    end_at timestamp with time zone null,
    host_id uuid null,
    created_at timestamp with time zone not null default now(),
    constraint rooms_pkey primary key (id)
) tablespace pg_default;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

create table public.players (
    id uuid not null default gen_random_uuid (),
    player_name text not null,
    is_wolf boolean not null default false,
    is_voted boolean not null default false,
    voted_count integer not null default 0,
    room_id text null,
    created_at timestamp with time zone not null default now(),
    constraint players_pkey primary key (id),
    constraint players_room_id_fkey foreign key (room_id) references rooms (id) on delete cascade
) tablespace pg_default;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

create table public.topics (
    id uuid not null default gen_random_uuid (),
    category text not null,
    majority_word text not null,
    wolf_word text not null,
    room_id text null,
    created_at timestamp with time zone not null default now(),
    constraint topics_pkey primary key (id),
    constraint topics_room_id_fkey foreign key (room_id) references rooms (id) on delete cascade
) tablespace pg_default;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

alter table public.rooms
add constraint rooms_host_id_fkey foreign key (host_id) references players (id) on delete cascade;

-- Add policies
create policy "Policy to implement Time To Live (TTL)" on public.rooms as PERMISSIVE for
SELECT to anon using (
        created_at > (current_timestamp - interval '1 day')
    );
create policy "Policy to implement Time To Live (TTL)" on public.players as PERMISSIVE for
SELECT to anon using (
        created_at > (current_timestamp - interval '1 day')
    );

-- Enable Realtime
alter publication supabase_realtime
add table public.rooms;
alter publication supabase_realtime
add table public.players;

-- Enable the "pg_cron" extension
create extension pg_cron with schema extensions;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

-- Add function
create function voted_count_increment (row_id uuid) returns void
set search_path = '' as $$
update public.players
set voted_count = voted_count + 1
where id = row_id $$ language sql volatile;