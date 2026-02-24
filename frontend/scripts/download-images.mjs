import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const config = {
  endpoint: "https://tcndwecpflgtsfwmniki.storage.supabase.co/storage/v1/s3", 
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
  const files = ["gambar1.jpg", "gambar2.jpg", "gambar3.jpg"];
  const outDir = path.join(process.cwd(), "public", "images", "team");
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const file of files) {
    try {
      console.log(`Downloading ${file} from wibiwibiwibi bucket...`);
      const getRes = await client.send(new GetObjectCommand({
        Bucket: "wibiwibiwibi",
        Key: file
      }));
      
      const streamToBuffer = async (stream) => {
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return Buffer.concat(chunks);
      };
      
      const buffer = await streamToBuffer(getRes.Body);
      
      fs.writeFileSync(path.join(outDir, file), buffer);
      console.log(`✅ Saved ${file} locally to public/images/team/`);
    } catch (e) {
      console.error(`❌ Failed to download ${file}:`, e.message);
    }
  }
}
main();
