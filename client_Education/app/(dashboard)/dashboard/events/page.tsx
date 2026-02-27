"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockEvents } from "@/data/mock";

export default function ManageEventsPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <Button>Add Event</Button>
      </div>
      <p className="mt-1 text-muted-foreground">
        Manage events and gallery items.
      </p>
      <div className="mt-6">
        <Input placeholder="Search events..." className="max-w-sm mb-4" />
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Description</th>
                <th className="p-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockEvents.map((event) => (
                <tr key={event.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{event.title}</td>
                  <td className="p-4 text-muted-foreground">{event.date}</td>
                  <td className="p-4 text-muted-foreground line-clamp-1">{event.description}</td>
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
