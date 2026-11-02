-- Blog feedback: threaded comments and one star rating per visitor per post.
-- Apply with `npm run db:migrate` (idempotent).

create table if not exists blog_comments (
  id          bigint generated always as identity primary key,
  post_slug   text        not null,
  parent_id   bigint      references blog_comments (id) on delete cascade,
  concept     text,                         -- section id the comment is about; null = the whole post
  author_name text        not null check (char_length(author_name) between 2 and 60),
  body        text        not null check (char_length(body) between 2 and 2000),
  visitor_id  uuid        not null,         -- anonymous id from the ar_vid cookie
  ip_hash     text        not null,         -- salted hash, only used for rate limiting
  hidden      boolean     not null default false, -- moderation: set true to remove a comment
  created_at  timestamptz not null default now()
);

create index if not exists blog_comments_post_idx on blog_comments (post_slug, created_at);
create index if not exists blog_comments_rate_idx on blog_comments (ip_hash, created_at);

create table if not exists blog_ratings (
  post_slug  text        not null,
  visitor_id uuid        not null,
  stars      smallint    not null check (stars between 1 and 5),
  ip_hash    text        not null,
  updated_at timestamptz not null default now(),
  primary key (post_slug, visitor_id)
);
