import ReactMarkdown from 'react-markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function deAnonymizeText(text, labelToModel) {
  if (!labelToModel) return text;

  let result = text;
  // Replace each "Response X" with the actual model name
  Object.entries(labelToModel).forEach(([label, model]) => {
    const modelShortName = model.split('/')[1] || model;
    result = result.replace(new RegExp(label, 'g'), `**${modelShortName}**`);
  });
  return result;
}

export default function Stage2({ rankings, labelToModel, aggregateRankings }) {
  if (!rankings || rankings.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Stage 2: Peer Rankings</CardTitle>
        <CardDescription>
          Each model evaluated all responses (anonymized as Response A, B, C, etc.) and provided rankings.
          Below, model names are shown in <strong>bold</strong> for readability, but the original evaluation used anonymous labels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="mb-3 text-sm font-semibold">Raw Evaluations</h4>

        <Tabs defaultValue="0" className="w-full">
          <TabsList className="mb-4 w-full flex-wrap justify-start h-auto gap-1">
            {rankings.map((rank, index) => (
              <TabsTrigger key={index} value={String(index)} className="text-xs md:text-sm">
                {rank.model.split('/')[1] || rank.model}
              </TabsTrigger>
            ))}
          </TabsList>

          {rankings.map((rank, index) => (
            <TabsContent key={index} value={String(index)}>
              <div className="mb-2 text-sm font-medium text-muted-foreground">{rank.model}</div>
              <div className="markdown-content rounded-lg border bg-card p-4">
                <ReactMarkdown>
                  {deAnonymizeText(rank.ranking, labelToModel)}
                </ReactMarkdown>
              </div>

              {rank.parsed_ranking && rank.parsed_ranking.length > 0 && (
                <div className="mt-3 rounded-lg border bg-muted/50 p-3">
                  <strong className="text-sm">Extracted Ranking:</strong>
                  <ol className="ml-4 mt-2 list-decimal text-sm">
                    {rank.parsed_ranking.map((label, i) => (
                      <li key={i} className="mb-1">
                        {labelToModel && labelToModel[label]
                          ? labelToModel[label].split('/')[1] || labelToModel[label]
                          : label}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {aggregateRankings && aggregateRankings.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-2 text-sm font-semibold">Aggregate Rankings (Street Cred)</h4>
            <p className="mb-3 text-sm text-muted-foreground">
              Combined results across all peer evaluations (lower score is better):
            </p>
            <div className="space-y-2">
              {aggregateRankings.map((agg, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      #{index + 1}
                    </span>
                    <span className="font-medium">
                      {agg.model.split('/')[1] || agg.model}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Avg: <span className="font-semibold">{agg.average_rank.toFixed(2)}</span>
                    </span>
                    <span>({agg.rankings_count} votes)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
