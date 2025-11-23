import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function deAnonymizeText(text, labelToModel) {
  if (!labelToModel) return text;

  let result = text;
  // Replace each "Response X" with the actual model name
  Object.entries(labelToModel).forEach(([label, model]) => {
    const modelShortName = model.split("/")[1] || model;
    result = result.replace(new RegExp(label, "g"), `**${modelShortName}**`);
  });
  return result;
}

export default function Stage2({ rankings, labelToModel, aggregateRankings, activeModel, onSelectModel, scrollToStage2 }) {
  const { t } = useTranslation();

  if (!rankings || rankings.length === 0) {
    return null;
  }

  // Find the index of the active model
  const activeIndex = activeModel
    ? rankings.findIndex((r) => r.model === activeModel)
    : 0;
  const currentValue = String(activeIndex >= 0 ? activeIndex : 0);

  const handleTabChange = (value) => {
    const index = parseInt(value, 10);
    if (rankings[index] && onSelectModel) {
      onSelectModel(rankings[index].model);
      // Scroll to Stage 2 section when tab is changed
      if (scrollToStage2) {
        scrollToStage2();
      }
    }
  };

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">
          {t('stage2Title')}
        </CardTitle>
        <CardDescription className="text-sm">
          {t('stage2Description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground mono">
          {t('rawEvaluations')}
        </h4>

        <Tabs value={currentValue} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-4 w-full flex-wrap justify-start h-auto gap-2 bg-muted/50 p-1">
            {rankings.map((rank, index) => (
              <TabsTrigger
                key={index}
                value={String(index)}
                className="text-xs md:text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                {rank.model.split("/")[1] || rank.model}
              </TabsTrigger>
            ))}
          </TabsList>

          {rankings.map((rank, index) => (
            <TabsContent key={index} value={String(index)}>
              <div className="mb-3 text-sm font-semibold text-muted-foreground mono">
                {rank.model}
              </div>
              <div className="markdown-content rounded-lg border bg-card p-4 shadow-sm">
                <ReactMarkdown>
                  {deAnonymizeText(rank.ranking, labelToModel)}
                </ReactMarkdown>
              </div>

              {rank.parsed_ranking && rank.parsed_ranking.length > 0 && (
                <div className="mt-3 rounded-lg border bg-muted/50 p-3 shadow-sm">
                  <strong className="text-sm font-semibold">
                    {t('extractedRanking')}:
                  </strong>
                  <ol className="ml-4 mt-2 list-decimal text-sm font-medium">
                    {rank.parsed_ranking.map((label, i) => (
                      <li key={i} className="mb-1">
                        {labelToModel && labelToModel[label]
                          ? labelToModel[label].split("/")[1] ||
                            labelToModel[label]
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
          <div className="mt-6 pt-6 border-t">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground mono">
              {t('aggregateRankings')}
            </h4>
            <p className="mb-4 text-sm text-muted-foreground">
              {t('aggregateDescription')}
            </p>
            <div className="space-y-2">
              {aggregateRankings.map((agg, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      #{index + 1}
                    </span>
                    <span className="font-semibold">
                      {agg.model.split("/")[1] || agg.model}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mono">
                    <span>
                      {t('avg')}:{" "}
                      <span className="font-bold text-foreground">
                        {agg.average_rank.toFixed(2)}
                      </span>
                    </span>
                    <span className="text-xs">
                      ({agg.rankings_count} {t('votes')})
                    </span>
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
