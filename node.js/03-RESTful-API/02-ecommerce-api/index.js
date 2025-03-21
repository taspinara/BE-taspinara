const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// GET: Tüm ürünleri getir
app.get('/products', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// POST: Yeni ürün oluştur
app.post('/products', async (req, res) => {
    const { name, image, description, category, price, stock } = req.body;
    if (!name || !price || !stock) {
        return res.status(400).json({ error: 'Eksik alanlar var' });
    }
    try {
        const { rows } = await pool.query(
            'INSERT INTO products (name, image, description, category, price, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, image, description, category, price, stock]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// GET: ID ile ürün getir
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// PUT: ID ile ürünü güncelle
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image, description, category, price, stock } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE products SET name = $1, image = $2, description = $3, category = $4, price = $5, stock = $6 WHERE id = $7 RETURNING *',
            [name, image, description, category, price, stock, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// DELETE: ID ile ürünü sil
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }
        res.status(200).json({ message: 'Ürün silindi' });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Hatalı yollar için 404
app.use((req, res) => {
    res.status(404).json({ error: 'Bu yol bulunamadı' });
});

// Desteklenmeyen metodlar için 405
app.use((req, res, next) => {
    res.status(405).json({ error: 'Bu metod desteklenmiyor' });
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor`);
});