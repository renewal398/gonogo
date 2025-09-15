import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Card className="text-center">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
          <Skeleton className="h-6 w-32 mt-4" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
