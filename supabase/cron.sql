select cron.schedule (
        'everyday-clean-up-rooms',
        '0 0 * * *',
        $$
        delete from public.rooms
        where created_at < now() - interval '1 day' $$
    );
select cron.schedule (
        'everyday-clean-up-players',
        '0 0 * * *',
        $$
        delete from public.players
        where created_at < now() - interval '1 day' $$
    );
select cron.schedule (
        'everyday-clean-up-topics',
        '0 0 * * *',
        $$
        delete from public.topics
        where created_at < now() - interval '1 day' $$
    );
select cron.schedule('vacuum', '0 1 * * *', 'VACUUM');
select * from cron.job;