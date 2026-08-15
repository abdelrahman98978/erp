import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/appStore';
import { SIDEBAR_MENU } from '../../data/sidebarMenu';

interface QuickSearchModalProps {
  onNavigate: (href: string, title: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ onNavigate }) => {
  const { isQuickSearchOpen, setQuickSearchOpen } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten sidebar menu into searchable actions
  const allActions: { id: string; title: string; href: string; category: string; icon?: string }[] = [];
  SIDEBAR_MENU.forEach((section) => {
    if (section.href) {
      allActions.push({
        id: section.id,
        title: section.title,
        href: section.href,
        category: 'الرئيسية',
        icon: section.icon,
      });
    }
    if (section.children) {
      section.children.forEach((item) => {
        if (item.href) {
          allActions.push({
            id: item.id,
            title: item.title,
            href: item.href,
            category: section.title,
            icon: item.icon,
          });
        }
        if (item.children) {
          item.children.forEach((subItem) => {
            if (subItem.href) {
              allActions.push({
                id: subItem.id,
                title: `${item.title} › ${subItem.title}`,
                href: subItem.href,
                category: section.title,
                icon: subItem.icon || item.icon,
              });
            }
          });
        }
      });
    }
  });

  // Filter actions based on query
  const filteredActions = searchTerm.trim() === ''
    ? allActions.slice(0, 8)
    : allActions.filter((a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.href.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickSearchOpen(!isQuickSearchOpen);
      }
      if (e.key === 'Escape' && isQuickSearchOpen) {
        setQuickSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickSearchOpen, setQuickSearchOpen]);

  useEffect(() => {
    if (isQuickSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isQuickSearchOpen]);

  if (!isQuickSearchOpen) return null;

  const handleSelect = (href: string, title: string) => {
    onNavigate(href, title);
    setQuickSearchOpen(false);
    setSearchTerm('');
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredActions.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredActions.length - 1));
    } else if (e.key === 'Enter' && filteredActions[selectedIndex]) {
      e.preventDefault();
      const selected = filteredActions[selectedIndex];
      handleSelect(selected.href, selected.title);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-start justify-center pt-20 p-4"
      onClick={() => setQuickSearchOpen(false)}
      dir="rtl"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <i className="fa-solid fa-magnifying-glass text-slate-400 text-lg"></i>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInInput}
            placeholder="ابحث في شاشات النظام، الحسابات، العملاء، العقود... (Ctrl + K)"
            className="flex-1 text-slate-800 text-base placeholder-slate-400 outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-md">
            ESC للإغلاق
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-50">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <i className="fa-solid fa-folder-open text-3xl mb-2 text-slate-300"></i>
              <p className="text-sm">لا توجد نتائج تطابق بحثك</p>
            </div>
          ) : (
            filteredActions.map((action, idx) => (
              <div
                key={action.id}
                onClick={() => handleSelect(action.href, action.title)}
                className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  idx === selectedIndex ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
                      idx === selectedIndex ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <i className={action.icon || 'fa-solid fa-arrow-right'}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{action.title}</h4>
                    <span className="text-[11px] text-slate-400">{action.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">#{action.href}</span>
                  <i className="fa-solid fa-chevron-left text-xs text-slate-300"></i>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ للتنقل</span>
            <span>↵ للاختيار</span>
          </div>
          <span className="text-[11px] text-slate-400">نظام خالد السليم الموحد للبحث السريع</span>
        </div>
      </div>
    </div>
  );
};
