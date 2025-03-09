
import { StyleApplicatorTest } from "@/components/design/typography/StyleApplicatorTest";

export default function StyleTest() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Typography Style Testing</h1>
        <StyleApplicatorTest />
      </div>
    </div>
  );
}
