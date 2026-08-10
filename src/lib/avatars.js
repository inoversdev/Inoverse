// ─── Avatar disc palette — ONE literal class map, site-wide ───
// Tailwind's scanner only sees class names that appear literally in the
// source, so gradient stops can never be built as `from-${x}` template
// literals (that bug already bit this repo once, on the mobile order-
// classes in ProjectsPage). Every disc that needs a tint looks it up here.
//
// Shared by TestimonialCard and CrewCard — add tints here, never fork a
// second copy of this map into a component.
export const AVATAR = {
  ember: 'from-ember-500 to-ember-300',
  violet: 'from-violet-600 to-fuchsia-400',
  teal: 'from-teal-600 to-emerald-400',
  blue: 'from-blue-700 to-sky-400',
  amber: 'from-amber-600 to-orange-400',
  sky: 'from-sky-700 to-cyan-400',
}

// Safe lookup — unknown/absent keys fall back to the brand ember tint
// rather than rendering a disc with no gradient class at all.
export const avatarClass = (key) => AVATAR[key] ?? AVATAR.ember
