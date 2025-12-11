-- Add length constraints to profiles table
ALTER TABLE public.profiles 
  ADD CONSTRAINT username_length CHECK (length(username) BETWEEN 2 AND 50),
  ADD CONSTRAINT bio_length CHECK (length(bio) <= 500),
  ADD CONSTRAINT avatar_url_length CHECK (length(avatar_url) <= 500);

-- Update handle_new_user function with input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  username_val text;
BEGIN
  -- Extract and sanitize username
  username_val := coalesce(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );
  
  -- Trim whitespace
  username_val := trim(username_val);
  
  -- Validate length (2-50 characters)
  IF length(username_val) < 2 THEN
    username_val := username_val || '_user';
  END IF;
  
  IF length(username_val) > 50 THEN
    username_val := left(username_val, 50);
  END IF;
  
  -- Replace any characters that are not alphanumeric, dash, or underscore
  username_val := regexp_replace(username_val, '[^a-zA-Z0-9_-]', '_', 'g');
  
  -- Ensure username is not empty after sanitization
  IF username_val = '' OR username_val IS NULL THEN
    username_val := 'user_' || substr(new.id::text, 1, 8);
  END IF;
  
  -- Create profile
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, username_val);
  
  -- Assign default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;