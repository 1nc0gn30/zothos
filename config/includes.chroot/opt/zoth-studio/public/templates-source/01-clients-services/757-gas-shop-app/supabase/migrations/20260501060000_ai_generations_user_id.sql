-- Migration: Add user_id to ai_generations
-- Date: 2026-05-01

-- Add user_id column to track which user created the generation
ALTER TABLE public.ai_generations
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON public.ai_generations(user_id);

-- Update RLS policy to allow users to view their own generations
DROP POLICY IF EXISTS "Users can view own AI generations" ON public.ai_generations;
CREATE POLICY "Users can view own AI generations"
ON public.ai_generations FOR SELECT
USING (user_id = auth.uid());

COMMENT ON COLUMN public.ai_generations.user_id IS 'The user who initiated this AI generation';
