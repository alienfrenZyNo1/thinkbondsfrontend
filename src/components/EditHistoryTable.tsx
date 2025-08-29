'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface EditHistoryEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  changes?: Record<string, any>;
}

interface EditHistoryTableProps {
  editHistory: EditHistoryEntry[];
}

export function EditHistoryTable({ editHistory }: EditHistoryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Timestamp</TableHead>
            <TableHead className="w-1/4">User</TableHead>
            <TableHead className="w-1/4">Action</TableHead>
            <TableHead className="w-1/4">Changes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {editHistory && editHistory.length > 0 ? (
            editHistory.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{formatDate(entry.timestamp)}</TableCell>
                <TableCell>{entry.userName}</TableCell>
                <TableCell>{entry.action}</TableCell>
                <TableCell>
                  {entry.changes ? (
                    <ul className="list-disc pl-5">
                      {Object.entries(entry.changes).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {JSON.stringify(value)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'No changes recorded'
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No edit history found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}