Smart Bookmark App

A simple full-stack bookmark manager built using Next.js (App Router), Supabase, and Tailwind CSS.

The application allows users to log in using Google OAuth and manage their personal bookmarks with real-time updates.

Live Demo:
https://smart-bookmark-app-beryl.vercel.app

Repository:
https://github.com/Rajhebballi/smart-bookmark-app

Features

Google OAuth authentication (no email/password login)

Each user has private bookmarks (user-isolated data)

Add bookmarks (URL + title)

Delete bookmarks

Real-time updates across multiple tabs

Protected routes (unauthenticated users redirected to login)

Deployed on Vercel (production ready)

Tech Stack

Frontend:

Next.js (App Router)

Tailwind CSS

Backend / BaaS:

Supabase

Authentication (Google OAuth)

Postgres Database

Realtime subscriptions

Deployment:

Vercel

Architecture Overview

Client (Next.js)
→ Supabase Auth (Google OAuth)
→ Supabase Database (Postgres)
→ Supabase Realtime (WebSocket channel)

Flow:

User logs in via Google

Supabase returns session

User ID is stored in bookmarks table

All queries are filtered by user_id

Realtime subscription listens for INSERT and DELETE events

Database Schema

Table: bookmarks

Columns:

id (uuid, primary key)

created_at (timestamp)

user_id (uuid, foreign key → auth.users)

title (text)

url (text)

Row Level Security (RLS) enabled:

Policies:

Users can insert bookmarks only where user_id = auth.uid()

Users can select only their own bookmarks

Users can delete only their own bookmarks

This ensures strict data isolation between users.

Environment Variables

The following environment variables are required:

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

These were configured in:

Vercel → Project → Settings → Environment Variables

Local Development Setup

Clone repository

git clone https://github.com/Rajhebballi/smart-bookmark-app.git

cd smart-bookmark-app

Install dependencies

npm install

Create .env.local file

Add:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Run development server

npm run dev

Open http://localhost:3000

OAuth Configuration (Production)

Supabase → Authentication → URL Configuration

Site URL:
https://smart-bookmark-app-beryl.vercel.app

Redirect URL:
https://smart-bookmark-app-beryl.vercel.app/auth/callback

Google Cloud Console:

Authorized JavaScript Origins:
https://smart-bookmark-app-beryl.vercel.app

Authorized Redirect URI:
https://<project-id>.supabase.co/auth/v1/callback

Real-time Implementation

Supabase Realtime is enabled on the bookmarks table.

The client subscribes to:

INSERT events

DELETE events

When a bookmark is added in one tab,
other open sessions instantly receive the update without refreshing.

Route Protection

Middleware checks session

If no active session → redirect to /login

Prevents direct access to protected routes like /dashboard

Challenges Faced

OAuth redirect mismatch in production
Fixed by updating Site URL and Authorized JavaScript Origins.

Hydration mismatch (Next.js SSR issue)
Fixed by ensuring Supabase client runs only on client side.

Real-time not triggering
Fixed by enabling replication on bookmarks table and verifying subscription channel.

Environment variables not loading in production
Fixed by properly setting them in Vercel dashboard.

What I Learned

Proper OAuth configuration between Supabase and Google

Row Level Security implementation for user isolation

Realtime subscriptions using Supabase channels

Production deployment nuances (environment variables, redirect URLs)

Handling SSR vs client-side rendering in Next.js App Router

Future Improvements

Bookmark editing feature

Input validation & URL normalization

Search / filter bookmarks

Custom domain setup

Rate limiting & analytics

Submission Checklist

Google OAuth only (no password login)

Private user bookmarks

Real-time updates across tabs

Delete functionality

Deployed on Vercel

Working production URL

Clean README with explanation

All requirements from the screening task have been implemented.