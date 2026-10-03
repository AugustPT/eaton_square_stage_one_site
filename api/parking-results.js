function hstMonthBounds() {
  const hstNow = new Date(Date.now() - 10 * 60 * 60 * 1000);
  const y = hstNow.getUTCFullYear();
  const m = hstNow.getUTCMonth();
  return {
    currentStart: Date.UTC(y, m, 1, 10, 0, 0),
    nextStart: Date.UTC(y, m + 1, 1, 10, 0, 0),
    previousStart: Date.UTC(y, m - 1, 1, 10, 0, 0),
    month: `${y}-${String(m + 1).padStart(2, '0')}`,
  };
}

function summarize(rows, startMs, endMs) {
  const used = rows.filter((r) => {
    if (r.status !== 'used' || !r.issued_at) return false;
    const t = Date.parse(r.issued_at);
    return Number.isFinite(t) && t >= startMs && t < endMs;
  });

  const byBusiness = new Map();
  for (const r of used) {
    const slug = String(r.slug || 'unknown');
    byBusiness.set(slug, (byBusiness.get(slug) || 0) + 1);
  }

  return {
    validations: used.length,
    activeBusinesses: byBusiness.size,
    byBusiness: [...byBusiness.entries()]
      .map(([slug, validations]) => ({ slug, validations }))
      .sort((a, b) => b.validations - a.validations || a.slug.localeCompare(b.slug)),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const host = req.headers.host || 'www.eatonsquarehi.com';
    const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0];
    const upstream = `${proto}://${host}/parking/api/pool?action=state`;

    const headers = {};
    if (req.headers.cookie) headers.cookie = req.headers.cookie;

    const r = await fetch(upstream, { headers, cache: 'no-store' });
    const data = await r.json();
    if (!r.ok || !data?.ok || !Array.isArray(data.rows)) {
      return res.status(502).json({ ok: false, error: 'parking_data_unavailable' });
    }

    const { currentStart, nextStart, previousStart, month } = hstMonthBounds();
    const current = summarize(data.rows, currentStart, nextStart);
    const previous = summarize(data.rows, previousStart, currentStart);
    const totalIssued = data.rows.filter((x) => x.status === 'used' && x.issued_at).length;

    return res.status(200).json({
      ok: true,
      month,
      timezone: 'Pacific/Honolulu',
      current,
      previous,
      totalIssued,
    });
  } catch (err) {
    console.error('[parking-results]', err);
    return res.status(500).json({ ok: false, error: 'parking_results_unavailable' });
  }
}
