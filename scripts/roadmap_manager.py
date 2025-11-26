import os
import re
from github import Github

# --- CONFIG ---
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_NAME = os.getenv("GITHUB_REPOSITORY")
ROADMAP_FILE = "roadmap.md"
# --------------

def main():
    if not GITHUB_TOKEN or not REPO_NAME:
        print("Error: Missing GITHUB_TOKEN or GITHUB_REPOSITORY environment variables.")
        return

    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(REPO_NAME)
    
    # 1. Load existing issues to prevent duplicates (Cache)
    # Key: Issue Title, Value: Issue Object
    print("Fetching existing issues...")
    existing_issues = {issue.title: issue for issue in repo.get_issues(state='all')}

    with open(ROADMAP_FILE, 'r') as f:
        lines = f.readlines()

    new_lines = []
    current_phase = "General"
    
    # Regex to find: - [ ] **Title**
    # Group 1: ' ' or 'x' (Status)
    # Group 2: Title content
    # Group 3: Optional existing link like ([#12])
    task_pattern = re.compile(r'^(\s*-\s\[)([ x])(\]\s\*\*)(.*?)(\*\*)(\s\(\[#\d+\]\))?')
    
    phase_pattern = re.compile(r'^##\s+(.+)')

    issues_created = 0
    issues_updated = 0

    # 2. Iterate through file lines
    for i, line in enumerate(lines):
        stripped_line = line.strip()
        
        # Detect Phase (Context for labels)
        phase_match = phase_pattern.match(stripped_line)
        if phase_match:
            current_phase = phase_match.group(1).split(":")[0].strip()
            new_lines.append(line)
            continue

        # Detect Task
        match = task_pattern.match(line)
        if match:
            prefix = match.group(1)     # "- ["
            status_char = match.group(2)# " " or "x"
            mid_syntax = match.group(3) # "] **"
            title = match.group(4)      # "Database & ORM Setup"
            end_syntax = match.group(5) # "**"
            existing_link = match.group(6) # " ([#12])" or None

            # Collect subtasks (indented lines below this one) for the Body
            body_lines = []
            for j in range(i + 1, len(lines)):
                if task_pattern.match(lines[j]) or phase_pattern.match(lines[j]) or lines[j].strip() == "":
                    break
                if lines[j].strip().startswith("-"):
                    body_lines.append(lines[j].strip())
            
            body_content = f"**Phase:** {current_phase}\n\n" + "\n".join(body_lines)

            # --- LOGIC CORE ---
            
            issue = existing_issues.get(title)
            final_status_char = status_char # Default to what's in the file
            final_link_suffix = ""

            if not issue:
                # CREATE NEW ISSUE
                if status_char == ' ': # Only create if not already marked done in MD
                    print(f"Creating issue: {title}")
                    issue = repo.create_issue(
                        title=title,
                        body=body_content,
                        labels=[current_phase] if current_phase else []
                    )
                    issues_created += 1
            
            if issue:
                # SYNC LOGIC
                
                # 1. Update Markdown Link
                final_link_suffix = f" ([#{issue.number}]({issue.html_url}))"

                # 2. Status Sync
                # If Markdown is [x] -> Close Issue
                if status_char == 'x' and issue.state == 'open':
                    print(f"Closing issue #{issue.number} based on Roadmap...")
                    issue.edit(state='closed')
                    issues_updated += 1
                
                # If Issue is Closed -> Mark Markdown [x]
                elif issue.state == 'closed' and status_char == ' ':
                    print(f"Updating Roadmap to [x] for closed issue #{issue.number}...")
                    final_status_char = 'x'
                    issues_updated += 1

                # If Markdown is [ ] and Issue is Open -> Ensure Issue matches
                elif status_char == ' ' and issue.state == 'open':
                    pass # Sync is good

            # Reconstruct the line
            # "  - [" + "x" + "] **" + "Title" + "**" + " ([#12](...))" + "\n"
            reconstructed_line = f"{prefix}{final_status_char}{mid_syntax}{title}{end_syntax}{final_link_suffix}\n"
            new_lines.append(reconstructed_line)

        else:
            new_lines.append(line)

    # 3. Write changes back to file
    with open(ROADMAP_FILE, 'w') as f:
        f.writelines(new_lines)

    print(f"Done. Created: {issues_created}, Updated: {issues_updated}")

if __name__ == "__main__":
    main()