"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockNotices } from "@/data/mock";

export default function ManageNoticesPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Notices</h1>
        <Button>Add Notice</Button>
      </div>
      <p className="mt-1 text-muted-foreground">
        Create and publish announcements.
      </p>
      <div className="mt-6">
        <Input placeholder="Search notices..." className="max-w-sm mb-4" />
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Published</th>
                <th className="p-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockNotices.map((notice) => (
                <tr key={notice.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{notice.title}</td>
                  <td className="p-4 text-muted-foreground">{notice.publishedAt}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
