"use server";

import prisma from "@/lib/prisma";
import { authorize } from "@/lib/auth/authorize";

export async function submitFeedback(formData: FormData) {
  const { authorized, session } = await authorize();
  
  if (!authorized) {
    throw new Error("Unauthorized");
  }

  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  const tokenRecord = await prisma.setting.findUnique({
    where: { key: "github_token" },
  });

  const token = tokenRecord?.value;

  if (!token) {
    throw new Error("GitHub Token is not configured. Please check the Settings page.");
  }

  const repo = "dkomeza/tisane";
  
  const body = `
**Submitted by:** ${session.user.name} (${session.user.email})
**Role:** ${session.user.role}

### Description

${description}
  `;

  const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `[${type.toUpperCase()}] ${title}`,
      body: body.trim(),
      labels: [type.toLowerCase() === "bug report" ? "bug" : "enhancement"]
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`GitHub API Error: ${errorData.message}`);
  }

  return { success: true };
}
