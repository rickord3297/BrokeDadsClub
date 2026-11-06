# Meta retargeting brief

First-party email stays for people who opted in. Site visitors who never signed up get **ads**, not cold email.

## Audiences (Events Manager / Ads Manager)

1. **Site visitors 7 days**  
   Pixel: PageView, last 7 days. Exclude purchasers if you add shop purchase events later.

2. **Grocery landing viewers**  
   People who hit `/free-grocery-list` or `/resources/grocery-week-checklist` in the last 14 days. Exclude anyone who already completed Lead (signup).

3. **Guide readers, no Lead**  
   `/guides/*` in last 14 days, exclude Lead converters. Use for soft “one free list” creative.

4. **Exclusions**  
   Always exclude recent Leads (7–30 days) so subscribers are not paid the same CTA again immediately.

## Creative angles (no em dashes)

### Primary: grocery list
- Primary text: Seven dinners for about $44 at Walmart. Every item covers two nights. Free list. One Sunday email after that.
- Headline: Get the $47 grocery week list
- Description: Free PDF. Unsubscribe anytime.
- Destination: `https://brokedadsclub.com/free-grocery-list`

### Secondary: seasonal guide
Rotate with whatever guide is live and timely (book fair, fall break, heat bill, class party).
- Primary text: One concrete number. One short plan. No hustle-bro nonsense.
- Headline: Read the guide, grab the free list
- Destination: the guide URL, with UTM `utm_source=meta&utm_medium=paid&utm_campaign=retarget`

## Cadence

- Keep 1–2 active retargeting ads, not a pile.
- Refresh creative when CTR softens or the season changes.
- Check pixel Lead events on `/thank-you` still fire once.

## Do not

- Buy visitor email lists or “identity match” cold email.
- Promise income, shame broke dads, or invent stats.
