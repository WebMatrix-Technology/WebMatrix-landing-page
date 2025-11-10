import { useMemo, useState } from 'react';
import { getLeads } from '@/data/contentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const LeadsAdmin = () => {
  const [query, setQuery] = useState('');
  const leads = getLeads();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return leads;
    return leads.filter(l =>
      [l.name, l.email, l.budget, l.timeline, l.message]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q))
    );
  }, [leads, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-display">Leads</h1>
        <Input
          placeholder="Search leads..."
          className="max-w-xs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent submissions ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr className="text-left border-b border-border/50">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Budget</th>
                  <th className="py-2 pr-4">Timeline</th>
                  <th className="py-2 pr-4">Message</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} className="border-b border-border/30">
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4">{l.name}</td>
                    <td className="py-2 pr-4">{l.email}</td>
                    <td className="py-2 pr-4">{l.budget || '-'}</td>
                    <td className="py-2 pr-4">{l.timeline || '-'}</td>
                    <td className="py-2 pr-4 max-w-[420px] truncate" title={l.message}>{l.message}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td className="py-8 text-center text-muted-foreground" colSpan={6}>
                      No leads yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsAdmin;

