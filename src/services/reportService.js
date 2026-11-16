import { supabase } from './supabase';

/**
 * Generate a reference ID in the format NM-YYYY-NNNN.
 */
export const generateReferenceId = async () => {
  try {
    // Try Supabase RPC first
    const { data, error } = await supabase.rpc('generate_reference_id');
    if (!error && data) {
      return { data, error: null };
    }
  } catch {
    // Fallback below
  }

  // Fallback: generate locally
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return { data: `NM-${year}-${randomNum}`, error: null };
};

/**
 * Create a new report.
 */
export const createReport = async (reportData) => {
  try {
    const { data: refId } = await generateReferenceId();

    const { data, error } = await supabase
      .from('reports')
      .insert({
        citizen_id: reportData.citizenId,
        category: reportData.category,
        issue_type: reportData.issueType,
        title: reportData.title,
        description: reportData.description,
        severity: reportData.severity,
        locality: reportData.locality,
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        photo_path: reportData.photoPath || null,
        status: 'submitted',
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get all reports for a specific user, ordered by created_at descending.
 */
export const getMyReports = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('citizen_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get a single report by id.
 */
export const getReportById = async (reportId) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get a single report by reference_id.
 */
export const getReportByReferenceId = async (refId) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('reference_id', refId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get all reports (admin) with optional filters.
 * @param {object} filters - { category, status, severity, dateFrom, dateTo, search }
 */
export const getAllReports = async (filters = {}) => {
  try {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.severity) {
      query = query.eq('severity', filters.severity);
    }
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,locality.ilike.%${filters.search}%,reference_id.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Update a report's status and insert a status update record.
 */
export const updateReportStatus = async (reportId, newStatus, adminNote, adminId) => {
  try {
    const { data: reportData, error: reportError } = await supabase
      .from('reports')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', reportId)
      .select()
      .single();

    if (reportError) {
      return { data: null, error: reportError.message };
    }

    // Get old status from the report data we just updated
    const oldStatus = reportData.status;

    const { error: updateError } = await supabase
      .from('report_updates')
      .insert({
        report_id: reportId,
        old_status: oldStatus,
        new_status: newStatus,
        admin_note: adminNote || '',
        updated_by: adminId,
      });

    if (updateError) {
      console.error('Error inserting report update:', updateError);
    }

    return { data: reportData, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get all status updates for a report.
 */
export const getReportUpdates = async (reportId) => {
  try {
    const { data, error } = await supabase
      .from('report_updates')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get reports for public map display with limited fields.
 * @param {object} filters - optional { category, status, severity }
 */
export const getPublicMapReports = async (filters = {}) => {
  try {
    let query = supabase
      .from('reports')
      .select('id, reference_id, category, title, issue_type, severity, status, latitude, longitude, locality, created_at');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.severity) {
      query = query.eq('severity', filters.severity);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Upload a report photo to Supabase Storage.
 */
export const uploadReportPhoto = async (file, userId) => {
  try {
    const timestamp = Date.now();
    const filePath = `${userId}/${timestamp}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('report-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data.path, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get the public URL for a photo stored in Supabase Storage.
 */
export const getPhotoUrl = (photoPath) => {
  if (!photoPath) return null;
  const { data } = supabase.storage
    .from('report-photos')
    .getPublicUrl(photoPath);
  return data.publicUrl;
};
