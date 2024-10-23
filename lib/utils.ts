import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//S3 upload
// @ts-expect-error: Environment variables are not typed
export const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadFileToS3({
  file,
  fileName,
}: {
  file: Blob;
  fileName: string;
}) {
  console.log(fileName);

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: file,
    // ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  // upload file to presigned url
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    // headers: {
    //   "Content-Type": "image/jpg",
    // },
  });

  const url = response.url.split("?")[0];
  console.log("URL", url);
  return url;
}