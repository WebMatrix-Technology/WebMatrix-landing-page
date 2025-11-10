import { Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuth';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { LayoutDashboard, FolderGit2, FileText, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-r border-border/50 p-4 md:sticky md:top-0 md:h-screen space-y-6 bg-background/50 backdrop-blur">
        <div className="font-display text-xl tracking-tight">Admin Panel</div>
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
            activeClassName="bg-muted/30 text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/projects"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
            activeClassName="bg-muted/30 text-foreground"
          >
            <FolderGit2 className="h-4 w-4" />
            Projects
          </NavLink>
          <NavLink
            to="/admin/posts"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
            activeClassName="bg-muted/30 text-foreground"
          >
            <FileText className="h-4 w-4" />
            Blog Posts
          </NavLink>
        </nav>
        <Button variant="outline" onClick={handleLogout} className="mt-6 w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </aside>
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

