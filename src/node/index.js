const express = require("express");
const app = express();
const cors = require("cors");
const { Pool } = require("pg");

const port = 5200;

// ミドルウェア設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// PostgreSQL接続設定
const pool = new Pool({
  user: "user_5200",
  host: "db",
  database: "crm_5200",
  password: "pass_5200",
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// 顧客一覧取得
app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers ORDER BY id ASC");
    res.json(customerData.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err.message);
  }
});


// 顧客登録
app.post("/add-customer", async (req, res) => {
  try {
    console.log("POST data:", req.body);
    const { companyName, industry, contact, location } = req.body;

    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );

    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error("DB error:", err);
    res.json({ success: false });
  }
});


// 顧客詳細取得（詳細画面・編集画面共通）
app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM customers WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// 顧客削除
app.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM customers WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// 顧客情報更新
app.put("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, industry, contact, location } = req.body;

    const query = `
      UPDATE customers
      SET company_name = $1,
          industry = $2,
          contact = $3,
          location = $4
      WHERE id = $5
    `;

    await pool.query(query, [companyName, industry, contact, location, id]);

    res.json({ success: true });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
