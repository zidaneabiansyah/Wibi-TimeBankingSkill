import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

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
  for (const file of files) {
    try {
      console.log(`Downloading ${file} from private bucket...`);
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
      
      console.log(`Uploading ${file} to public 'wibi' bucket...`);
      await client.send(new PutObjectCommand({
        Bucket: "wibi",
        Key: file,
        Body: buffer,
        ContentType: "image/jpeg",
        ACL: "public-read"
      }));
      console.log(`✅ Successfully moved ${file} to wibi bucket!\n`);
    } catch (e) {
      console.error(`❌ Failed to move ${file}:`, e.message);
    }
  }
}
main();
