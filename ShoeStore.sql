-- =====================================================
-- DATABASE: ShoeStore
-- Mô tả: Cơ sở dữ liệu website bán giày trực tuyến
-- Nền tảng: Supabase / PostgreSQL
-- =====================================================

-- =========================
-- PRODUCTS
-- =========================

create table products (
  id bigint generated always as identity primary key,
  name text not null,
  brand text not null,
  price int not null,
  img text,
  category text
);

alter table products enable row level security;

create policy "public read products"
on products
for select
to public
using (true);

create policy "public insert products"
on products
for insert
to public
with check (true);

create policy "public update products"
on products
for update
to public
using (true);

create policy "public delete products"
on products
for delete
to public
using (true);

-- =========================
-- USERS
-- =========================

create table users (
  id bigint generated always as identity primary key,
  username text unique not null,
  password text not null,
  role text default 'user'
);

alter table users enable row level security;

create policy "public register"
on users
for insert
to public
with check (true);

create policy "public login"
on users
for select
to public
using (true);

insert into users (username, password, role)
values
('admin','123456','admin');

-- =========================
-- ORDERS
-- =========================

create table orders (
  id bigint generated always as identity primary key,
  username text,
  product_name text,
  price int,
  created_at timestamp default now()
);

alter table orders enable row level security;

create policy "public read orders"
on orders
for select
to public
using (true);

create policy "public insert orders"
on orders
for insert
to public
with check (true);

-- =========================
-- SAMPLE PRODUCTS
-- =========================

insert into products (name, brand, price, img, category)
values

('Nike Air Force 1','Nike',2500000,'https://picsum.photos/400?1','Sneaker'),
('Nike Air Max 270','Nike',3200000,'https://picsum.photos/400?2','Running'),
('Nike Dunk Low','Nike',2900000,'https://picsum.photos/400?3','Sneaker'),
('Nike Pegasus 41','Nike',3500000,'https://picsum.photos/400?4','Running'),

('Adidas Ultraboost Light','Adidas',3900000,'https://picsum.photos/400?5','Running'),
('Adidas Superstar','Adidas',2400000,'https://picsum.photos/400?6','Sneaker'),
('Adidas Stan Smith','Adidas',2200000,'https://picsum.photos/400?7','Casual'),
('Adidas Campus 00s','Adidas',2700000,'https://picsum.photos/400?8','Sneaker'),

('Puma RS-X','Puma',2800000,'https://picsum.photos/400?9','Sneaker'),
('Puma Velocity Nitro','Puma',3100000,'https://picsum.photos/400?10','Running'),
('Puma Smash V2','Puma',1800000,'https://picsum.photos/400?11','Casual'),

('Converse Chuck Taylor High','Converse',1800000,'https://picsum.photos/400?12','Casual'),
('Converse Chuck Taylor Low','Converse',1700000,'https://picsum.photos/400?13','Casual'),
('Converse Run Star Hike','Converse',2600000,'https://picsum.photos/400?14','Sneaker'),

('Vans Old Skool','Vans',1900000,'https://picsum.photos/400?15','Skate'),
('Vans Authentic','Vans',1600000,'https://picsum.photos/400?16','Casual'),
('Vans Knu Skool','Vans',2400000,'https://picsum.photos/400?17','Skate'),

('New Balance 550','New Balance',2900000,'https://picsum.photos/400?18','Sneaker'),
('New Balance 530','New Balance',2600000,'https://picsum.photos/400?19','Sneaker'),
('New Balance Fresh Foam X','New Balance',3600000,'https://picsum.photos/400?20','Running');
