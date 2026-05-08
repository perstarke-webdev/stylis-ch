## Design Context

### Users
The site is for private clients and selected business clients in the German-speaking part of Switzerland who want help making rooms feel coherent, personal, and easier to live or work in. They may be moving, renovating, furnishing from scratch, fixing one difficult room, choosing colours, shopping for furniture, creating order, or looking for a complete concept.

Users should be able to quickly understand which type of Wohn- und Einrichtungsberatung fits their situation, see that Caroline Stupf has deep practical experience, trust that the service is personal and independent, and contact her without friction. The primary conversion path is WhatsApp first, with phone and email still easy to find and the full form reserved for the contact page.

### Brand Personality
Warm, personal, and quietly stylish. The tone is respectful Sie-form German with Swiss spelling, approachable rather than luxury-detached, and grounded in real homes instead of abstract design language.

The brand should feel like experienced Wohnberatung with charm: confident, helpful, practical, independent of brands and shops, budget-aware, and human. It should keep some of the old site's personality while presenting the content in a cleaner, more professional structure.

### Aesthetic Direction
The visual direction is warm editorial residential consulting: image-led, calm, tactile, and refined without feeling cold. Use high-quality existing stylisch assets where they support the feeling; avoid using weak source images just because they exist.

The palette should stay consistent: warm paper/surface neutrals, deep readable ink, lachs/orange as the strong primary contact CTA and hero eyebrow accent, and warm rose/clay accents for section labels, trust elements, and subtle tints. Avoid blue, green, red, cold grey-blue, and a generic beige-brown interior-designer look.

The hero may be close to the warm Lovable draft feeling but must retain old-site charm. Do not use a bright white hero overlay. Image backgrounds need enough dark/warm overlay for mobile readability while keeping the image visible.

### Design Principles
- Preserve and restructure the old site's valuable content instead of copying the old navigation or page hierarchy one-to-one.
- Keep contact as the clearest primary action; use orange filled buttons only for contact-style primary CTAs.
- Keep the main navigation focused and avoid separate pages for press or inspiration when those items work better as trust or inspiration content inside relevant pages.
- Ignore CMS planning for now; keep the static draft clean and easy to migrate later if needed.
- Make responsive readability non-negotiable, especially hero copy over image backgrounds on mobile.
- Every interactive surface needs an intentional hover/focus state, including logo links, footer links, cards, media links, and contact rows.

### Persistent Implementation Guardrails
- The footer "Made by" badge styling must never be changed unless the user explicitly asks for that badge style to change.
- Keep draft `noindex` active in `assets/js/site-config.js` until launch readiness is explicitly confirmed.
