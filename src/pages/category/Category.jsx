import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";   // ✅ 1) استيراد Link

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const getCategories = async () => {
    try {
      const response = await axios.get("https://mytshop.runasp.net/api/categories");
      const list = Array.isArray(response.data) ? response.data : response.data?.items || [];
      setCategories(list);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error)   return <div style={{ color: "crimson" }}>{error}</div>;

  return (
    <div>
      <h2>Categories</h2>
      {categories.length === 0 ? (
        <div>No categories found.</div>
      ) : (
        <ul>
          {categories.map((c) => {
            const idOrSlug = c.id ?? c.slug ?? c.name; // استخدمي id لو موجود
            return (
              <li key={idOrSlug}>
                {/* ✅ 2) رابط لصفحة منتجات الفئة */}
                <Link to={`/category/${idOrSlug}`}>{c.name}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
