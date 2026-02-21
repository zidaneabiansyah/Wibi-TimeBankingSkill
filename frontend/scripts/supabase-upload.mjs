import { S3Client, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// Configuration from provided values (or .env if available)
const config = {
  endpoint: "https://tcndwecpflgtsfwmniki.storage.supabase.co/storage/v1/s3", // Using user provided endpoint
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: "21379b6606a0bb8184c87706fb85339e", 
    secretAccessKey: "32be24fe443f1060b0010f1dba89346850a92c01be60aae5a8335f88e518d93f",
  },
};

const client = new S3Client({
  forcePathStyle: true,
  region: config.region,
  endpoint: config.endpoint,
  credentials: config.credentials,
});

async function main() {
  const command = process.argv[2];
  
  if (command === "list") {
    console.log("Listing buckets...");
    try {
      const data = await client.send(new ListBucketsCommand({}));
      console.log("Buckets:", data.Buckets.map(b => b.Name));
    } catch (err) {
      console.error("Error listing buckets:", err);
    }
  } else if (command === "upload") {
    const bucket = process.argv[3];
    const filePaths = process.argv.slice(4);
    
    if (!bucket || filePaths.length === 0) {
      console.log("Usage: node scripts/supabase-upload.mjs upload <bucket-name> <image-path-1> [image-path-2] ...");
      return;
    }

    console.log(`Uploading ${filePaths.length} files to bucket '${bucket}'...`);

    for (const filePath of filePaths) {
        try {
          const fileContent = fs.readFileSync(filePath);
          const fileName = path.basename(filePath);
          const uploadParams = {
            Bucket: bucket,
            Key: fileName,
            Body: fileContent,
            ContentType: "image/png", // You might want to detect this based on extension
            ACL: "public-read", 
          };
    
          await client.send(new PutObjectCommand(uploadParams));
          
          // Endpoint: https://.../storage/v1/s3
          // Public URL base: https://.../storage/v1/object/public
          const baseUrl = config.endpoint.replace('/s3', '/object/public');
          console.log(`✅ Uploaded: ${fileName}`);
          console.log(`   URL: ${baseUrl}/${bucket}/${fileName}`);
          console.log("-".repeat(40));
          
        } catch (err) {
            console.error(`❌ Error uploading ${filePath}:`, err.message);
        }
    }
  } else {
    console.log("Usage:");
    console.log("  node scripts/supabase-upload.mjs list");
    console.log("  node scripts/supabase-upload.mjs upload <bucket-name> <file1> <file2> ...");
  }
}

main();
