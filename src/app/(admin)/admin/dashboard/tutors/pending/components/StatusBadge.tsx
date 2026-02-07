import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }: { status: "pending" | "active" | "cancelled" }) {
    if (status === "pending") {
        return (
            <Badge variant="outline" className="border-border bg-muted/30 text-foreground">
                Pending
            </Badge>
        );
    }
    if (status === "active") {
        return (
            <Badge className="bg-primary text-primary-foreground">
                Active
            </Badge>
        );
    }
    return (
        <Badge variant="destructive">
            Cancelled
        </Badge>
    );
}
