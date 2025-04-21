import SupabaseImage from "@/components/SupabaseImage";
// I implemented this return into home to test, after PR I'll delete this
export default function TestPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Question Image</h1>
      <SupabaseImage
        bucketName="questions-images"
        quizId="ff680f97-b74b-47f0-a4a0-74095c570fa9"
        questionId="0e63bc49-2f79-4c58-a717-1f6c2d2d35bd"
        fileName="1745161230983_35b0be3f-dbc0-46bf-8b18-489e3891b230.png"
        width={400}
        height={300}
        alt="Question Image"
      />
    </div>
  );
}
