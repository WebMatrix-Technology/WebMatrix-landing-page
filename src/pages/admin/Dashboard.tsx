const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/50 p-4">
          <div className="text-sm text-muted-foreground">Projects</div>
          <div className="text-3xl font-bold">—</div>
        </div>
        <div className="rounded-xl border border-border/50 p-4">
          <div className="text-sm text-muted-foreground">Blog Posts</div>
          <div className="text-3xl font-bold">—</div>
        </div>
        <div className="rounded-xl border border-border/50 p-4">
          <div className="text-sm text-muted-foreground">Leads</div>
          <div className="text-3xl font-bold">—</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

