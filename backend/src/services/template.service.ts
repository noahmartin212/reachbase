import { Pool } from 'pg';
import {
  Template,
  TemplatePerformance,
  TemplateSnippet,
  TemplateCollection,
  TemplateVariant,
  CreateTemplateDTO,
  UpdateTemplateDTO,
  TemplateListQuery,
  CreateSnippetDTO,
  UpdateSnippetDTO,
  CreateVariantDTO,
  CreateCollectionDTO,
  TemplateWithPerformance,
} from '../types/template.types';

export class TemplateService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // ==================== TEMPLATE CRUD ====================

  async createTemplate(
    workspaceId: string,
    userId: string,
    data: CreateTemplateDTO
  ): Promise<Template> {
    const query = `
      INSERT INTO templates (
        workspace_id, created_by, name, description, subject_line, body_html, body_plain,
        category, tags, persona, industry, company_size, sales_stage, campaign_type,
        tone, language, access_level, custom_fields
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `;

    const values = [
      workspaceId,
      userId,
      data.name,
      data.description || null,
      data.subject_line,
      data.body_html,
      data.body_plain || null,
      data.category || null,
      data.tags || [],
      data.persona || null,
      data.industry || null,
      data.company_size || null,
      data.sales_stage || null,
      data.campaign_type || null,
      data.tone || null,
      data.language || 'en',
      data.access_level || 'personal',
      JSON.stringify(data.custom_fields || {}),
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getTemplateById(templateId: string, userId: string): Promise<TemplateWithPerformance | null> {
    const query = `
      SELECT
        t.*,
        tp.open_rate,
        tp.click_rate,
        tp.reply_rate,
        tp.sends,
        EXISTS(SELECT 1 FROM template_favorites WHERE template_id = t.id AND user_id = $2) as is_favorite
      FROM templates t
      LEFT JOIN template_performance tp ON t.id = tp.template_id
      WHERE t.id = $1
    `;

    const result = await this.pool.query(query, [templateId, userId]);
    return result.rows[0] || null;
  }

  async listTemplates(
    workspaceId: string,
    userId: string,
    filters: TemplateListQuery
  ): Promise<{ templates: TemplateWithPerformance[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'desc',
      search,
      category,
      persona,
      industry,
      company_size,
      sales_stage,
      campaign_type,
      tone,
      status,
      access_level,
      tags,
      created_by,
      min_reply_rate,
      max_reply_rate,
      is_favorite,
    } = filters;

    const offset = (page - 1) * limit;
    const conditions: string[] = ['t.workspace_id = $1'];
    const values: any[] = [workspaceId];
    let paramCount = 1;

    // Build WHERE conditions
    if (search) {
      paramCount++;
      conditions.push(`(t.name ILIKE $${paramCount} OR t.description ILIKE $${paramCount} OR t.subject_line ILIKE $${paramCount})`);
      values.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      conditions.push(`t.category = $${paramCount}`);
      values.push(category);
    }

    if (persona) {
      paramCount++;
      conditions.push(`t.persona = $${paramCount}`);
      values.push(persona);
    }

    if (industry) {
      paramCount++;
      conditions.push(`t.industry = $${paramCount}`);
      values.push(industry);
    }

    if (company_size) {
      paramCount++;
      conditions.push(`t.company_size = $${paramCount}`);
      values.push(company_size);
    }

    if (sales_stage) {
      paramCount++;
      conditions.push(`t.sales_stage = $${paramCount}`);
      values.push(sales_stage);
    }

    if (campaign_type) {
      paramCount++;
      conditions.push(`t.campaign_type = $${paramCount}`);
      values.push(campaign_type);
    }

    if (tone) {
      paramCount++;
      conditions.push(`t.tone = $${paramCount}`);
      values.push(tone);
    }

    if (status) {
      paramCount++;
      conditions.push(`t.status = $${paramCount}`);
      values.push(status);
    }

    if (access_level) {
      paramCount++;
      conditions.push(`t.access_level = $${paramCount}`);
      values.push(access_level);
    }

    if (created_by) {
      paramCount++;
      conditions.push(`t.created_by = $${paramCount}`);
      values.push(created_by);
    }

    if (tags && tags.length > 0) {
      paramCount++;
      conditions.push(`t.tags && $${paramCount}`);
      values.push(tags);
    }

    if (min_reply_rate !== undefined) {
      paramCount++;
      conditions.push(`tp.reply_rate >= $${paramCount}`);
      values.push(min_reply_rate);
    }

    if (max_reply_rate !== undefined) {
      paramCount++;
      conditions.push(`tp.reply_rate <= $${paramCount}`);
      values.push(max_reply_rate);
    }

    if (is_favorite) {
      paramCount++;
      conditions.push(`EXISTS(SELECT 1 FROM template_favorites WHERE template_id = t.id AND user_id = $${paramCount})`);
      values.push(userId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Map sort_by to actual column
    const sortColumns: Record<string, string> = {
      name: 't.name',
      created_at: 't.created_at',
      updated_at: 't.updated_at',
      last_used_at: 't.last_used_at',
      use_count: 't.use_count',
      reply_rate: 'tp.reply_rate',
    };

    const sortColumn = sortColumns[sort_by] || 't.created_at';
    const order = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Count query
    const countQuery = `
      SELECT COUNT(DISTINCT t.id) as total
      FROM templates t
      LEFT JOIN template_performance tp ON t.id = tp.template_id
      ${whereClause}
    `;

    const countResult = await this.pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    // Data query
    const dataQuery = `
      SELECT
        t.*,
        tp.open_rate,
        tp.click_rate,
        tp.reply_rate,
        tp.sends,
        tp.replies,
        EXISTS(SELECT 1 FROM template_favorites WHERE template_id = t.id AND user_id = $${paramCount + 1}) as is_favorite
      FROM templates t
      LEFT JOIN template_performance tp ON t.id = tp.template_id
      ${whereClause}
      ORDER BY ${sortColumn} ${order} NULLS LAST
      LIMIT $${paramCount + 2} OFFSET $${paramCount + 3}
    `;

    values.push(userId, limit, offset);
    const dataResult = await this.pool.query(dataQuery, values);

    return {
      templates: dataResult.rows,
      total,
    };
  }

  async updateTemplate(
    templateId: string,
    userId: string,
    data: UpdateTemplateDTO
  ): Promise<Template> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (data.name !== undefined) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(data.name);
    }

    if (data.description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(data.description);
    }

    if (data.subject_line !== undefined) {
      paramCount++;
      updates.push(`subject_line = $${paramCount}`);
      values.push(data.subject_line);
    }

    if (data.body_html !== undefined) {
      paramCount++;
      updates.push(`body_html = $${paramCount}`);
      values.push(data.body_html);
    }

    if (data.body_plain !== undefined) {
      paramCount++;
      updates.push(`body_plain = $${paramCount}`);
      values.push(data.body_plain);
    }

    if (data.category !== undefined) {
      paramCount++;
      updates.push(`category = $${paramCount}`);
      values.push(data.category);
    }

    if (data.tags !== undefined) {
      paramCount++;
      updates.push(`tags = $${paramCount}`);
      values.push(data.tags);
    }

    if (data.persona !== undefined) {
      paramCount++;
      updates.push(`persona = $${paramCount}`);
      values.push(data.persona);
    }

    if (data.industry !== undefined) {
      paramCount++;
      updates.push(`industry = $${paramCount}`);
      values.push(data.industry);
    }

    if (data.company_size !== undefined) {
      paramCount++;
      updates.push(`company_size = $${paramCount}`);
      values.push(data.company_size);
    }

    if (data.status !== undefined) {
      paramCount++;
      updates.push(`status = $${paramCount}`);
      values.push(data.status);
    }

    if (data.access_level !== undefined) {
      paramCount++;
      updates.push(`access_level = $${paramCount}`);
      values.push(data.access_level);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    paramCount++;
    values.push(templateId);

    const query = `
      UPDATE templates
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteTemplate(templateId: string): Promise<void> {
    await this.pool.query('DELETE FROM templates WHERE id = $1', [templateId]);
  }

  async duplicateTemplate(templateId: string, userId: string, newName: string): Promise<Template> {
    const query = `
      INSERT INTO templates (
        workspace_id, created_by, name, description, subject_line, body_html, body_plain,
        category, tags, persona, industry, company_size, sales_stage, campaign_type,
        tone, language, access_level, custom_fields, parent_template_id
      )
      SELECT
        workspace_id, $1, $2, description, subject_line, body_html, body_plain,
        category, tags, persona, industry, company_size, sales_stage, campaign_type,
        tone, language, access_level, custom_fields, $3
      FROM templates
      WHERE id = $3
      RETURNING *
    `;

    const result = await this.pool.query(query, [userId, newName, templateId]);
    return result.rows[0];
  }

  // ==================== FAVORITES ====================

  async addFavorite(userId: string, templateId: string): Promise<void> {
    await this.pool.query(
      'INSERT INTO template_favorites (user_id, template_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, templateId]
    );
  }

  async removeFavorite(userId: string, templateId: string): Promise<void> {
    await this.pool.query(
      'DELETE FROM template_favorites WHERE user_id = $1 AND template_id = $2',
      [userId, templateId]
    );
  }

  // ==================== SNIPPETS ====================

  async createSnippet(
    workspaceId: string,
    userId: string,
    data: CreateSnippetDTO
  ): Promise<TemplateSnippet> {
    const query = `
      INSERT INTO template_snippets (workspace_id, created_by, name, content, snippet_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      workspaceId,
      userId,
      data.name,
      data.content,
      data.snippet_type || null,
      data.tags || [],
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async listSnippets(workspaceId: string, snippetType?: string): Promise<TemplateSnippet[]> {
    let query = 'SELECT * FROM template_snippets WHERE workspace_id = $1';
    const values: any[] = [workspaceId];

    if (snippetType) {
      query += ' AND snippet_type = $2';
      values.push(snippetType);
    }

    query += ' ORDER BY use_count DESC, name ASC';

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async updateSnippet(snippetId: string, data: UpdateSnippetDTO): Promise<TemplateSnippet> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (data.name !== undefined) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(data.name);
    }

    if (data.content !== undefined) {
      paramCount++;
      updates.push(`content = $${paramCount}`);
      values.push(data.content);
    }

    if (data.snippet_type !== undefined) {
      paramCount++;
      updates.push(`snippet_type = $${paramCount}`);
      values.push(data.snippet_type);
    }

    if (data.tags !== undefined) {
      paramCount++;
      updates.push(`tags = $${paramCount}`);
      values.push(data.tags);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    paramCount++;
    values.push(snippetId);

    const query = `
      UPDATE template_snippets
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteSnippet(snippetId: string): Promise<void> {
    await this.pool.query('DELETE FROM template_snippets WHERE id = $1', [snippetId]);
  }

  // ==================== PERFORMANCE ====================

  async getTemplatePerformance(templateId: string): Promise<TemplatePerformance | null> {
    const result = await this.pool.query(
      'SELECT * FROM template_performance WHERE template_id = $1',
      [templateId]
    );
    return result.rows[0] || null;
  }

  async getTopPerformers(workspaceId: string, limit: number = 10): Promise<TemplateWithPerformance[]> {
    const query = `
      SELECT
        t.*,
        tp.open_rate,
        tp.click_rate,
        tp.reply_rate,
        tp.sends,
        tp.replies
      FROM templates t
      INNER JOIN template_performance tp ON t.id = tp.template_id
      WHERE t.workspace_id = $1 AND tp.sends >= 10
      ORDER BY tp.reply_rate DESC
      LIMIT $2
    `;

    const result = await this.pool.query(query, [workspaceId, limit]);
    return result.rows;
  }

  // ==================== COLLECTIONS ====================

  async createCollection(
    workspaceId: string,
    userId: string,
    data: CreateCollectionDTO
  ): Promise<TemplateCollection> {
    const query = `
      INSERT INTO template_collections (workspace_id, created_by, name, description, is_public)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [workspaceId, userId, data.name, data.description || null, data.is_public || false];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async listCollections(workspaceId: string): Promise<TemplateCollection[]> {
    const result = await this.pool.query(
      'SELECT * FROM template_collections WHERE workspace_id = $1 ORDER BY name ASC',
      [workspaceId]
    );
    return result.rows;
  }

  async addTemplateToCollection(collectionId: string, templateId: string): Promise<void> {
    await this.pool.query(
      'INSERT INTO template_collection_items (collection_id, template_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [collectionId, templateId]
    );
  }

  async removeTemplateFromCollection(collectionId: string, templateId: string): Promise<void> {
    await this.pool.query(
      'DELETE FROM template_collection_items WHERE collection_id = $1 AND template_id = $2',
      [collectionId, templateId]
    );
  }
}
