# OnPush Change Detection Migration Plan

## Overview
- **Total Components:** 56
- **Status:** All components currently use default change detection
- **Goal:** Migrate all components to `ChangeDetectionStrategy.OnPush`
- **Prerequisite:** Required for zoneless Angular applications

## Components by Feature Area

### 1. Categories (3 components)
- `categories.page.ts`
- `categories-list.component.ts`
- `category-modal.component.ts`

### 2. Chat (4 components)
- `chat.page.ts`
- `room-content.component.ts`
- `room-list.component.ts`
- `room-modal.component.ts`

### 3. Equipments (4 components)
- `equipments.page.ts`
- `equipment-filter.component.ts`
- `equipment-modal.component.ts`
- `equipments-list.component.ts`

### 4. Home (2 components)
- `home.page.ts`
- `last-posts-board.component.ts`

### 5. Intro (1 component)
- `intro.page.ts`

### 6. Login (2 components)
- `login.page.ts`
- `form-login.component.ts`

### 7. Metrics (7 components) - Most Complex
- `metrics.page.ts`
- `bar-chart-counter.component.ts`
- `line-chart-total-price-between-periods.component.ts`
- `metric-filter.component.ts`
- `pie-order-by-status-between-periods.component.ts`
- `revenue-values-list.component.ts`
- `technician-data-list.component.ts`

### 8. Orders (6 components)
- `order.page.ts`
- `modal-add-part.component.ts`
- `order-client-history.component.ts`
- `order-filter.component.ts`
- `order-modal.component.ts`
- `orders-list.component.ts`

### 9. Parts (4 components)
- `parts.page.ts`
- `part-filter.component.ts`
- `part-modal.component.ts`
- `parts-list.component.ts`

### 10. Posts (5 components)
- `posts.page.ts`
- `post-content.component.ts`
- `post-filter.component.ts`
- `post-modal-add-edit.component.ts`
- `posts-list.component.ts`

### 11. Print (4 components)
- `print.page.ts`
- `barcode-print.component.ts`
- `order-print.component.ts`
- `qrcode-print.component.ts`

### 12. Settings (4 components)
- `settings.page.ts`
- `business-info-modal.component.ts`
- `menu-option.component.ts`
- `user-info-modal.component.ts`

### 13. Tickets (4 components)
- `tickets.page.ts`
- `ticket-filter.component.ts`
- `ticket-modal.component.ts`
- `tickets-list.component.ts`

### 14. Users (5 components)
- `users.page.ts`
- `user-filter.component.ts`
- `user-modal.component.ts`
- `user-password-modal.component.ts`
- `users-list.component.ts`

### 15. Root (1 component)
- `app.component.ts` - **MIGRATE LAST**

---

## Migration Phases

### Phase 1: Simple Components (Week 1)
Start with stateless components and filters:
- [ ] `user-filter.component.ts`
- [ ] `equipment-filter.component.ts`
- [ ] `part-filter.component.ts`
- [ ] `post-filter.component.ts`
- [ ] `order-filter.component.ts`
- [ ] `ticket-filter.component.ts`
- [ ] `metric-filter.component.ts`
- [ ] `menu-option.component.ts`

### Phase 2: List Components (Week 2)
Components that display data lists:
- [ ] `users-list.component.ts`
- [ ] `categories-list.component.ts`
- [ ] `equipments-list.component.ts`
- [ ] `parts-list.component.ts`
- [ ] `posts-list.component.ts`
- [ ] `orders-list.component.ts`
- [ ] `tickets-list.component.ts`
- [ ] `room-list.component.ts`
- [ ] `last-posts-board.component.ts`
- [ ] `revenue-values-list.component.ts`
- [ ] `technician-data-list.component.ts`

### Phase 3: Modal Components (Week 3)
Form-based modal dialogs:
- [ ] `user-modal.component.ts`
- [ ] `user-password-modal.component.ts`
- [ ] `category-modal.component.ts`
- [ ] `equipment-modal.component.ts`
- [ ] `part-modal.component.ts`
- [ ] `post-modal-add-edit.component.ts`
- [ ] `order-modal.component.ts`
- [ ] `modal-add-part.component.ts`
- [ ] `ticket-modal.component.ts`
- [ ] `business-info-modal.component.ts`
- [ ] `user-info-modal.component.ts`
- [ ] `room-modal.component.ts`

### Phase 4: Page Components (Week 4)
Main page components (simpler ones first):
- [ ] `intro.page.ts`
- [ ] `login.page.ts`
- [ ] `form-login.component.ts`
- [ ] `print.page.ts`
- [ ] `barcode-print.component.ts`
- [ ] `order-print.component.ts`
- [ ] `qrcode-print.component.ts`
- [ ] `settings.page.ts`

### Phase 5: Complex Pages (Week 5)
Pages with more complex state:
- [ ] `categories.page.ts`
- [ ] `equipments.page.ts`
- [ ] `parts.page.ts`
- [ ] `posts.page.ts`
- [ ] `users.page.ts`
- [ ] `tickets.page.ts`

### Phase 6: Most Complex (Week 6)
Components with charts, real-time data, or complex subscriptions:
- [ ] `chat.page.ts`
- [ ] `room-content.component.ts`
- [ ] `orders.page.ts`
- [ ] `order-client-history.component.ts`
- [ ] `metrics.page.ts`
- [ ] `bar-chart-counter.component.ts`
- [ ] `line-chart-total-price-between-periods.component.ts`
- [ ] `pie-order-by-status-between-periods.component.ts`
- [ ] `post-content.component.ts`
- [ ] `home.page.ts`

### Phase 7: Root Component (Final)
- [ ] `app.component.ts` - **ALWAYS DO LAST**

---

## Migration Template

For each component, apply this transformation:

### Before:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  imports: [...]
})
export class ExampleComponent {
  // component logic
}
```

### After:
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...]
})
export class ExampleComponent {
  // component logic
}
```

---

## Prerequisites Checklist

Before migrating each component, verify:

- [ ] All `@Input()` properties are immutable (primitives, observables with async pipe, or signals)
- [ ] No direct mutation of input properties
- [ ] Subscriptions use `async` pipe in templates OR converted to signals
- [ ] `ChangeDetectorRef` is injected if `markForCheck()` or `detectChanges()` will be needed
- [ ] Component tests pass after migration

## Common Pitfalls

### ❌ Problem: Component doesn't update when data changes
**Solution:** Ensure you're:
- Using immutable updates (new object/array references)
- Using `async` pipe in templates for observables
- Converting to signals for reactive state

### ❌ Problem: Form inputs not updating display
**Solution:** Forms work automatically with OnPush, but ensure:
- Using reactive forms with proper change detection
- Not mutating form controls directly

### ❌ Problem: Third-party libraries not triggering updates
**Solution:** Inject `ChangeDetectorRef` and call `markForCheck()` after third-party updates:
```typescript
private cdr = inject(ChangeDetectorRef);

someThirdPartyCallback() {
  // ... update state
  this.cdr.markForCheck();
}
```

## Testing Strategy

After each migration:
1. Run `ng build` to ensure no compilation errors
2. Run unit tests: `ng test`
3. Manually test the component in the browser
4. Check browser console for errors
5. Commit changes with descriptive message

Example commit message:
```
refactor: migrate user-filter.component to OnPush change detection

- Add ChangeDetectionStrategy.OnPush to component decorator
- Verified all inputs are immutable
- All tests passing
```

---

## Tool Status

⚠️ **Angular CLI MCP `onpush_zoneless_migration` tool has a known bug** in v20.3.32
- Error: `Cannot read properties of undefined (reading 'Latest')`
- Workaround: Manual migration following this plan
- Alternative: Use Angular language service in VS Code for guidance

## Progress Tracking

Update this section as you migrate:

### Week 1: Simple Components
- [ ] user-filter.component.ts
- [ ] equipment-filter.component.ts
- [ ] part-filter.component.ts
- [ ] post-filter.component.ts
- [ ] order-filter.component.ts
- [ ] ticket-filter.component.ts
- [ ] metric-filter.component.ts
- [ ] menu-option.component.ts

**Status:** 0/8 completed

### Week 2: List Components
**Status:** 0/11 completed

### Week 3: Modal Components
**Status:** 0/12 completed

### Week 4: Simple Pages
**Status:** 0/8 completed

### Week 5: Complex Pages
**Status:** 0/7 completed

### Week 6: Most Complex
**Status:** 0/10 completed

### Week 7: Root Component
**Status:** 0/1 completed

---

## Final Verification

Once all components are migrated:

- [ ] Run full test suite: `ng test`
- [ ] Run build: `ng build`
- [ ] Run E2E tests: `ng e2e` (if configured)
- [ ] Performance audit in Chrome DevTools
- [ ] Update documentation to reflect OnPush usage
- [ ] Remove zone.js if going fully zoneless (advanced)

---

Generated: 2026-07-18
Angular Version: 20.3.26
Project: sos_app