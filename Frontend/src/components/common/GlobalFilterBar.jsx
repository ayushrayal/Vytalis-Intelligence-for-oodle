import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { RefreshCw, Calendar, Clock, ChevronDown } from 'lucide-react';
import { useDateFilter } from '../../context/DateFilterContext.jsx';
import { DATE_PRESETS, DATE_PRESET_LABELS } from '../../constants/datePresets.js';

export default function GlobalFilterBar() {
  const {
    selectedPreset,
    singleDate,
    fromDate,
    toDate,
    lastUpdated,
    isRefreshing,
    setPreset,
    setSingleDate,
    setCustomRange,
    refresh
  } = useDateFilter();

  const [activePopover, setActivePopover] = useState(null); // null | 'custom' | 'single'
  const [customFrom, setCustomFrom] = useState(fromDate || '');
  const [customTo, setCustomTo] = useState(toDate || '');
  const [tempSingleDate, setTempSingleDate] = useState(singleDate || new Date().toISOString().split('T')[0]);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const customButtonRef = useRef(null);
  const singleButtonRef = useRef(null);
  const popoverRef = useRef(null);

  // Sync custom/single date inputs when context dates change
  useEffect(() => {
    if (fromDate) setCustomFrom(fromDate);
    if (toDate) setCustomTo(toDate);
    if (singleDate) setTempSingleDate(singleDate);
  }, [fromDate, toDate, singleDate]);

  // Update floating popover position below trigger button
  const updatePopoverPos = useCallback(() => {
    const targetRef = activePopover === 'single' ? singleButtonRef : customButtonRef;
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const popoverWidth = 288; // 18rem = 288px
      let left = rect.left;

      // Prevent overflowing off right edge of screen
      if (left + popoverWidth > window.innerWidth - 16) {
        left = Math.max(16, window.innerWidth - popoverWidth - 16);
      }

      setPopoverPos({
        top: rect.bottom + 8,
        left: left
      });
    }
  }, [activePopover]);

  const handleTogglePopover = (type) => {
    if (activePopover === type) {
      setActivePopover(null);
    } else {
      setActivePopover(type);
    }
  };

  useEffect(() => {
    if (activePopover) {
      updatePopoverPos();
    }
  }, [activePopover, updatePopoverPos]);

  // Close popover when clicking outside & handle scroll/resize
  useEffect(() => {
    if (!activePopover) return;

    function handleClickOutside(event) {
      const targetRef = activePopover === 'single' ? singleButtonRef : customButtonRef;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        targetRef.current &&
        !targetRef.current.contains(event.target)
      ) {
        setActivePopover(null);
      }
    }

    function handleScrollOrResize() {
      updatePopoverPos();
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [activePopover, updatePopoverPos]);

  // Format date display for Custom Range pill
  const formatRangeLabel = (fromStr, toStr) => {
    if (!fromStr || !toStr) return 'Custom Range';
    try {
      const f = new Date(fromStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      const t = new Date(toStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      return `${f} → ${t}`;
    } catch {
      return `${fromStr} → ${toStr}`;
    }
  };

  // Format date display for Single Date button (e.g. "Jul 22, 2026")
  const formatSingleDateLabel = (dateStr) => {
    if (!dateStr) return 'Single Date';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customFrom && customTo) {
      setCustomRange({ from: customFrom, to: customTo });
      setActivePopover(null);
    }
  };

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (tempSingleDate) {
      setSingleDate(tempSingleDate);
      setActivePopover(null);
    }
  };

  const formattedLastUpdated = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--';

  const presetList = [
    DATE_PRESETS.TODAY,
    DATE_PRESETS.YESTERDAY,
    DATE_PRESETS.LAST_7_DAYS,
    DATE_PRESETS.LAST_30_DAYS,
    DATE_PRESETS.THIS_MONTH,
    DATE_PRESETS.LAST_MONTH,
  ];

  return (
    <div className="sticky top-0 z-30 bg-canvas/90 backdrop-blur-md py-3 px-6 border-b border-card-border/60 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-surface p-2.5 rounded-card border border-card-border shadow-xs">
        
        {/* Preset Pills - Single line, no wrap, no horizontal scrollbars */}
        <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {presetList.map((presetKey) => {
            const isActive = selectedPreset === presetKey;
            return (
              <button
                key={presetKey}
                type="button"
                onClick={() => {
                  setPreset(presetKey);
                  setActivePopover(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none shrink-0 ${
                  isActive
                    ? 'bg-primary text-surface shadow-xs font-bold'
                    : 'bg-surface hover:bg-canvas text-text-secondary hover:text-text-primary border border-card-border/60'
                }`}
              >
                {DATE_PRESET_LABELS[presetKey]}
              </button>
            );
          })}

          {/* Single Date Picker Button */}
          <button
            ref={singleButtonRef}
            type="button"
            onClick={() => handleTogglePopover('single')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none shrink-0 ${
              selectedPreset === DATE_PRESETS.SINGLE_DATE
                ? 'bg-primary text-surface shadow-xs font-bold'
                : 'bg-surface hover:bg-canvas text-text-secondary hover:text-text-primary border border-card-border/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {selectedPreset === DATE_PRESETS.SINGLE_DATE
                ? formatSingleDateLabel(singleDate)
                : DATE_PRESET_LABELS[DATE_PRESETS.SINGLE_DATE]}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activePopover === 'single' ? 'rotate-180' : ''}`} />
          </button>

          {/* Unified Custom Range Picker Button */}
          <button
            ref={customButtonRef}
            type="button"
            onClick={() => handleTogglePopover('custom')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none shrink-0 ${
              selectedPreset === DATE_PRESETS.CUSTOM
                ? 'bg-primary text-surface shadow-xs font-bold'
                : 'bg-surface hover:bg-canvas text-text-secondary hover:text-text-primary border border-card-border/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {selectedPreset === DATE_PRESETS.CUSTOM
                ? formatRangeLabel(fromDate, toDate)
                : DATE_PRESET_LABELS[DATE_PRESETS.CUSTOM]}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activePopover === 'custom' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Right Section: Refresh & Last Updated Timestamp */}
        <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-card-border/60 pt-2 lg:pt-0 shrink-0">
          {/* Last Updated Timestamp */}
          <div className="flex items-center gap-1.5 text-[11px] text-text-secondary font-medium whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-text-secondary/70" />
            <span>Last updated: <span className="font-semibold text-text-primary">{formattedLastUpdated}</span></span>
          </div>

          {/* Primary Refresh Button */}
          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            aria-label="Refresh Analytics Data"
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold text-surface bg-primary hover:bg-primary-hover disabled:bg-primary/60 rounded-xl transition-all shadow-xs active:scale-98 cursor-pointer disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

      </div>

      {/* Floating Custom Range Popover Portal */}
      {activePopover === 'custom' &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: 'fixed',
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
              zIndex: 9999
            }}
            className="w-72 bg-surface p-4 rounded-card border border-card-border shadow-card animate-fadeIn"
          >
            <div className="text-xs font-bold text-text-primary mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              Select Custom Date Range
            </div>
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1">Start Date</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-card-border rounded-xl bg-canvas text-text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1">End Date</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-card-border rounded-xl bg-canvas text-text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActivePopover(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-surface bg-primary hover:bg-primary-hover rounded-xl shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Apply Range
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}

      {/* Floating Single Date Popover Portal */}
      {activePopover === 'single' &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: 'fixed',
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
              zIndex: 9999
            }}
            className="w-72 bg-surface p-4 rounded-card border border-card-border shadow-card animate-fadeIn"
          >
            <div className="text-xs font-bold text-text-primary mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              Select Single Analytics Date
            </div>
            <form onSubmit={handleSingleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1">Target Date</label>
                <input
                  type="date"
                  value={tempSingleDate}
                  onChange={(e) => setTempSingleDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-card-border rounded-xl bg-canvas text-text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActivePopover(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-surface bg-primary hover:bg-primary-hover rounded-xl shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}
    </div>
  );
}
