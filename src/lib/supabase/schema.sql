
-- IDEAS table
create table public.ideas (
  id uuid primary key default uuid_generate_v4(),
  created_by text not null,
  created_at timestamp with time zone default now(),
  status text not null check (status in ('released', 'ongoing', 'consideration', 'backlog')),
  title text not null,
  description text not null
);

-- Enable Row Level Security
alter table public.ideas enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access to ideas" 
  on public.ideas for select 
  using (true);

-- COMMENTS table
create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  idea_id uuid references public.ideas(id) on delete cascade not null,
  created_by text not null,
  created_at timestamp with time zone default now(),
  comment text not null
);

-- Enable Row Level Security
alter table public.comments enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access to comments" 
  on public.comments for select 
  using (true);

-- UPVOTES table
create table public.upvotes (
  id uuid primary key default uuid_generate_v4(),
  idea_id uuid references public.ideas(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  created_by text,
  email text,
  unique(idea_id, email)
);

-- Enable Row Level Security
alter table public.upvotes enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access to upvotes" 
  on public.upvotes for select 
  using (true);
