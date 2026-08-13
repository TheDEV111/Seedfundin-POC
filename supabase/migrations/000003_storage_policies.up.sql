-- Create storage bucket if it doesn't exist (failsafe)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('properties', 'properties', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the 'properties' bucket
-- Allow anyone to read the images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'properties' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload properties" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'properties' 
    AND auth.role() = 'authenticated'
);

-- Allow users to update their own images
CREATE POLICY "Users can update own properties" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'properties' 
    AND auth.uid() = owner
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own properties" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'properties' 
    AND auth.uid() = owner
);
