/*
  # Create notes table and security policies

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `text` (text)
      - `label` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `notes` table
    - Add policies for authenticated users to:
      - Read their own notes
      - Create new notes
      - Delete their own notes
*/

CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  text text NOT NULL,
  label text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX notes_user_id_idx ON notes(user_id);
CREATE INDEX notes_created_at_idx ON notes(created_at DESC);