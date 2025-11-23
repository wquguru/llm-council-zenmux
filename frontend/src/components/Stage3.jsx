import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Stage3({ finalResponse }) {
  if (!finalResponse) {
    return null;
  }

  return (
    <Card className="mb-4 border-green-200 bg-green-50/50">
      <CardHeader>
        <CardTitle className="text-green-900">Stage 3: Final Council Answer</CardTitle>
        <CardDescription className="text-green-700">
          Chairman: {finalResponse.model.split('/')[1] || finalResponse.model}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="markdown-content rounded-lg border border-green-200 bg-white p-4">
          <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
