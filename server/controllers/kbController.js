import Article from "../models/Article.js";
import { logAction } from "../utils/auditHelper.js";

// GET /api/kb?query=...
export const searchKB = async (req, res) => {
  try {
    const { query } = req.query;
    const q = query
      ? {
          $or: [
            { title: new RegExp(query, "i") },
            { body: new RegExp(query, "i") },
            { tags: { $in: [new RegExp(query, "i")] } },
          ],
        }
      : {};

    const articles = await Article.find(q).sort({ updatedAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error("Search failed", err);
    res.status(500).json({ error: "Failed to search articles" });
  }
};

// POST /api/kb
export const createArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();

    await logAction(req.user.id, "kb:create", { articleId: article._id });

    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/kb/:id
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ error: "Article not found" });

    await logAction(req.user.id, "kb:update", {
      articleId: article._id,
      changes: req.body,
    });

    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/kb/:id
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    await logAction(req.user.id, "kb:delete", { articleId: req.params.id });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete failed", err);
    res.status(400).json({ error: err.message });
  }
};

// GET /api/kb/:id
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    res.json(article);
  } catch (err) {
    console.error("Get article failed", err);
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/kb/:id/status
export const setPublishStatus = async (req, res) => {
  try {
    const { status } = req.body; // "published" or "draft"
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!article) return res.status(404).json({ error: "Article not found" });

    await logAction(req.user.id, "kb:status:update", {
      articleId: article._id,
      status,
    });

    res.json(article);
  } catch (err) {
    console.error("Set publish status failed", err);
    res.status(400).json({ error: err.message });
  }
};