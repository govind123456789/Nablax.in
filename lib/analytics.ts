import { track } from "@vercel/analytics"

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Track with Vercel Analytics
  track(eventName, properties)

  // Also log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", eventName, properties)
  }
}

// Predefined events for consistent tracking
export const AnalyticsEvents = {
  // Hero CTAs
  HERO_DEMO_CLICKED: "hero_demo_clicked",
  HERO_SALES_CLICKED: "hero_sales_clicked",

  // Product interactions
  PRODUCT_LEARN_MORE: "product_learn_more_clicked",
  PRODUCT_REQUEST_DEMO: "product_request_demo_clicked",

  // Industry navigation
  INDUSTRY_EXPLORED: "industry_explored",

  // Demo interactions
  DEMO_QUERY_SUBMITTED: "demo_query_submitted",
  DEMO_SCENARIO_SELECTED: "demo_scenario_selected",
  DEMO_REQUEST_FULL: "demo_request_full_clicked",

  // Contact form
  CONTACT_FORM_STARTED: "contact_form_started",
  CONTACT_FORM_SUBMITTED: "contact_form_submitted",
  CONTACT_CALENDAR_CLICKED: "contact_calendar_clicked",

  // Navigation
  NAV_ABOUT_CLICKED: "nav_about_clicked",
  NAV_SERVICES_CLICKED: "nav_services_clicked",
  NAV_CONTACT_CLICKED: "nav_contact_clicked",

  // Services page
  SERVICES_CTA_CLICKED: "services_cta_clicked",
  CASE_STUDY_VIEWED: "case_study_viewed",
  ENGAGEMENT_MODEL_VIEWED: "engagement_model_viewed",

  // Social links
  SOCIAL_LINKEDIN_CLICKED: "social_linkedin_clicked",
  SOCIAL_INSTAGRAM_CLICKED: "social_instagram_clicked",
}
