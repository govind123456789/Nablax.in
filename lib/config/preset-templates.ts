// Preset SQL Templates - No LLM or API required
export type TemplateCategory = "sales" | "customer" | "performance" | "trends" | "comparison"

export interface SQLTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  sql: string
  requiredTables: string[]
  placeholders: {
    [key: string]: string
  }
}

export const PRESET_TEMPLATES: SQLTemplate[] = [
  {
    id: "top-customers",
    name: "Top Customers by Revenue",
    description: "Identify your highest-value customers based on total transaction volume",
    category: "customer",
    sql: `SELECT 
  customer_id,
  COUNT(*) as total_orders,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_order_value
FROM orders
GROUP BY customer_id
ORDER BY total_revenue DESC
LIMIT 10`,
    requiredTables: ["orders"],
    placeholders: {
      limit: "10",
    },
  },
  {
    id: "monthly-sales-trend",
    name: "Monthly Sales Trend",
    description: "Track sales performance month-over-month to identify growth patterns",
    category: "trends",
    sql: `SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(order_id) as total_orders,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_order_value
FROM orders
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC`,
    requiredTables: ["orders"],
    placeholders: {},
  },
  {
    id: "product-performance",
    name: "Best Performing Products",
    description: "Analyze which products generate the most revenue",
    category: "performance",
    sql: `SELECT 
  product_id,
  COUNT(*) as times_ordered,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_sale_value
FROM orders
GROUP BY product_id
ORDER BY total_revenue DESC
LIMIT 15`,
    requiredTables: ["orders"],
    placeholders: {
      limit: "15",
    },
  },
  {
    id: "customer-retention",
    name: "Customer Retention Rate",
    description: "Calculate repeat customer percentage and retention metrics",
    category: "customer",
    sql: `SELECT 
  COUNT(DISTINCT customer_id) as total_customers,
  COUNT(DISTINCT CASE WHEN repeat_purchases > 0 THEN customer_id END) as repeat_customers,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN repeat_purchases > 0 THEN customer_id END) / COUNT(DISTINCT customer_id), 2) as retention_rate
FROM orders
LEFT JOIN (
  SELECT customer_id, COUNT(*) as repeat_purchases
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*) > 1
) repeat ON orders.customer_id = repeat.customer_id`,
    requiredTables: ["orders"],
    placeholders: {},
  },
  {
    id: "revenue-by-segment",
    name: "Revenue by Order Amount",
    description: "Analyze revenue distribution across different order sizes",
    category: "comparison",
    sql: `SELECT 
  CASE 
    WHEN amount < 100 THEN 'Small'
    WHEN amount < 500 THEN 'Medium'
    ELSE 'Large'
  END as order_size,
  COUNT(*) as count,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_amount
FROM orders
GROUP BY order_size
ORDER BY total_revenue DESC`,
    requiredTables: ["orders"],
    placeholders: {},
  },
  {
    id: "daily-transaction-volume",
    name: "Daily Transaction Volume",
    description: "Monitor transaction frequency and patterns by day",
    category: "trends",
    sql: `SELECT 
  DATE(created_at) as date,
  COUNT(*) as transaction_count,
  SUM(amount) as daily_total,
  AVG(amount) as avg_transaction
FROM orders
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30`,
    requiredTables: ["orders"],
    placeholders: {
      days: "30",
    },
  },
  {
    id: "customer-metrics",
    name: "Key Customer Metrics",
    description: "Get comprehensive overview of customer engagement and value",
    category: "customer",
    sql: `SELECT 
  COUNT(DISTINCT customer_id) as total_customers,
  COUNT(*) as total_orders,
  SUM(amount) as lifetime_value,
  AVG(amount) as avg_order_value,
  MAX(amount) as highest_order,
  MIN(amount) as lowest_order
FROM orders`,
    requiredTables: ["orders"],
    placeholders: {},
  },
  {
    id: "high-value-orders",
    name: "High Value Orders",
    description: "Identify orders with significant transaction amounts",
    category: "performance",
    sql: `SELECT 
  order_id,
  customer_id,
  amount,
  created_at,
  status
FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders) * 1.5
ORDER BY amount DESC
LIMIT 20`,
    requiredTables: ["orders"],
    placeholders: {},
  },
  {
    id: "order-status-analysis",
    name: "Order Status Analysis",
    description: "Track order completion rates and status distribution",
    category: "performance",
    sql: `SELECT 
  status,
  COUNT(*) as count,
  SUM(amount) as total_value,
  AVG(amount) as avg_value,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM orders
GROUP BY status
ORDER BY count DESC`,
    requiredTables: ["orders"],
    placeholders: {},
  },
  {
    id: "customer-order-frequency",
    name: "Customer Order Frequency",
    description: "Identify repeat customers and their purchase patterns",
    category: "customer",
    sql: `SELECT 
  customer_id,
  COUNT(*) as order_count,
  SUM(amount) as total_spent,
  AVG(amount) as avg_order_value,
  MIN(created_at) as first_order,
  MAX(created_at) as last_order
FROM orders
GROUP BY customer_id
ORDER BY order_count DESC`,
    requiredTables: ["orders"],
    placeholders: {},
  },
]

export const TEMPLATE_CATEGORIES: { [key in TemplateCategory]: string } = {
  sales: "Sales Analytics",
  customer: "Customer Insights",
  performance: "Product Performance",
  trends: "Trends & Growth",
  comparison: "Comparative Analysis",
}
