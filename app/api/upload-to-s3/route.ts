// app/api/upload-to-s3/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // Install with: npm install @aws-sdk/client-s3
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // Install with: npm install @aws-sdk/s3-request-presigner

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uid = formData.get('uid') as string;
    const fieldName = formData.get('fieldName') as string;

    console.log("file", file, "uid", uid, "fieldName", fieldName );

    if (!file || !uid || !fieldName) {
      return NextResponse.json({ 
        success: false, 
        error: 'File, UID, and field name are required' 
      }, { status: 400 });
    }

    // Create a unique file name
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uid}/${fieldName}-${Date.now()}.${fileExtension}`;
    
    // Get file buffer
    const fileBuffer = await file.arrayBuffer();


    console.log(process.env.AWS_S3_BUCKET_NAME);

    // Upload to S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'your-bucket-name',
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Generate file URL
    const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      fileUrl,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Error in upload-to-s3 API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file' 
    }, { status: 500 });
  }
}