import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  FolderHeart, 
  LayoutGrid, 
  List, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { useWish } from '../context/WishContext';
import { TEMPLATES } from '../data/templates';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { EmptyState } from '../components/common/EmptyState';
import type { WishConfig } from '../types';

export const MyCreationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { creations, deleteWish, duplicateWish, loadWishForEdit } = useWish();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishToDelete, setWishToDelete] = useState<WishConfig | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter creations
  const filteredCreations = useMemo(() => {
    return creations.filter((w) => {
      const matchSearch = 
        w.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.templateId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [creations, searchQuery]);

  const handleEdit = (id: string) => {
    loadWishForEdit(id);
    navigate('/editor');
  };

  const handlePreview = (id: string) => {
    loadWishForEdit(id);
    navigate('/editor');
  };

  const handleDuplicate = (id: string) => {
    duplicateWish(id);
  };

  const handleDeleteConfirm = async () => {
    if (!wishToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteWish(wishToDelete.id);
      setWishToDelete(null);
    } catch {
      // Error feedback is already surfaced through context toast
    } finally {
      setIsDeleting(false);
    }
  };

  const getTemplateName = (templateId: string) => {
    const t = TEMPLATES.find(x => x.id === templateId);
    return t ? t.name : 'Custom Celebration';
  };

  const getTemplateThumbnail = (templateId: string, fallbackUrl?: string) => {
    if (fallbackUrl && fallbackUrl.trim().length > 0) return fallbackUrl;
    const t = TEMPLATES.find(x => x.id === templateId);
    return t ? t.thumbnail : 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recently edited';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header and Create Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rosewood-50 text-rosewood-700 text-xs font-bold uppercase tracking-wider mb-2">
              <FolderHeart className="w-3.5 h-3.5" />
              <span>Personal Celebration Dashboard</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-plum-950">
              My Saved Creations
            </h1>
            <p className="text-sm text-slate-500 font-light mt-1">
              Manage, preview, duplicate, and customize your celebration websites.
            </p>
          </div>

          <Link
            to="/create"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-plum-900 via-rosewood-600 to-rosewood-500 text-white font-bold text-xs shadow-soft hover:shadow-glow flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Website</span>
          </Link>
        </div>

        {/* Search and View Controls */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-plum-100 shadow-soft mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by recipient or sender..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-plum-200 text-xs text-slate-900 focus:outline-none focus:border-rosewood-500 bg-[#FAF7F5]/50"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs text-slate-400 font-medium">View:</span>
            <div className="flex bg-plum-50 p-0.5 rounded-xl border border-plum-100">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white text-plum-950 shadow-xs' : 'text-slate-500'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-plum-950 shadow-xs' : 'text-slate-500'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Content Area */}
        {filteredCreations.length > 0 ? (
          viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreations.map((wish) => (
                <div
                  key={wish.id}
                  className="bg-white rounded-3xl border border-plum-100 shadow-soft hover:shadow-soft-lg transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={getTemplateThumbnail(wish.templateId, wish.photoUrl)}
                      alt={wish.recipientName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-plum-950 shadow-xs">
                        {getTemplateName(wish.templateId)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-lg text-plum-950 mb-1">
                        {wish.recipientName || 'Unnamed Celebration'}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        &ldquo;{wish.message || 'No message added yet'}&rdquo;
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pb-3 mb-3 border-b border-plum-50">
                        <span>From: {wish.senderName || 'Anonymous'}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(wish.updatedAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(wish.id)}
                            className="p-2 rounded-xl text-slate-600 hover:text-plum-950 hover:bg-plum-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Edit Website"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-rosewood-600" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handlePreview(wish.id)}
                            className="p-2 rounded-xl text-slate-600 hover:text-plum-950 hover:bg-plum-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Preview Website"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                          {wish.slug && (
                            <Link
                              to={`/wish/${wish.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Open Live Public Website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Live</span>
                            </Link>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDuplicate(wish.id)}
                            className="p-2 rounded-xl text-slate-500 hover:text-plum-950 hover:bg-plum-50 transition-colors"
                            title="Duplicate Creation"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setWishToDelete(wish)}
                            className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Creation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-3xl border border-plum-100 shadow-soft overflow-hidden divide-y divide-plum-50">
              {filteredCreations.map((wish) => (
                <div
                  key={wish.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-[#FAF7F5]/50 transition-colors"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={getTemplateThumbnail(wish.templateId, wish.photoUrl)}
                      alt={wish.recipientName}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-plum-100"
                    />
                    <div>
                      <h3 className="font-display font-bold text-base text-plum-950">
                        {wish.recipientName || 'Unnamed Celebration'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-rosewood-600">{getTemplateName(wish.templateId)}</span>
                        <span>•</span>
                        <span>By {wish.senderName || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{formatDate(wish.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleEdit(wish.id)}
                      className="px-3 py-1.5 rounded-xl border border-plum-200 text-xs font-semibold text-plum-950 hover:bg-plum-50 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-rosewood-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handlePreview(wish.id)}
                      className="px-3 py-1.5 rounded-xl border border-plum-200 text-xs font-semibold text-slate-700 hover:bg-plum-50 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => handleDuplicate(wish.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-plum-950 hover:bg-plum-50"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setWishToDelete(wish)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-plum-100 shadow-soft">
            <EmptyState
              icon={<FolderHeart className="w-8 h-8" />}
              title="No celebrations found"
              description={searchQuery ? 'No wishes match your current search terms.' : 'You have not created any celebration websites yet. Start building one now!'}
              actionLabel="Create Celebration Website"
              onAction={() => navigate('/create')}
            />
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!wishToDelete}
        title="Delete Celebration Website?"
        message={`Are you sure you want to delete the celebration for "${wishToDelete?.recipientName || 'this recipient'}"? This action cannot be undone and its public link will become permanently inactive.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Yes, Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!isDeleting) setWishToDelete(null);
        }}
      />

    </div>
  );
};
