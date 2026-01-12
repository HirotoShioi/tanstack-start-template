---
description: Instructions for writing component tests using Vitest Browser Mode.
---

# Browser Mode Component Test Instructions

## Overview

This instruction guides AI to write **component tests using Vitest Browser Mode**. Browser Mode runs tests in real browser environments using Playwright, providing accurate testing with real DOM, CSS rendering, and browser APIs.

## File Naming Convention

- Browser tests must use the `.browser.test.tsx` suffix
- Example: `MyComponent.browser.test.tsx`
- These files are picked up by the `browser` project in vitest.config.ts

## Required Imports

```tsx
// Core testing utilities
import { userEvent } from "vitest/browser";
import { describe, expect, it, vi } from "vitest";

// Custom render function with providers
import { render } from "@/test/render";

// For API mocking (when needed)
import { HttpResponse, http } from "msw";
import { worker } from "@/test/msw/browser";
```

## Best Practices

### 1. Use `await expect.element()` for DOM Assertions

Browser Mode requires async assertions with `expect.element()`. This auto-retries until elements are found:

```tsx
// ✅ Good: Use await expect.element()
await expect.element(screen.getByText("Hello")).toBeInTheDocument();
await expect.element(screen.getByRole("button")).toBeDisabled();
await expect.element(screen.getByRole("button")).not.toBeDisabled();

// ❌ Bad: Synchronous expect (will not work properly)
expect(screen.getByText("Hello")).toBeInTheDocument();
```

### 2. Use `getByRole` for Element Queries (Accessibility-First)

Prefer `getByRole` with accessible names. This ensures components are accessible:

```tsx
// ✅ Good: Role-based queries (accessibility-first)
const submitButton = screen.getByRole("button", { name: "Submit" });
const emailInput = screen.getByRole("textbox", { name: /Email address/i });
const closeButton = screen.getByRole("button", { name: "Close" });

// ⚠️ Acceptable: When role is not available
const label = screen.getByText("Imported");
const errorMessage = screen.getByText(/An error occurred/);

// ❌ Avoid: Test IDs unless absolutely necessary
const element = screen.getByTestId("submit-button");
```

Use `getByTestId` only when no accessible query is possible.

### 3. Use `userEvent` for User Interactions

Use `userEvent` from `vitest/browser` for realistic user interactions:

```tsx
// ✅ Good: Use userEvent for interactions
await userEvent.click(submitButton);
await userEvent.fill(emailInput, "test@example.com");
await userEvent.keyboard("{Tab}");
await userEvent.keyboard("{Enter}");

// ❌ Avoid: Direct element methods
await submitButton.click(); // Less realistic simulation
```

### 4. Test User-Facing Behavior, Not Implementation

Focus on what users see and do:

```tsx
// ✅ Good: Test user-facing behavior
it("shows error message when email format is invalid", async () => {
  const screen = await render(<ContactForm />);

  await userEvent.fill(
    screen.getByRole("textbox", { name: /email/i }),
    "invalid"
  );
  await userEvent.click(screen.getByRole("button", { name: "Submit" }));

  await expect
    .element(screen.getByText("Please enter a valid email address"))
    .toBeInTheDocument();
});

// ❌ Bad: Test implementation details
it("calls validateEmail function", async () => {
  /* ... */
});
it("sets isSubmitting state to true", async () => {
  /* ... */
});
```

### 5. Meaningful Test Descriptions

Write descriptions that explain expected behavior:

```tsx
// ✅ Good: Describes user-facing behavior
describe("Import button state", () => {
  it("Button is disabled when no address is selected", async () => {
    /* ... */
  });
  it("Button is enabled when address is selected", async () => {
    /* ... */
  });
});

// ❌ Bad: Implementation-focused
describe("button state", () => {
  it("sets disabled prop based on selectedAddresses.size", async () => {
    /* ... */
  });
});
```

## MSW (Mock Service Worker) for API Mocking

### Basic Setup

The MSW worker is automatically started in `src/test/setup.browser.ts`. Use `worker.use()` to add handlers per test:

```tsx
import { HttpResponse, http } from "msw";
import { worker } from "@/test/msw/browser";

describe("DataComponent", () => {
  it("displays fetched data correctly", async () => {
    // Add handler for this test
    worker.use(
      http.get("*/api/v1/users", () => {
        return HttpResponse.json({
          data: { users: [{ id: 1, name: "John" }] },
        });
      })
    );

    const screen = await render(<UserList />);

    await expect.element(screen.getByText("John")).toBeInTheDocument();
  });

  it("shows error state when API fails", async () => {
    worker.use(
      http.get("*/api/v1/users", () => {
        return HttpResponse.json({ error: "Server error" }, { status: 500 });
      })
    );

    const screen = await render(<UserList />);

    await expect
      .element(screen.getByText(/An error occurred/))
      .toBeInTheDocument();
  });
});
```

### Key Points for MSW

1. **Use wildcard patterns** for base URLs: `*/api/v1/endpoint`
2. **Handlers are reset after each test** via `afterEach(() => worker.resetHandlers())`
3. **Don't forget to mock all API calls** your component makes
4. **Test both success and error states**

## Test Structure Template

```tsx
import { userEvent } from "vitest/browser";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { worker } from "@/test/msw/browser";
import { render } from "@/test/render";
import { MyComponent } from "./MyComponent";

// Test data setup
const mockData = {
  /* ... */
};

const defaultProps = {
  onSubmit: vi.fn(),
  onClose: vi.fn(),
  // ... other required props
};

describe("MyComponent", () => {
  describe("Initial display", () => {
    it("Title is displayed", async () => {
      const screen = await render(<MyComponent {...defaultProps} />);

      await expect
        .element(screen.getByRole("heading", { name: "Title" }))
        .toBeInTheDocument();
    });
  });

  describe("User interaction", () => {
    it("onSubmit is called when submit button is clicked", async () => {
      const onSubmit = vi.fn();
      const screen = await render(
        <MyComponent {...defaultProps} onSubmit={onSubmit} />
      );

      await userEvent.click(screen.getByRole("button", { name: "Submit" }));

      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe("Validation", () => {
    it("Shows error message when required field is empty", async () => {
      const screen = await render(<MyComponent {...defaultProps} />);

      await userEvent.click(screen.getByRole("button", { name: "Submit" }));

      await expect
        .element(screen.getByText("Required field"))
        .toBeInTheDocument();
    });
  });

  describe("API Integration", () => {
    it("Displays list on successful data fetch", async () => {
      worker.use(
        http.get("*/api/v1/items", () => {
          return HttpResponse.json({ data: mockData });
        })
      );

      const screen = await render(<MyComponent {...defaultProps} />);

      await expect.element(screen.getByText(mockData.name)).toBeInTheDocument();
    });
  });
});
```

## What to Test

### Priority Order (Test Hierarchy)

1. **Critical User Paths** → Always test these
2. **Error Handling** → Test failure scenarios
3. **Edge Cases** → Empty data, extreme values
4. **Accessibility** → Keyboard navigation, focus management
5. **Loading States** → Spinners, skeleton screens

### Good Test Coverage Includes

- ✅ Component renders with required props
- ✅ User interactions trigger correct callbacks
- ✅ Form validation shows appropriate errors
- ✅ Loading and error states display correctly
- ✅ Conditional rendering based on props/state
- ✅ Keyboard navigation works (Tab, Enter, Escape)
- ✅ Disabled states prevent interactions

## Prohibited

- ❌ **Do not use synchronous `expect()`** for DOM assertions
- ❌ **Do not test implementation details** (internal state, private methods)
- ❌ **Do not use `any` types** in test code
- ❌ **Do not write flaky tests** that depend on timing
- ❌ **Do not skip accessibility** - use `getByRole` whenever possible

## Running Tests

```bash
# Run browser tests only
npm run test:browser
```

## Debugging Tips

1. **Use `console.log`** to debug element queries
2. **Check element count**: `console.log(screen.getByRole("button").length)`
3. **Add `headless: false`** in vitest.config.ts for visual debugging
