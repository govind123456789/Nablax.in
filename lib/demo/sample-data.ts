// Enterprise-grade Demo Data with Realistic Relationships

export interface DemoTable {
  name: string
  columns: Array<{ name: string; type: string }>
  rows: any[]
  rowCount: number
}

export const DEMO_TABLES: Record<string, DemoTable> = {
  customers: {
    name: "customers",
    columns: [
      { name: "customer_id", type: "INT" },
      { name: "name", type: "VARCHAR" },
      { name: "email", type: "VARCHAR" },
      { name: "company", type: "VARCHAR" },
      { name: "industry", type: "VARCHAR" },
      { name: "signup_date", type: "DATE" },
      { name: "status", type: "VARCHAR" },
      { name: "annual_revenue", type: "DECIMAL" },
    ],
    rows: [
      {
        customer_id: 1,
        name: "Acme Corp",
        email: "contact@acme.com",
        company: "Acme Corporation",
        industry: "Technology",
        signup_date: "2023-01-15",
        status: "active",
        annual_revenue: 5000000,
      },
      {
        customer_id: 2,
        name: "TechFlow Inc",
        email: "sales@techflow.com",
        company: "TechFlow Inc",
        industry: "Software",
        signup_date: "2023-02-20",
        status: "active",
        annual_revenue: 3500000,
      },
      {
        customer_id: 3,
        name: "DataStream Ltd",
        email: "info@datastream.com",
        company: "DataStream Limited",
        industry: "Analytics",
        signup_date: "2022-11-10",
        status: "active",
        annual_revenue: 2800000,
      },
      {
        customer_id: 4,
        name: "CloudMax Systems",
        email: "support@cloudmax.com",
        company: "CloudMax Systems",
        industry: "Cloud Infrastructure",
        signup_date: "2023-03-05",
        status: "active",
        annual_revenue: 4200000,
      },
      {
        customer_id: 5,
        name: "Innovation Labs",
        email: "hello@innovationlabs.com",
        company: "Innovation Labs",
        industry: "AI/ML",
        signup_date: "2023-04-12",
        status: "active",
        annual_revenue: 1500000,
      },
    ],
    rowCount: 5,
  },

  orders: {
    name: "orders",
    columns: [
      { name: "order_id", type: "INT" },
      { name: "customer_id", type: "INT" },
      { name: "order_date", type: "DATE" },
      { name: "total_amount", type: "DECIMAL" },
      { name: "status", type: "VARCHAR" },
      { name: "payment_method", type: "VARCHAR" },
      { name: "items_count", type: "INT" },
    ],
    rows: [
      {
        order_id: 101,
        customer_id: 1,
        order_date: "2024-01-10",
        total_amount: 125000,
        status: "completed",
        payment_method: "credit_card",
        items_count: 15,
      },
      {
        order_id: 102,
        customer_id: 1,
        order_date: "2024-02-15",
        total_amount: 89000,
        status: "completed",
        payment_method: "bank_transfer",
        items_count: 12,
      },
      {
        order_id: 103,
        customer_id: 2,
        order_date: "2024-01-20",
        total_amount: 156000,
        status: "completed",
        payment_method: "credit_card",
        items_count: 18,
      },
      {
        order_id: 104,
        customer_id: 3,
        order_date: "2024-02-10",
        total_amount: 95000,
        status: "completed",
        payment_method: "bank_transfer",
        items_count: 11,
      },
      {
        order_id: 105,
        customer_id: 2,
        order_date: "2024-03-05",
        total_amount: 178000,
        status: "completed",
        payment_method: "credit_card",
        items_count: 22,
      },
      {
        order_id: 106,
        customer_id: 4,
        order_date: "2024-03-12",
        total_amount: 142000,
        status: "pending",
        payment_method: "credit_card",
        items_count: 14,
      },
      {
        order_id: 107,
        customer_id: 1,
        order_date: "2024-03-18",
        total_amount: 167000,
        status: "completed",
        payment_method: "bank_transfer",
        items_count: 19,
      },
      {
        order_id: 108,
        customer_id: 5,
        order_date: "2024-03-25",
        total_amount: 78000,
        status: "completed",
        payment_method: "credit_card",
        items_count: 9,
      },
    ],
    rowCount: 8,
  },

  products: {
    name: "products",
    columns: [
      { name: "product_id", type: "INT" },
      { name: "name", type: "VARCHAR" },
      { name: "category", type: "VARCHAR" },
      { name: "price", type: "DECIMAL" },
      { name: "stock_quantity", type: "INT" },
      { name: "supplier_id", type: "INT" },
      { name: "created_at", type: "DATE" },
    ],
    rows: [
      {
        product_id: 1001,
        name: "Enterprise Analytics Suite",
        category: "Software",
        price: 25000,
        stock_quantity: 100,
        supplier_id: 1,
        created_at: "2023-01-01",
      },
      {
        product_id: 1002,
        name: "Cloud Integration Platform",
        category: "Software",
        price: 18000,
        stock_quantity: 150,
        supplier_id: 2,
        created_at: "2023-02-01",
      },
      {
        product_id: 1003,
        name: "Data Warehouse",
        category: "Infrastructure",
        price: 45000,
        stock_quantity: 50,
        supplier_id: 1,
        created_at: "2023-03-01",
      },
      {
        product_id: 1004,
        name: "API Management Tool",
        category: "Software",
        price: 12000,
        stock_quantity: 200,
        supplier_id: 3,
        created_at: "2023-04-01",
      },
      {
        product_id: 1005,
        name: "Security Monitoring",
        category: "Infrastructure",
        price: 22000,
        stock_quantity: 75,
        supplier_id: 2,
        created_at: "2023-05-01",
      },
    ],
    rowCount: 5,
  },

  transactions: {
    name: "transactions",
    columns: [
      { name: "transaction_id", type: "INT" },
      { name: "order_id", type: "INT" },
      { name: "product_id", type: "INT" },
      { name: "quantity", type: "INT" },
      { name: "unit_price", type: "DECIMAL" },
      { name: "transaction_date", type: "DATE" },
      { name: "commission", type: "DECIMAL" },
    ],
    rows: [
      {
        transaction_id: 1,
        order_id: 101,
        product_id: 1001,
        quantity: 2,
        unit_price: 25000,
        transaction_date: "2024-01-10",
        commission: 5000,
      },
      {
        transaction_id: 2,
        order_id: 101,
        product_id: 1002,
        quantity: 1,
        unit_price: 18000,
        transaction_date: "2024-01-10",
        commission: 3600,
      },
      {
        transaction_id: 3,
        order_id: 102,
        product_id: 1003,
        quantity: 1,
        unit_price: 45000,
        transaction_date: "2024-02-15",
        commission: 9000,
      },
      {
        transaction_id: 4,
        order_id: 103,
        product_id: 1001,
        quantity: 3,
        unit_price: 25000,
        transaction_date: "2024-01-20",
        commission: 7500,
      },
      {
        transaction_id: 5,
        order_id: 104,
        product_id: 1004,
        quantity: 2,
        unit_price: 12000,
        transaction_date: "2024-02-10",
        commission: 4800,
      },
    ],
    rowCount: 5,
  },

  analytics: {
    name: "analytics",
    columns: [
      { name: "date", type: "DATE" },
      { name: "metric_name", type: "VARCHAR" },
      { name: "metric_value", type: "DECIMAL" },
      { name: "customer_id", type: "INT" },
      { name: "region", type: "VARCHAR" },
    ],
    rows: [
      { date: "2024-01-01", metric_name: "revenue", metric_value: 485000, customer_id: 1, region: "North America" },
      { date: "2024-01-01", metric_name: "transactions", metric_value: 45, customer_id: 2, region: "Europe" },
      { date: "2024-02-01", metric_name: "revenue", metric_value: 523000, customer_id: 1, region: "North America" },
      { date: "2024-02-01", metric_name: "transactions", metric_value: 52, customer_id: 3, region: "Asia Pacific" },
      { date: "2024-03-01", metric_name: "revenue", metric_value: 612000, customer_id: 2, region: "Europe" },
    ],
    rowCount: 5,
  },
}

export function generateSchemaFromDemoTables(): string {
  let schema = "-- QueryMind Demo Database Schema\n\n"

  Object.values(DEMO_TABLES).forEach((table) => {
    schema += `CREATE TABLE ${table.name} (\n`
    schema += table.columns.map((col) => `  ${col.name} ${col.type}`).join(",\n")
    schema += "\n);\n\n"
  })

  return schema
}
