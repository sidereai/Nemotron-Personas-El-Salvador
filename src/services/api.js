const API_URL = import.meta.env.VITE_API_URL || '';

export const api = {
  async getDatasetStats() {
    const res = await fetch(`${API_URL}/api/dataset/stats`);
    if (!res.ok) throw new Error('Failed to fetch dataset stats');
    return res.json();
  },

  async getSampleProfiles(count = 10) {
    const res = await fetch(`${API_URL}/api/dataset/sample?count=${count}`);
    if (!res.ok) throw new Error('Failed to fetch sample profiles');
    return res.json();
  }
};
