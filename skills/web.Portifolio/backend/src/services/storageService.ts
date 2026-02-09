import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const bucketName = 'portfolio-assets';

const supabase = createClient(supabaseUrl, supabaseKey);

export const storageService = {
    async uploadFile(file: Express.Multer.File): Promise<string> {
        const fileContent = await fs.readFile(file.path);
        const filePath = `projects/${Date.now()}-${file.originalname}`;

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, fileContent, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error('Failed to upload file to Supabase');
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return publicUrl;
    },

    async deleteFile(filePath: string): Promise<void> {
        // Extract the path from the public URL if necessary, 
        // but it's better to store the relative path in the DB too.
        // For now, assuming filePath is the path within the bucket.
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) {
            console.error('Supabase delete error:', error);
        }
    }
};
