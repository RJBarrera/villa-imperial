import type { RankingDisplayItem } from "../reports.types";
import EmptyReportMessage from "./EmptyReportMessage";
import RankingRow from "./RankingRow";
import ReportListCard from "./ReportListCard";

interface RankingSectionProps {
  title: string;
  subtitle: string;
  items: RankingDisplayItem[];
}

export default function RankingSection({
  title,
  subtitle,
  items,
}: RankingSectionProps) {
  return (
    <ReportListCard title={title} subtitle={subtitle}>
      {items.length === 0 ? (
        <EmptyReportMessage />
      ) : (
        <div className="ranking-list">
          {items.map((item) => (
            <RankingRow
              key={`${item.position}-${item.title}`}
              item={item}
            />
          ))}
        </div>
      )}
    </ReportListCard>
  );
}
