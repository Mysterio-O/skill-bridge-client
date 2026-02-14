import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "./dashboard-utils";

type Row = {
    id: string;
    status: string;
    startAt: string;
    endAt: string;
    currency: string;
    totalPrice: number;
    title: string;
    subtitle: string;
};

function StatusPill({ status }: { status: string }) {
    return (
        <Badge
            variant="outline"
            className="rounded-full capitalize border-slate-300/60 text-slate-700 dark:border-slate-700 dark:text-slate-200"
        >
            {status.replaceAll("_", " ")}
        </Badge>
    );
}

export default function RecentBookingsTable({ rows }: { rows: Row[] }) {
    if (!rows?.length) {
        return (
            <div className="py-6 text-sm text-slate-600 dark:text-slate-400">
                No recent bookings.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-800/70">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/70 dark:bg-white/5">
                        <TableHead>Booking</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.map((r) => (
                        <TableRow key={r.id} className="dark:border-slate-800/60">
                            <TableCell>
                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                    {r.title}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {r.subtitle}
                                </div>
                            </TableCell>

                            <TableCell>
                                <StatusPill status={r.status} />
                            </TableCell>

                            <TableCell className="text-sm text-slate-700 dark:text-slate-300">
                                <div>{formatDateTime(r.startAt)}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    to {formatDateTime(r.endAt)}
                                </div>
                            </TableCell>

                            <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
                                {formatCurrency(r.totalPrice, r.currency)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
