import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Stage3({ finalResponse }) {
  if (!finalResponse) {
    return null;
  }

  return (
    <Card className="mb-4 border-primary/30 bg-primary/5 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Stage 3: Final Council Answer
        </CardTitle>
        <CardDescription className="text-sm font-semibold text-primary/80 mono">
          Chairman: {finalResponse.model.split("/")[1] || finalResponse.model}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="markdown-content rounded-lg border border-primary/20 bg-card p-4 shadow-sm">
          <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
