"use client";

import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SupabaseImage({
  bucketName,
  quizId,
  questionId,
  fileName,
  width = 300,
  height = 200,
  alt = "Image",
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);

        const imagePath = `questions/${quizId}/${questionId}/${fileName}`;

        const { data, error } = await supabase.storage.from(bucketName).getPublicUrl(imagePath);

        if (error) throw error;

        setImageUrl(data.publicUrl);
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(err.message);
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
    <Image
      src={imageUrl}
      width={width}
      height={height}
      alt={alt}
      className="rounded object-cover"
    />
  );
}
