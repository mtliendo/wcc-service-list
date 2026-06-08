export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "wcc_members");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}

/** Replaces /upload/ with a face-cropped thumbnail transform for member cards. */
export function getThumbnailUrl(imageUrl: string): string {
  return imageUrl.replace("/upload/", "/upload/w_200,h_200,c_fill,g_face/");
}
