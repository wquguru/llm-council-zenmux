import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Stage1({ responses, activeModel, onSelectModel }) {
  if (!responses || responses.length === 0) {
    return null;
  }

  // Find the index of the active model
  const activeIndex = activeModel
    ? responses.findIndex((r) => r.model === activeModel)
    : 0;
  const currentValue = String(activeIndex >= 0 ? activeIndex : 0);

  const handleTabChange = (value) => {
    const index = parseInt(value, 10);
    if (responses[index] && onSelectModel) {
      onSelectModel(responses[index].model);
    }
  };

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">
          Stage 1: Individual Responses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={currentValue} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-4 w-full flex-wrap justify-start h-auto gap-2 bg-muted/50 p-1">
            {responses.map((resp, index) => (
              <TabsTrigger
                key={index}
                value={String(index)}
                className="text-xs md:text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                {resp.model.split("/")[1] || resp.model}
              </TabsTrigger>
            ))}
          </TabsList>

          {responses.map((resp, index) => (
            <TabsContent key={index} value={String(index)}>
              <div className="mb-3 text-sm font-semibold text-muted-foreground mono">
                {resp.model}
              </div>
              <div className="markdown-content rounded-lg border bg-card p-4 shadow-sm">
                <ReactMarkdown>{resp.response}</ReactMarkdown>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
