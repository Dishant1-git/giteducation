/**
 * Who this CMS belongs to.
 *
 * This codebase runs more than one institute's website, and a developer often
 * has more than one checkout of it open. An admin who cannot tell at a glance
 * which site they are editing is one careless afternoon away from publishing
 * one institute's fees to somebody else's — so the name is in the sidebar, on
 * the sign-in page and in the browser tab, not left implied.
 *
 * One constant rather than the same words typed into four components: those
 * drift, and a half-renamed CMS is more confusing than an unnamed one.
 */

/** The organisation. */
export const ORG_NAME = 'GIT Education'

/** The centre this install manages. */
export const BRANCH_NAME = 'Jalandhar'

/** Full name, for headings and page titles. */
export const CMS_NAME = `${ORG_NAME} CMS`

/** The site this CMS publishes to, as a person would say it. */
export const SITE_LABEL = `${ORG_NAME} website`
