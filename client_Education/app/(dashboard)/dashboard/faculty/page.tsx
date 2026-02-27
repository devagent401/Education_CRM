"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockFaculty } from "@/data/mock";

export default function ManageFacultyPage() {
  const [faculty] = useState(mockFaculty);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Faculty</h1>
        <Button>Add Faculty</Button>
      </div>
      <p className="mt-1 text-muted-foreground">
        Manage faculty profiles and roles.
      </p>
      <div className="mt-6">
        <Input placeholder="Search faculty..." className="max-w-sm mb-4" />
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Qualification</th>
                <th className="p-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((member) => (
                <tr key={member.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{member.name}</td>
                  <td className="p-4 text-muted-foreground">{member.role}</td>
                  <td className="p-4 text-muted-foreground">{member.qualification}</td>
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
