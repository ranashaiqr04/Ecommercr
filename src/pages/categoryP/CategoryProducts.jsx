// src/pages/category/CategoryProducts.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  TextField,
  Button,
  Rating,
  CardActions,
} from "@mui/material";

export default function CategoryProducts() {
  const { id } = useParams(); // /category/:id

  // ---- Products ----
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // ---- Filters (simple: search + price range) ----
  const [search, setSearch]     = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  // ---- Reviews per product: { [productId]: { loading, error, list, newRating, newComment, submitting } } ----
  const [reviewsState, setReviewsState] = useState({});

  // 1) Load products of category
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const url = `https://mytshop.runasp.net/api/categories/${id}/products`;
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const list = Array.isArray(data) ? data : data?.items || [];
      setProducts(list);

      // initialize price range
      const prices = list
        .map((p) => Number(p.price ?? p.Price ?? 0))
        .filter((n) => !Number.isNaN(n));
      const pmin = prices.length ? Math.min(...prices) : 0;
      const pmax = prices.length ? Math.max(...prices) : 0;
      setMinPrice(pmin);
      setMaxPrice(pmax);
    } catch (e) {
      const status = e.response?.status;
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        JSON.stringify(e.response?.data || {});
      setError(`(${status || "ERR"}) Failed to load products for this category. ${msg || ""}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 2) GET reviews (try common endpoints; fallback to product details)
  const fetchReviewsFor = async (productId) => {
    const token = localStorage.getItem("userToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    setReviewsState((s) => ({
      ...s,
      [productId]: {
        ...(s[productId] || {}),
        loading: true,
        error: "",
        list: s[productId]?.list || [],
        newRating: s[productId]?.newRating || 0,
        newComment: s[productId]?.newComment || "",
        submitting: false,
      },
    }));

    // try: /Reviews?productId=, /Reviews/Product/{id}, /products/{id}/Reviews, /products/{id}/reviews
    const candidates = [
      `https://mytshop.runasp.net/api/Reviews?productId=${productId}`,
      `https://mytshop.runasp.net/api/Reviews/Product/${productId}`,
      `https://mytshop.runasp.net/api/products/${productId}/Reviews`,
      `https://mytshop.runasp.net/api/products/${productId}/reviews`,
    ];

    for (const url of candidates) {
      try {
        const res = await axios.get(url, { headers });
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.items || res.data?.data || [];
        if (Array.isArray(list)) {
          setReviewsState((s) => ({
            ...s,
            [productId]: {
              ...(s[productId] || {}),
              loading: false,
              error: "",
              list,
            },
          }));
          return;
        }
      } catch (_) {
        // try next
      }
    }

    // fallback: GET product details and read embedded reviews
    try {
      const prodUrl = `https://mytshop.runasp.net/api/products/${productId}`;
      const r = await axios.get(prodUrl, { headers });
      const data = r.data || {};
      const list =
        data.reviews ||
        data.Reviews ||
        data.productReviews ||
        data.ProductReviews ||
        data.reviewList ||
        data.ReviewList ||
        [];
      setReviewsState((s) => ({
        ...s,
        [productId]: {
          ...(s[productId] || {}),
          loading: false,
          error: "",
          list: Array.isArray(list) ? list : [],
        },
      }));
    } catch (e2) {
      const status = e2.response?.status;
      const msg =
        e2.response?.data?.message ||
        e2.response?.data?.error ||
        JSON.stringify(e2.response?.data || {});
      setReviewsState((s) => ({
        ...s,
        [productId]: {
          ...(s[productId] || {}),
          loading: false,
          error: `(${status || "ERR"}) Failed to load reviews. ${msg || ""}`,
          list: [],
        },
      }));
    }
  };

  // 3) ADD review (POST /api/products/{id}/Reviews/Create) – body may be PascalCase or camelCase
  const addReview = async (productId) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setReviewsState((s) => ({
        ...s,
        [productId]: {
          ...(s[productId] || {}),
          error: "You must be logged in to add a review.",
        },
      }));
      return;
    }

    const cur = reviewsState[productId] || {};
    const rating = cur.newRating || 0;
    const comment = (cur.newComment || "").trim();

    if (!rating) {
      setReviewsState((s) => ({
        ...s,
        [productId]: {
          ...(s[productId] || {}),
          error: "Please choose a rating.",
        },
      }));
      return;
    }

    setReviewsState((s) => ({
      ...s,
      [productId]: { ...(s[productId] || {}), submitting: true, error: "" },
    }));

    const url = `https://mytshop.runasp.net/api/products/${productId}/Reviews/Create`;
    try {
      // try PascalCase first (common in .NET)
      await axios.post(
        url,
        { Rating: rating, Comment: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
    } catch (e1) {
      // fallback to camelCase body
      try {
        await axios.post(
          url,
          { rating, comment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
      } catch (e2) {
        const status = e2.response?.status;
        const msg =
          e2.response?.data?.message ||
          e2.response?.data?.error ||
          JSON.stringify(e2.response?.data || {});
        setReviewsState((s) => ({
          ...s,
          [productId]: {
            ...(s[productId] || {}),
            submitting: false,
            error: `(${status || "ERR"}) Failed to submit review. ${msg || ""}`,
          },
        }));
        return;
      }
    }

    // success: clear inputs and refetch
    setReviewsState((s) => ({
      ...s,
      [productId]: { ...(s[productId] || {}), submitting: false, newRating: 0, newComment: "" },
    }));
    await fetchReviewsFor(productId);
  };

  // 4) After products load, fetch reviews for each (auto, no button)
  useEffect(() => {
    if (!products?.length) return;
    products
      .map((p) => p.id ?? p.Id)
      .filter((pid) => pid != null)
      .forEach((pid) => {
        const rs = reviewsState[pid];
        if (!rs || (!rs.loading && !rs.list && !rs.error)) {
          fetchReviewsFor(pid);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // 5) Derived filtered list
  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const name = (p.name ?? p.Name ?? "").toString().toLowerCase();
      const desc = (p.description ?? p.Description ?? "").toString().toLowerCase();
      const price = Number(p.price ?? p.Price ?? 0);
      const inText = !q || name.includes(q) || desc.includes(q);
      const inPrice = price >= minPrice && price <= maxPrice;
      return inText && inPrice;
    });
  }, [products, search, minPrice, maxPrice]);

  // ---- UI states ----
  if (loading) {
    return (
      <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* Filters */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              placeholder="Search by name or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <Typography>No products match the filters.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredProducts.map((p) => {
            const name = p.name || p.Name || "Unnamed product";
            const desc = p.description || p.Description || "";
            const img  = p.imageUrl || p.ImageUrl || p.image || "/placeholder.png";
            const pid  = p.id || p.Id;

            const rv = pid != null ? reviewsState[pid] : undefined;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={pid || name}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={img}
                    alt={name}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {desc || "No description available."}
                    </Typography>
                  </CardContent>

                  {/* Reviews below product */}
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Reviews
                    </Typography>

                    {rv?.loading && (
                      <Stack alignItems="center" sx={{ py: 1 }}>
                        <CircularProgress size={22} />
                      </Stack>
                    )}
                    {rv?.error && <Alert severity="error">{rv.error}</Alert>}
                    {!rv?.loading && !rv?.error && (
                      <>
                        {!rv?.list || rv.list.length === 0 ? (
                          <Typography variant="body2">No reviews yet.</Typography>
                        ) : (
                          <List dense sx={{ py: 0 }}>
                            {rv.list.map((r, idx) => (
                              <ListItem key={r.id || idx} sx={{ px: 0 }}>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" fontWeight={600}>
                                      {r.userName || r.UserName || "Anonymous"}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="body2" color="text.secondary">
                                      {r.comment || r.Comment || r.text || ""}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </>
                    )}
                  </Box>

                  {/* Add Review */}
                  <CardActions sx={{ px: 2, pt: 0, pb: 2 }}>
                    <Stack spacing={1} sx={{ width: "100%" }}>
                      <Typography variant="subtitle2">Add a review</Typography>
                      <Rating
                        value={rv?.newRating || 0}
                        onChange={(_, v) =>
                          setReviewsState((s) => ({
                            ...s,
                            [pid]: { ...(s[pid] || {}), newRating: v || 0, error: "" },
                          }))
                        }
                      />
                      <TextField
                        size="small"
                        placeholder="Your comment…"
                        value={rv?.newComment || ""}
                        onChange={(e) =>
                          setReviewsState((s) => ({
                            ...s,
                            [pid]: { ...(s[pid] || {}), newComment: e.target.value, error: "" },
                          }))
                        }
                        multiline
                        minRows={2}
                      />
                      <Box>
                        <Button
                          variant="contained"
                          size="small"
                          disabled={rv?.submitting}
                          onClick={() => addReview(pid)}
                        >
                          {rv?.submitting ? "Submitting…" : "Submit Review"}
                        </Button>
                      </Box>
                      {rv?.error && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {rv.error}
                        </Alert>
                      )}
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
