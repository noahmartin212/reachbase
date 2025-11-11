# Database Schema Documentation

This document provides a detailed overview of the database schema for the Outreach Clone platform.

## Entity Relationship Diagram (Text Format)

```
┌─────────────────┐
│   workspaces    │
│─────────────────│
│ id (PK)         │
│ name            │
│ slug (UNIQUE)   │
│ settings        │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │
│ workspace_id FK │
│ email (UNIQUE)  │
│ password_hash   │
│ first_name      │
│ last_name       │
│ role (ENUM)     │
│ avatar_url      │
│ is_active       │
│ email_verified  │
│ last_login_at   │
│ settings        │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────────┐
│  email_accounts     │
│─────────────────────│
│ id (PK)             │
│ user_id (FK)        │
│ workspace_id (FK)   │
│ provider            │
│ email               │
│ display_name        │
│ access_token        │
│ refresh_token       │
│ token_expires_at    │
│ is_active           │
│ daily_send_limit    │
│ daily_sent_count    │
│ last_sent_reset     │
│ settings            │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐
│     accounts        │
│─────────────────────│
│ id (PK)             │
│ workspace_id (FK)   │
│ name                │
│ domain              │
│ industry            │
│ employee_count      │
│ annual_revenue      │
│ address             │
│ city                │
│ state               │
│ country             │
│ postal_code         │
│ phone               │
│ website             │
│ description         │
│ owner_id (FK)       │
│ custom_fields       │
│ created_at          │
│ updated_at          │
└─────────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────────┐
│     contacts        │
│─────────────────────│
│ id (PK)             │
│ workspace_id (FK)   │
│ account_id (FK)     │
│ email (UNIQUE)      │
│ first_name          │
│ last_name           │
│ title               │
│ phone               │
│ mobile              │
│ linkedin_url        │
│ twitter_handle      │
│ status (ENUM)       │
│ owner_id (FK)       │
│ tags []             │
│ custom_fields       │
│ unsubscribed        │
│ unsubscribed_at     │
│ bounced             │
│ last_contacted_at   │
│ created_at          │
│ updated_at          │
└─────────────────────┘
        │
        │ N:M (via enrollments)
        ▼
┌─────────────────────┐
│    sequences        │
│─────────────────────│
│ id (PK)             │
│ workspace_id (FK)   │
│ name                │
│ description         │
│ status (ENUM)       │
│ created_by (FK)     │
│ steps_count         │
│ settings            │
│ created_at          │
│ updated_at          │
└─────────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────────┐
│  sequence_steps     │
│─────────────────────│
│ id (PK)             │
│ sequence_id (FK)    │
│ step_number         │
│ subject             │
│ body                │
│ delay_days          │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────────┐
│ sequence_enrollments    │
│─────────────────────────│
│ id (PK)                 │
│ sequence_id (FK)        │
│ contact_id (FK)         │
│ user_id (FK)            │
│ email_account_id (FK)   │
│ current_step            │
│ status                  │
│ started_at              │
│ completed_at            │
│ paused_at               │
│ last_email_sent_at      │
│ next_email_scheduled_at │
│ created_at              │
│ updated_at              │
└─────────────────────────┘

┌─────────────────────┐
│      emails         │
│─────────────────────│
│ id (PK)             │
│ workspace_id (FK)   │
│ contact_id (FK)     │
│ user_id (FK)        │
│ email_account_id FK │
│ sequence_id (FK)    │
│ sequence_step_id FK │
│ enrollment_id (FK)  │
│ subject             │
│ body                │
│ to_address          │
│ cc_addresses []     │
│ bcc_addresses []    │
│ status (ENUM)       │
│ message_id          │
│ thread_id           │
│ scheduled_at        │
│ sent_at             │
│ delivered_at        │
│ opened_at           │
│ clicked_at          │
│ replied_at          │
│ bounced_at          │
│ open_count          │
│ click_count         │
│ error_message       │
│ retry_count         │
│ created_at          │
│ updated_at          │
└─────────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────────┐
│   email_events      │
│─────────────────────│
│ id (PK)             │
│ email_id (FK)       │
│ event_type          │
│ ip_address          │
│ user_agent          │
│ link_url            │
│ metadata            │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│       tasks         │
│─────────────────────│
│ id (PK)             │
│ workspace_id (FK)   │
│ user_id (FK)        │
│ contact_id (FK)     │
│ account_id (FK)     │
│ title               │
│ description         │
│ status (ENUM)       │
│ priority (ENUM)     │
│ due_at              │
│ completed_at        │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐
│    activities       │
│─────────────────────│
│ id (PK)             │
│ workspace_id (FK)   │
│ user_id (FK)        │
│ contact_id (FK)     │
│ account_id (FK)     │
│ type                │
│ subject             │
│ description         │
│ duration            │
│ metadata            │
│ occurred_at         │
│ created_at          │
└─────────────────────┘

┌─────────────────────────┐
│ password_reset_tokens   │
│─────────────────────────│
│ id (PK)                 │
│ user_id (FK)            │
│ token (UNIQUE)          │
│ expires_at              │
│ used                    │
│ created_at              │
└─────────────────────────┘
```

## Tables

### workspaces

Multi-tenant workspace/organization table. Each workspace represents a company using the platform.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `name` (VARCHAR): Workspace name
- `slug` (VARCHAR, UNIQUE): URL-friendly identifier
- `settings` (JSONB): Workspace-level settings
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Relationships:**
- One workspace has many users
- One workspace has many contacts
- One workspace has many accounts
- One workspace has many sequences
- One workspace has many emails
- One workspace has many tasks
- One workspace has many activities

---

### users

User accounts with role-based access control.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `workspace_id` (UUID, FK): Associated workspace
- `email` (VARCHAR, UNIQUE): User email
- `password_hash` (VARCHAR): Hashed password
- `first_name` (VARCHAR): First name
- `last_name` (VARCHAR): Last name
- `role` (ENUM): User role (admin, manager, sales_rep)
- `avatar_url` (TEXT): Profile picture URL
- `is_active` (BOOLEAN): Account status
- `email_verified` (BOOLEAN): Email verification status
- `last_login_at` (TIMESTAMP): Last login timestamp
- `settings` (JSONB): User preferences
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Relationships:**
- Belongs to one workspace
- Has many email accounts
- Owns many contacts
- Owns many accounts
- Creates many sequences
- Sends many emails
- Has many tasks

**Indexes:**
- `idx_users_workspace` on `workspace_id`
- `idx_users_email` on `email`

---

### email_accounts

Connected email accounts (Gmail, Outlook) for sending emails.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `user_id` (UUID, FK): Account owner
- `workspace_id` (UUID, FK): Associated workspace
- `provider` (VARCHAR): Email provider (gmail, outlook, smtp)
- `email` (VARCHAR): Email address
- `display_name` (VARCHAR): Display name
- `access_token` (TEXT): Encrypted OAuth access token
- `refresh_token` (TEXT): Encrypted OAuth refresh token
- `token_expires_at` (TIMESTAMP): Token expiration
- `is_active` (BOOLEAN): Account status
- `daily_send_limit` (INTEGER): Max emails per day
- `daily_sent_count` (INTEGER): Emails sent today
- `last_sent_reset` (TIMESTAMP): Last daily counter reset
- `settings` (JSONB): Account settings
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Relationships:**
- Belongs to one user
- Belongs to one workspace
- Sends many emails

**Indexes:**
- `idx_email_accounts_user` on `user_id`
- `idx_email_accounts_workspace` on `workspace_id`

**Constraints:**
- UNIQUE(`user_id`, `email`)

---

### accounts

CRM account/company data.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `workspace_id` (UUID, FK): Associated workspace
- `name` (VARCHAR): Company name
- `domain` (VARCHAR): Company domain
- `industry` (VARCHAR): Industry
- `employee_count` (VARCHAR): Number of employees
- `annual_revenue` (DECIMAL): Annual revenue
- `address` (TEXT): Street address
- `city` (VARCHAR): City
- `state` (VARCHAR): State/province
- `country` (VARCHAR): Country
- `postal_code` (VARCHAR): Postal/ZIP code
- `phone` (VARCHAR): Phone number
- `website` (TEXT): Website URL
- `description` (TEXT): Company description
- `owner_id` (UUID, FK): Account owner
- `custom_fields` (JSONB): Custom fields
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Relationships:**
- Belongs to one workspace
- Owned by one user
- Has many contacts

**Indexes:**
- `idx_accounts_workspace` on `workspace_id`
- `idx_accounts_owner` on `owner_id`

---

### contacts

Contact/lead information.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `workspace_id` (UUID, FK): Associated workspace
- `account_id` (UUID, FK): Associated account
- `email` (VARCHAR): Contact email
- `first_name` (VARCHAR): First name
- `last_name` (VARCHAR): Last name
- `title` (VARCHAR): Job title
- `phone` (VARCHAR): Phone number
- `mobile` (VARCHAR): Mobile number
- `linkedin_url` (TEXT): LinkedIn profile
- `twitter_handle` (VARCHAR): Twitter handle
- `status` (ENUM): Contact status (new, contacted, engaged, qualified, opportunity, customer, churned)
- `owner_id` (UUID, FK): Contact owner
- `tags` (TEXT[]): Tags array
- `custom_fields` (JSONB): Custom fields
- `unsubscribed` (BOOLEAN): Unsubscribe status
- `unsubscribed_at` (TIMESTAMP): Unsubscribe timestamp
- `bounced` (BOOLEAN): Bounce status
- `last_contacted_at` (TIMESTAMP): Last contact timestamp
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Relationships:**
- Belongs to one workspace
- Belongs to one account (optional)
- Owned by one user
- Enrolled in many sequences (via enrollments)
- Receives many emails
- Has many tasks
- Has many activities

**Indexes:**
- `idx_contacts_workspace` on `workspace_id`
- `idx_contacts_account` on `account_id`
- `idx_contacts_email` on `email`
- `idx_contacts_owner` on `owner_id`
- `idx_contacts_status` on `status`

**Constraints:**
- UNIQUE(`workspace_id`, `email`)

---

### sequences

Email sequence/campaign definitions.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `workspace_id` (UUID, FK): Associated workspace
- `name` (VARCHAR): Sequence name
- `description` (TEXT): Description
- `status` (ENUM): Status (active, paused, completed, archived)
- `created_by` (UUID, FK): Creator user
- `steps_count` (INTEGER): Number of steps
- `settings` (JSONB): Sequence settings
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Relationships:**
- Belongs to one workspace
- Created by one user
- Has many sequence steps
- Has many enrollments

**Indexes:**
- `idx_sequences_workspace` on `workspace_id`
- `idx_sequences_status` on `status`

---

### sequence_steps

Individual email templates in a sequence.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `sequence_id` (UUID, FK): Parent sequence
- `step_number` (INTEGER): Step order
- `subject` (VARCHAR): Email subject
- `body` (TEXT): Email body (supports variables)
- `delay_days` (INTEGER): Days to wait after previous step
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Relationships:**
- Belongs to one sequence

**Indexes:**
- `idx_sequence_steps_sequence` on `sequence_id`

**Constraints:**
- UNIQUE(`sequence_id`, `step_number`)

---

### sequence_enrollments

Contacts enrolled in sequences.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `sequence_id` (UUID, FK): Associated sequence
- `contact_id` (UUID, FK): Enrolled contact
- `user_id` (UUID, FK): Managing sales rep
- `email_account_id` (UUID, FK): Sending email account
- `current_step` (INTEGER): Current step number
- `status` (VARCHAR): Status (active, paused, completed, bounced, unsubscribed, replied)
- `started_at` (TIMESTAMP): Start timestamp
- `completed_at` (TIMESTAMP): Completion timestamp
- `paused_at` (TIMESTAMP): Pause timestamp
- `last_email_sent_at` (TIMESTAMP): Last email sent
- `next_email_scheduled_at` (TIMESTAMP): Next scheduled email
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Relationships:**
- Belongs to one sequence
- Belongs to one contact
- Managed by one user
- Uses one email account

**Indexes:**
- `idx_enrollments_sequence` on `sequence_id`
- `idx_enrollments_contact` on `contact_id`
- `idx_enrollments_status` on `status`
- `idx_enrollments_next_scheduled` on `next_email_scheduled_at` (WHERE status = 'active')

**Constraints:**
- UNIQUE(`sequence_id`, `contact_id`)

---

### emails

Individual emails sent or scheduled.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `workspace_id` (UUID, FK): Associated workspace
- `contact_id` (UUID, FK): Recipient contact
- `user_id` (UUID, FK): Sending user
- `email_account_id` (UUID, FK): Sending account
- `sequence_id` (UUID, FK): Associated sequence (if any)
- `sequence_step_id` (UUID, FK): Associated step (if any)
- `enrollment_id` (UUID, FK): Associated enrollment (if any)
- `subject` (VARCHAR): Email subject
- `body` (TEXT): Email body
- `to_address` (VARCHAR): Recipient address
- `cc_addresses` (TEXT[]): CC addresses
- `bcc_addresses` (TEXT[]): BCC addresses
- `status` (ENUM): Status (draft, scheduled, sent, delivered, opened, clicked, replied, bounced, failed)
- `message_id` (VARCHAR, UNIQUE): External message ID
- `thread_id` (VARCHAR): Conversation thread ID
- `scheduled_at` (TIMESTAMP): Schedule timestamp
- `sent_at` (TIMESTAMP): Send timestamp
- `delivered_at` (TIMESTAMP): Delivery timestamp
- `opened_at` (TIMESTAMP): First open timestamp
- `clicked_at` (TIMESTAMP): First click timestamp
- `replied_at` (TIMESTAMP): Reply timestamp
- `bounced_at` (TIMESTAMP): Bounce timestamp
- `open_count` (INTEGER): Number of opens
- `click_count` (INTEGER): Number of clicks
- `error_message` (TEXT): Error message (if failed)
- `retry_count` (INTEGER): Retry attempts
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Relationships:**
- Belongs to one workspace
- Sent to one contact
- Sent by one user
- Sent from one email account
- Part of one sequence (optional)
- Part of one enrollment (optional)
- Has many email events

**Indexes:**
- `idx_emails_workspace` on `workspace_id`
- `idx_emails_contact` on `contact_id`
- `idx_emails_user` on `user_id`
- `idx_emails_status` on `status`
- `idx_emails_scheduled` on `scheduled_at` (WHERE status = 'scheduled')
- `idx_emails_message_id` on `message_id`

---

### email_events

Email tracking events (opens, clicks, etc.).

**Columns:**
- `id` (UUID, PK): Unique identifier
- `email_id` (UUID, FK): Associated email
- `event_type` (VARCHAR): Event type (sent, delivered, opened, clicked, bounced, replied)
- `ip_address` (INET): IP address
- `user_agent` (TEXT): User agent
- `link_url` (TEXT): Clicked link URL (for click events)
- `metadata` (JSONB): Additional event data
- `created_at` (TIMESTAMP): Event timestamp

**Relationships:**
- Belongs to one email

**Indexes:**
- `idx_email_events_email` on `email_id`
- `idx_email_events_type` on `event_type`

---

### tasks

Task management for sales reps.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `workspace_id` (UUID, FK): Associated workspace
- `user_id` (UUID, FK): Assigned user
- `contact_id` (UUID, FK): Related contact
- `account_id` (UUID, FK): Related account
- `title` (VARCHAR): Task title
- `description` (TEXT): Task description
- `status` (ENUM): Status (pending, in_progress, completed, cancelled)
- `priority` (ENUM): Priority (low, medium, high, urgent)
- `due_at` (TIMESTAMP): Due date
- `completed_at` (TIMESTAMP): Completion timestamp
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Relationships:**
- Belongs to one workspace
- Assigned to one user
- Related to one contact (optional)
- Related to one account (optional)

**Indexes:**
- `idx_tasks_workspace` on `workspace_id`
- `idx_tasks_user` on `user_id`
- `idx_tasks_status` on `status`
- `idx_tasks_due` on `due_at`

---

### activities

Activity log (calls, meetings, notes).

**Columns:**
- `id` (UUID, PK): Unique identifier
- `workspace_id` (UUID, FK): Associated workspace
- `user_id` (UUID, FK): User who performed activity
- `contact_id` (UUID, FK): Related contact
- `account_id` (UUID, FK): Related account
- `type` (VARCHAR): Activity type (call, meeting, note, email)
- `subject` (VARCHAR): Subject/title
- `description` (TEXT): Description
- `duration` (INTEGER): Duration in minutes
- `metadata` (JSONB): Additional data
- `occurred_at` (TIMESTAMP): Activity timestamp
- `created_at` (TIMESTAMP): Record creation timestamp

**Relationships:**
- Belongs to one workspace
- Performed by one user
- Related to one contact (optional)
- Related to one account (optional)

**Indexes:**
- `idx_activities_workspace` on `workspace_id`
- `idx_activities_contact` on `contact_id`
- `idx_activities_account` on `account_id`

---

### password_reset_tokens

Password reset token management.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `user_id` (UUID, FK): Associated user
- `token` (VARCHAR, UNIQUE): Reset token
- `expires_at` (TIMESTAMP): Expiration timestamp
- `used` (BOOLEAN): Used status
- `created_at` (TIMESTAMP): Creation timestamp

**Relationships:**
- Belongs to one user

---

## Enumerations

### user_role
- `admin`: Full access to workspace
- `manager`: Team management access
- `sales_rep`: Standard sales user

### email_status
- `draft`: Not yet sent
- `scheduled`: Scheduled for future send
- `sent`: Successfully sent
- `delivered`: Confirmed delivery
- `opened`: Recipient opened
- `clicked`: Recipient clicked link
- `replied`: Recipient replied
- `bounced`: Delivery failed
- `failed`: Send failed

### sequence_status
- `active`: Currently running
- `paused`: Temporarily paused
- `completed`: Finished
- `archived`: Archived

### task_status
- `pending`: Not started
- `in_progress`: Currently working on
- `completed`: Finished
- `cancelled`: Cancelled

### task_priority
- `low`: Low priority
- `medium`: Medium priority
- `high`: High priority
- `urgent`: Urgent

### contact_status
- `new`: New lead
- `contacted`: Initial contact made
- `engaged`: Actively engaged
- `qualified`: Qualified lead
- `opportunity`: Sales opportunity
- `customer`: Converted to customer
- `churned`: Lost customer

---

## Key Features

### Automatic Timestamps
All tables have `created_at` and most have `updated_at` columns that are automatically managed by PostgreSQL triggers.

### UUID Primary Keys
All tables use UUID v4 for primary keys, providing globally unique identifiers.

### Indexes
Strategic indexes are created on foreign keys and frequently queried columns to optimize performance.

### JSONB Columns
Custom fields and settings use JSONB for flexible, queryable JSON storage.

### Soft Deletes
Most entities use cascading deletes, but you can implement soft deletes by adding `deleted_at` columns if needed.
