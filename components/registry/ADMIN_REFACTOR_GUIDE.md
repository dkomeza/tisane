# Admin Component Refactor Guide

## Philosophy

The admin component should be **an extension over the client component**, not a replacement. In the page editor, an admin component should look identical to the client version — until the editor interacts with it.

## Structure

```
<Popover>
  <PopoverTrigger asChild>
    <div className="relative group/NAME cursor-pointer inline-block">
      <div className="transition-all duration-200 pointer-events-none opacity-100 group-hover/NAME:opacity-50">
        <ClientComponent id={id} data={data} />
      </div>
    </div>
  </PopoverTrigger>

  <PopoverContent>
    {/* All editing controls go here */}
  </PopoverContent>
</Popover>
```

## Key Points

1. **Render the client component** as the visual representation inside the trigger.
2. **Popover for editing** — all controls (text inputs, selects, color pickers, toggles, delete) go inside `PopoverContent`.
3. **Hover hint** — the client component fades to 50% opacity on hover (`group-hover/NAME:opacity-50`) to signal editability.
4. **Disable inner interactions** — use `pointer-events-none` on the client wrapper so the inner component doesn't receive hover/focus states.
5. **Use scoped group names** — use `group/NAME` (e.g. `group/button`) to avoid conflicts with parent group selectors.
6. **All buttons must have `type="button"`** to prevent accidental form submissions in the page editor.
7. **`"use client"` directive** is required since the component uses interactive state (Popover).

## Reference Implementation

See `components/registry/elements/button/ButtonAdmin.tsx` for the complete pattern.
