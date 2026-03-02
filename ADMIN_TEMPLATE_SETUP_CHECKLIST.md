# Admin Template Setup Checklist

Use this checklist after cloning a new site and before content/design edits.

## 1) Site setup

- [ ] Login as `super_admin`.
- [ ] Open `/admin/sites`.
- [ ] Confirm target `siteId`, `domain`, `enabled`, `defaultLocale`, `supportedLocales`.
- [ ] Disable leftover template/demo sites not used by this client.

## 2) User and RBAC setup

- [ ] Open `/admin/users`.
- [ ] Confirm at least one known working `super_admin`.
- [ ] Add `site_admin` for each operating site.
- [ ] Assign `editor` and `viewer` roles with correct site scope.
- [ ] Remove or restrict old template users.

## 3) Import order

- [ ] Import sites (if needed).
- [ ] Import users (if needed).
- [ ] Import content in `missing` mode.
- [ ] Import booking settings/services/bookings.
- [ ] Import media metadata.
- [ ] Use overwrite only when explicitly approved.

## 4) Booking baseline

- [ ] Open `/admin/booking-settings`.
- [ ] Confirm service types and pricing model values.
- [ ] Confirm business hours and slot capacities.
- [ ] Confirm notification emails/phones.
- [ ] Save and re-test booking slots.

## 5) Final checks

- [ ] Open `/admin/content` and save a small content change.
- [ ] Verify frontend reflects the change.
- [ ] Revert or finalize the test edit.
- [ ] Run `npm run build` before deployment.
