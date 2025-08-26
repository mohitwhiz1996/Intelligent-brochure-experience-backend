const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
require("dotenv").config();

const supabaseS3Endpoint = process.env.SUPABASE_URL;

const s3 = new S3Client({
  region: "ap-south-1", // Can be any value, required by SDK
  endpoint: supabaseS3Endpoint,
  credentials: {
    accessKeyId: process.env.SUPABASE_ACCESS_KEY,
    secretAccessKey: process.env.SUPABASE_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function uploadFileToSupabase(key, localFilePath, contentType) {
  const fileStream = fs.createReadStream(localFilePath);

  const uploadParams = {
    Bucket: 'brochure',
    Key: key,
    Body: fileStream,
    ContentType: contentType,
    ACL: "public-read",
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log("File uploaded to Supabase Storage:", data);

    // Construct public URL
    const publicUrl = `https://cqexddujgclfhwnfymff.storage.supabase.co/storage/v1/object/brochure/${key}`;
    return publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

module.exports = { uploadFileToSupabase };
