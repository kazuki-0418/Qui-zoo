"use client";

import { createClient } from "@supabase/supabase-js";
// import Image from "next/image";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SupabaseImageProps {
  bucketName: string;
  quizId: string;
  questionId: string;
  fileName: string;
  width?: number;
  height?: number;
  alt?: string;
}

export default function SupabaseImage({
  bucketName,
  quizId,
  questionId,
  fileName,
  width = 300,
  height = 200,
  alt = "Image",
}: SupabaseImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);

        const imagePath = `questions/${quizId}/${questionId}/${fileName}`;

        const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath);

        if (!data || !data.publicUrl) {
          throw new Error("Failed to retrieve public URL for the image.");
        }
        setImageUrl(data.publicUrl);
      } catch {
        setError("An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (bucketName && quizId && questionId && fileName) {
      fetchImage();
    }
  }, [bucketName, quizId, questionId, fileName]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded" style={{ width, height }} />;
  }

  if (error) {
    return <div className="text-red-500">Failed to load image: {error}</div>;
  }

  if (!imageUrl) {
    return <div className="text-gray-500">No image available</div>;
  }

  return (
    <img
      src={imageUrl}
      width={width}
      height={height}
      alt={alt}
      className="rounded object-cover"
      // unoptimized
    />
  );
}
