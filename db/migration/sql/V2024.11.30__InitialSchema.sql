CREATE TABLE
  duel_data.[user] (
    id UNIQUEIDENTIFIER PRIMARY KEY NOT NULL,
    user_id UNIQUEIDENTIFIER NULL,
    email NVARCHAR (100) NULL,
    name NVARCHAR (100) NULL,
    instagram_handle NVARCHAR (100) NULL,
    tiktok_handle NVARCHAR (100) NULL,
    joined_at DATETIME2 NULL,
    created_on DATETIME2 NOT NULL,
    created_by NVARCHAR (MAX) NOT NULL,
    updated_on DATETIME2 NOT NULL,
    updated_by NVARCHAR (MAX) NOT NULL
  );
