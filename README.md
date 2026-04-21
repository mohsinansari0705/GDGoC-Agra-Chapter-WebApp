# GDGoC Agra Chapter Web App

[![Live Site](https://img.shields.io/badge/Live-gdgagra.xyz-0A66C2?style=for-the-badge&logo=vercel&logoColor=white)](https://gdgagra.xyz) [![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/) [![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/) [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/) [![License](https://img.shields.io/badge/License-MIT-1f2937?style=for-the-badge)](LICENSE)

A production-ready web platform for **Google Developer Groups on Campus - Sharda University Agra**.

This repository powers:
- A public-facing chapter website (events, members, gallery, resources, blog, contact)
- A role-based admin dashboard for content and team management
- A Supabase-backed data layer (Auth, Postgres, RLS, RPC, Storage)

Live domain: **https://gdgagra.xyz**  
Deployment: **Vercel**

## Table of Contents

- [Project Overview](#project-overview)
- [Screenshots](#screenshots)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Admin Roles and Access](#admin-roles-and-access)
- [Database and Backend Design](#database-and-backend-design)
- [Local Development](#local-development)
- [Supabase Setup](#supabase-setup)
- [Deployment](#deployment)
- [Repository Structure](#repository-structure)
- [Legacy Prototype Folder](#legacy-prototype-folder)
- [Troubleshooting](#troubleshooting)
- [Author](#author)

## Project Overview

This project is built as a complete chapter operations platform, not just a showcase site.

It allows the GDGoC team to:
- Publish and manage events with detailed timelines/themes/prizes
- Manage member hierarchy (Lead Organizer, Heads, Co-Heads, Executives)
- Publish blog posts and learning resources
- Curate community gallery content
- Operate through a secure admin panel with role-based permissions

It allows visitors to:
- Explore upcoming/live/completed events
- View event details pages
- Browse team members and chapter structure
- Discover resources and interact via likes/views
- Read published blogs and connect through contact channels

## Screenshots

### Home Page

![Home Page - dark](./src/assets/Home%20Page%20-%20dark.png)

### Admin Dashboard

![Admin Dashboard](./src/assets/Admin%20Dashboard.png)

## Core Features

### Public Website
- Home page with animated hero and featured events
- Events listing with category filters and status segmentation (Live, Upcoming, Completed)
- Event detail pages with schedule, themes, and prize sections
- Members page powered by hierarchical RPC ordering
- Gallery timeline and category filtering
- Resources page with search, category filters, likes, and detail pages
- Blog page with category filtering and published-only visibility
- Contact page with chapter information and FAQs
- Light/Dark mode using persisted theme preference

### Admin Panel
- Secure login workflow integrated with Supabase Auth + custom RPC validation
- Role-aware navigation and feature gating
- Dashboard overview cards and recent activity
- CRUD management modules:
	- Admins
	- Events
	- Members
	- Blog posts
	- Gallery
	- Resources
- Media uploads to Supabase Storage buckets (event images, member profiles, resource thumbnails)

## Tech Stack

### Frontend
- React 19
- React Router DOM 7
- Vite 6
- Tailwind CSS 3
- Framer Motion
- Lucide React + React Icons

### Backend and Data
- Supabase (PostgreSQL, Auth, Storage, RPC)
- Row Level Security (RLS) for role-based data security
- SQL trigger functions for validation, slug generation, audit logs, and timestamps

### Deployment
- Vercel (SPA rewrite configured via `vercel.json`)
- Custom domain: `gdgagra.xyz`

## Architecture

### App Routing
- `/` Home
- `/events` Events list
- `/events/:eventId` Event details (slug/id-based lookup)
- `/members` Members
- `/gallery` Gallery
- `/resources` Resources list
- `/resources/:slug` Resource details
- `/blog` Blog
- `/contact` Contact
- `/admin` Admin portal
- `/builder` Creator profile page

### State and Context
- `ThemeContext` for light/dark mode persistence
- `AdminContext` for auth session, admin role checks, and access control helpers

### Data Access Pattern
- Public pages use direct table reads and RPC functions depending on use case
- Admin modules use table operations and secure RPC procedures for sensitive actions
- Storage file uploads are organized by entity ID-based paths

## Admin Roles and Access

The project defines three admin types:

- `super_admin`
	- Full access (Admins, Members, Events, Gallery, Blogs, Resources)
- `admin`
	- Events + Gallery + content operations
- `least_access_admin` (Content Admin)
	- Blogs + Resources

Key behavior:
- Super Admin can manage admin accounts and full member data
- Non-super admins are restricted by RLS and service-side RPC checks
- Blog and resource visibility is owner-aware for non-super admins in admin workflows

## Database and Backend Design

### Main Tables
- `admins`
- `events`
- `event_timeline_items`
- `event_themes`
- `event_prizes`
- `members`
- `resources`
- `blog_posts`
- `gallery_items`
- `audit_log`

### Important SQL Capabilities
- Auth and role helper functions (`is_super_admin`, `is_admin`, etc.)
- Admin login validation and admin account lifecycle RPCs
- Members hierarchy RPC and management procedures
- Resource RPCs for listing, detail retrieval, likes, and views
- Trigger functions for:
	- Slug generation
	- Date validation
	- Audit logging
	- `updated_at` maintenance

### Storage Buckets
This app expects the following Supabase Storage buckets:
- `event-images`
- `member-profiles`
- `resource-thumbnails`

Storage access is governed by policies in `supabase/storage.sql`.

## Repository Structure

```text
.
|-- src/
|   |-- components/
|   |   |-- admin/
|   |-- context/
|   |-- lib/
|   |-- pages/
|   |-- utils/
|-- supabase/
|   |-- schema.sql
|   |-- functions.sql
|   |-- trigger-functions.sql
|   |-- rls-policies.sql
|   |-- storage.sql
|-- gdg/
|-- public/
|-- vercel.json
```

## Legacy Prototype Folder

The `gdg/` directory contains an earlier static multi-page version of the chapter website (HTML/CSS/JS).  
The primary production app is the React + Vite implementation in `src/`.

## Troubleshooting

- **Missing Supabase env vars**  
	Ensure `.env.local` contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

- **Admin login not working**  
	Verify matching values in `admins` table for email, team, and position, and ensure the related Auth account exists and is active.

- **Images not uploading**  
	Confirm buckets exist and storage policies are applied.

- **Empty public data sections**  
	Check content status rules (`published`, `upcoming`, `live`, `completed`, `is_active`) and RLS policy behavior.

## Author

**Mohsin Ansari**  
Built for GDGoC Sharda University Agra.

---

If this repo helps your GDGoC chapter, consider forking it and adapting the data model, team structure, and branding for your own campus community.
