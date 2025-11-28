import prompts from "prompts";
import { auth } from "@/lib/auth/server";
import { db } from "@/src/db/drizzle";
import { user } from "@/src/db/schema/auth";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Creating the first admin user...");

  const response = await prompts([
    {
      type: "text",
      name: "name",
      message: "Enter your name",
      validate: (value: string) =>
        value.length < 2 ? "Name must be at least 2 characters" : true,
    },
    {
      type: "text",
      name: "email",
      message: "Enter your email",
      validate: (value: string) =>
        !value.includes("@") ? "Please enter a valid email" : true,
    },
    {
      type: "password",
      name: "password",
      message: "Enter your password",
      validate: (value: string) =>
        value.length < 8 ? "Password must be at least 8 characters" : true,
    },
  ]);

  if (!response.email || !response.password || !response.name) {
    console.log("Operation cancelled");
    process.exit(0);
  }

  try {
    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(user)
      .where(eq(user.email, response.email));

    if (existingUsers.length > 0) {
      console.error("User with this email already exists");
      process.exit(1);
    }

    console.log("Creating user...");

    // Call better-auth API
    // The server-side API usually returns a Response object or the data directly depending on the call.
    // For signUpEmail, it likely returns a Response object.
    const res = await auth.api.signUpEmail({
      body: {
        email: response.email,
        password: response.password,
        name: response.name,
      },
      asResponse: true, // Force it to return a Response object if possible, or just handle what it returns
    });

    // Check if res is a Response object
    if (res instanceof Response) {
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to create user:", errorText);
        process.exit(1);
      }
    } else if (
      res &&
      typeof res === "object" &&
      "error" in (res as unknown as { error: string })
    ) {
      // Handle potential error object if not a Response
      console.error(
        "Failed to create user:",
        (res as unknown as { error: string }).error
      );
      process.exit(1);
    }

    // Now update the user to be admin
    const newUsers = await db
      .select()
      .from(user)
      .where(eq(user.email, response.email));
    const newUser = newUsers[0];

    if (!newUser) {
      console.error("Failed to find the created user.");
      process.exit(1);
    }

    console.log("Promoting user to admin...");
    await db.update(user).set({ role: "admin" }).where(eq(user.id, newUser.id));

    console.log(
      `User ${newUser.name} (${newUser.email}) created and set as admin!`
    );
    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error);
    process.exit(1);
  }
}

main();
