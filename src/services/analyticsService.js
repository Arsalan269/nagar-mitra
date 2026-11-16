import { supabase } from './supabase';

/**
 * Get report counts grouped by status.
 */
export const getReportStats = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('status');

    if (error) {
      return { data: null, error: error.message };
    }

    const stats = {
      total: data.length,
      submitted: 0,
      under_review: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
    };

    data.forEach((report) => {
      if (stats[report.status] !== undefined) {
        stats[report.status]++;
      }
    });

    return { data: stats, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get report counts grouped by category.
 */
export const getCategoryStats = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('category');

    if (error) {
      return { data: null, error: error.message };
    }

    const stats = {};
    data.forEach((report) => {
      stats[report.category] = (stats[report.category] || 0) + 1;
    });

    return { data: stats, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get report counts grouped by severity.
 */
export const getSeverityStats = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('severity');

    if (error) {
      return { data: null, error: error.message };
    }

    const stats = {};
    data.forEach((report) => {
      stats[report.severity] = (stats[report.severity] || 0) + 1;
    });

    return { data: stats, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get report counts per day for the last N days.
 * @param {number} days - Number of days to look back (default 30)
 */
export const getTimelineStats = async (days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('reports')
      .select('created_at')
      .gte('created_at', startDate.toISOString());

    if (error) {
      return { data: null, error: error.message };
    }

    const timeline = {};
    // Initialize all days to 0
    for (let i = 0; i <= days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - i));
      const key = d.toISOString().split('T')[0];
      timeline[key] = 0;
    }

    data.forEach((report) => {
      const key = new Date(report.created_at).toISOString().split('T')[0];
      if (timeline[key] !== undefined) {
        timeline[key]++;
      }
    });

    const result = Object.entries(timeline).map(([date, count]) => ({
      date,
      count,
    }));

    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get the top reported localities.
 * @param {number} limit - Max number of localities to return (default 10)
 */
export const getTopLocalities = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('locality');

    if (error) {
      return { data: null, error: error.message };
    }

    const counts = {};
    data.forEach((report) => {
      if (report.locality) {
        counts[report.locality] = (counts[report.locality] || 0) + 1;
      }
    });

    const sorted = Object.entries(counts)
      .map(([locality, count]) => ({ locality, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return { data: sorted, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

/**
 * Get hotspot clusters by grouping reports into ~200m grid cells.
 * Only returns clusters with 3 or more reports.
 * @param {object} filters - optional { category, status, severity }
 */
export const getHotspots = async (filters = {}) => {
  try {
    let query = supabase
      .from('reports')
      .select('id, category, severity, status, latitude, longitude, locality');

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

    // Group by grid cells (~200m: ~0.002 degrees)
    const gridSize = 0.002;
    const clusters = {};

    data.forEach((report) => {
      if (report.latitude && report.longitude) {
        const gridLat = Math.round(report.latitude / gridSize) * gridSize;
        const gridLng = Math.round(report.longitude / gridSize) * gridSize;
        const key = `${gridLat.toFixed(4)},${gridLng.toFixed(4)}`;

        if (!clusters[key]) {
          clusters[key] = {
            latitude: gridLat,
            longitude: gridLng,
            reports: [],
            count: 0,
          };
        }
        clusters[key].reports.push(report);
        clusters[key].count++;
      }
    });

    // Only return clusters with >= 3 reports
    const hotspots = Object.values(clusters)
      .filter((cluster) => cluster.count >= 3)
      .sort((a, b) => b.count - a.count);

    return { data: hotspots, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};
