import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import BugCard from '../components/BugCard'
import StatCard from '../components/StatCard'
import NewBugModal from '../components/NewBugModal'
import BugDetailsModal from '../components/BugDetailsModal' 
import useAuth from '../auths/useAuth'
import { supabase } from '../lib/supabase'
import '../index.css'

export default function Dashboard() {
    const [recentBugs, setRecentBugs] = useState([]);
    const [stats, setStats] = useState({
      total: 0,
      critical: 0,
      open: 0,
    });
    const [bugsLoading, setBugLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBug, setSelectedBug] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const { loading: authLoading, user, isAuthenticated } = useAuth();

    const fetchStats = async () => {
        try {
          setBugLoading(true);

          const [
            { count: total, error: errTotal },
            { count: critical, error: errCritical },
            { count: open, error: errOpen }
          ] = await Promise.all([
            supabase.from('bugs').select('*', { count: 'exact', head: true }),
            supabase.from('bugs').select('*', { count: 'exact', head: true }).eq('severity', 'critical'),
            supabase.from('bugs').select('*', { count: 'exact', head: true }).eq('status', 'open')
          ]);

          if (errTotal || errCritical || errOpen) {
            throw new Error('Stats query failed');
          }

          const newStats = {
            total: total || 0,
            critical: critical || 0,
            open: open || 0
          };

          console.log('Raw counts from Supabase:', newStats);

          setStats(newStats);
        } catch (err) {
          console.error('fetchStats error:', err);
          setError('Failed to load stats');
        } finally {
          setBugLoading(false);
        }
    };

    // Load stats when authenticated
    useEffect(() => {
      if (isAuthenticated) {
        fetchStats();
      } else {
        setBugLoading(false);
      }
    }, [isAuthenticated]);

    const handleBugCreated = (newBug = null) => {
      if (newBug) {
        setRecentBugs(prev => [newBug, ...prev]); 
      }
      fetchStats();
      setIsModalOpen(false);
    };

    const handleBugClick = (bug) => {
      setSelectedBug(bug);
      setIsDetailsOpen(true);
    };

    const handleBugUpdated = (updatedBug) => {
      setRecentBugs(prev =>
        prev.map(b => (b.id === updatedBug.id ? updatedBug : b))
      );
      fetchStats();
    };

    const handleBugDeleted = (deletedId) => {
      setRecentBugs(prev => prev.filter(b => b.id !== deletedId));
      fetchStats();
      setIsDetailsOpen(false);
      setSelectedBug(null);
    };

    useEffect(() => {
      if (!isAuthenticated) {
        setBugLoading(false);
        return;
      }

      const fetchBugs = async () => {
        try {
          const { data, error } = await supabase
            .from('bugs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(8);

          if (error) throw error;

          setRecentBugs(data || []);
        } catch (err) {
          setError('Failed to load bugs. Please try again.');
          console.error(err);
        } finally {
          setBugLoading(false);
        }
      };

      fetchBugs();
    }, [isAuthenticated]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Loading...</div>;

    return (
      <div className="bg-black text-white">
        <Header />

        <main className="min-h-screen flex flex-col bg-black text-white pt-24">
          <div className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Your existing welcome section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome back, {user?.user_metadata?.name || 'Alex'}</h1>
                  <p className="mt-1 text-sm text-gray-400">
                    Here’s a quick overview of your recent bug reports.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded shadow-sm transition-colors"
                    onClick={() => setIsModalOpen(true)}
                  >
                    + Add New Bug
                  </button>
                  {isModalOpen && (
                    <NewBugModal
                      onClose={() => setIsModalOpen(false)}
                      onBugCreated={handleBugCreated}
                    />
                  )}
                </div>
              </div>

              {/* Recent Bugs section*/}
              <section className="mt-8">
                <h2 className="sr-only">Recent Bugs</h2>

                {bugsLoading ? (
                  <div className="text-center py-16 text-gray-400">Loading your bugs...</div>
                ) : error ? (
                  <div className="text-center py-16 text-red-400">{error}</div>
                ) : recentBugs.length === 0 ? (
                  <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-medium text-white">No bugs tracked yet</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Start logging your first bug to keep everything organized.
                    </p>
                    <button
                      className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded shadow-sm transition-colors"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Add Your First Bug
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentBugs.map((b) => (
                      <BugCard key={b.id} bug={b} onClick={handleBugClick} />
                    ))}
                  </div>
                )}
              </section>

              {/* Quick Stats section */}
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-white mb-6">Quick Stats</h2>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-sm">
                  {bugsLoading ? ( 
                    <div className="mt-4 text-4xl font-bold text-gray-900 dark:text-white animate-pulse">
                      ...
                    </div>
                  ) : error ? (
                    <div className="mt-4 text-4xl font-bold text-red-400">Error</div>
                  ) : (
                    <div className="grid grid-cols-1 text-white sm:grid-cols-3 gap-6">
                      <StatCard title="Total Bugs" value={stats.total} />
                      <StatCard title="Critical Bugs" value={stats.critical} />
                      <StatCard title="Open Bugs" value={stats.open} />
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {isDetailsOpen && selectedBug && (
            <BugDetailsModal
              bug={selectedBug}
              onClose={() => {
                setIsDetailsOpen(false);
                setSelectedBug(null);
              }}
              onUpdate={handleBugUpdated}
              onDelete={handleBugDeleted}
            />
          )}

          {/* Footer – now sticks to bottom */}
          <footer className="mt-auto bg-gray-950 border-t border-gray-800 py-6 text-center text-sm text-gray-500">
            Bug Tracker • Made with ♥ by Hebron © {new Date().getFullYear()}
          </footer>
        </main>
      </div>
    )
}