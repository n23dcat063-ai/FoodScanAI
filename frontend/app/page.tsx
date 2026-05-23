"use client";

import React, { useState, useRef, useCallback } from "react";

/* ──────────────────────────────────
   Types
   ────────────────────────────────── */
interface TopPrediction { food: string; confidence: number; }
interface ClassifierResult { food: string; confidence: number; top_3: TopPrediction[]; }
interface PortionResult { food: string; estimated_weight_g: number; confidence: number; }
interface NutritionResult { estimated_calories: number; protein_g: number; carbs_g: number; fat_g: number; }
interface AnalysisResponse {
  classifier_result: ClassifierResult;
  portion_result: PortionResult;
  nutrition_result: NutritionResult;
}

const API_BASE_URL = "http://127.0.0.1:8000";

/* ── Helpers ── */
const fmtFood = (n: string) => n.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/* ── Icons ── */
const IcoUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IcoZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IcoRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
  </svg>
);
const IcoX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoTarget = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IcoLeaf = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/>
  </svg>
);

/* ── Confidence Ring ── */
function ConfidenceRing({ value, size = 96 }: { value: number; size?: number }) {
  const r = (size - 16) / 2, circ = 2 * Math.PI * r, off = circ - value * circ;
  return (
    <div className="confidence-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E"/><stop offset="100%" stopColor="#4ADE80"/>
          </linearGradient>
        </defs>
        <circle className="ring-bg" cx={size/2} cy={size/2} r={r}/>
        <circle className="ring-fill" cx={size/2} cy={size/2} r={r} strokeDasharray={circ} strokeDashoffset={off}/>
      </svg>
      <div className="ring-center">
        <span className="text-lg font-bold" style={{ color: '#16A34A' }}>{pct(value)}</span>
        <span className="text-[10px]" style={{ color: '#9CA3AF' }}>confidence</span>
      </div>
    </div>
  );
}

/* ── NutrientBar ── */
function NutrientBar({ label, value, max, unit, type }: {
  label: string; value: number; max: number; unit: string; type: 'protein'|'carbs'|'fat';
}) {
  const colors: Record<string, string> = { protein: '#8B5CF6', carbs: '#22C55E', fat: '#F97316' };
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium" style={{ color: '#4B5563' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: colors[type] }}/>{label}
        </span>
        <span className="font-semibold" style={{ color: colors[type] }}>{value.toFixed(1)}{unit}</span>
      </div>
      <div className="nutrient-bar-track">
        <div className={`nutrient-bar-fill ${type}`} style={{ width: `${Math.min((value/max)*100, 100)}%` }}/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   PAGE
   ══════════════════════════════════ */
export default function HomePage() {
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [drag, setDrag] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const resRef = useRef<HTMLDivElement>(null);

  const onFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) { setError("Vui lòng tải lên file ảnh hợp lệ."); return; }
    if (f.size > 10*1024*1024) { setError("Ảnh phải nhỏ hơn 10 MB."); return; }
    setFile(f); setError(null); setResult(null);
    const r = new FileReader();
    r.onload = e => setPreview(e.target?.result as string);
    r.readAsDataURL(f);
  }, []);

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDrag(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDrag(false);
    if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
  }, [onFile]);

  const analyze = useCallback(async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch(`${API_BASE_URL}/analyze-food`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Lỗi server ${res.status}: ${await res.text()}`);
      const data: AnalysisResponse = await res.json();
      setResult(data);
      setTimeout(() => resRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Đã xảy ra lỗi không mong muốn.");
    } finally { setLoading(false); }
  }, [file]);

  const reset = useCallback(() => {
    setFile(null); setPreview(null); setResult(null); setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const { classifier_result: cls, portion_result: portion, nutrition_result: nutr } = result ?? {};

  return (
    <>
      {/* ═══ HEADER ═══ */}
      <header className="site-header">
        <div className="site-header-inner">
          <div className="flex items-center gap-2">
            <IcoLeaf />
            <span className="text-base font-bold" style={{ color: '#16A34A' }}>AI ScanFood</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #DCFCE7' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22C55E' }}/>
            API Online
          </div>
        </div>
      </header>

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ═══ TITLE ═══ */}
        <section className="text-center mb-8 anim-fade-up">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2" style={{ color: '#111827' }}>
            AI Food Calorie Analyzer
          </h2>
          <p className="text-sm sm:text-base" style={{ color: '#6B7280' }}>
            Tải lên ảnh món ăn và nhận kết quả phân tích dinh dưỡng ngay lập tức.
          </p>
        </section>

        {/* ═══ UPLOAD HERO ═══ */}
        <section className="anim-fade-up delay-1" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div
            id="dropzone"
            className={`upload-hero ${drag ? "drag-active" : ""} ${preview ? "has-preview" : ""}`}
            onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop}
            onClick={() => !preview && inputRef.current?.click()}
            role="button" tabIndex={0} aria-label="Upload food image"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
          >
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} id="file-input"/>

            {preview ? (
              <div className="preview-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Food preview"/>
                {loading && <div className="scanner-line"/>}
                <div className="preview-overlay"/>
                <button onClick={e => { e.stopPropagation(); reset(); }} className="preview-remove" aria-label="Xóa ảnh">
                  <IcoX/>
                </button>
                <div className="preview-info">
                  <div className="preview-tag">
                    <IcoCheck/><span className="truncate max-w-[140px]">{file?.name}</span>
                  </div>
                  <div className="preview-tag">{((file?.size??0)/1024/1024).toFixed(1)} MB</div>
                </div>
              </div>
            ) : (
              <>
                <button className="upload-btn" type="button">
                  <IcoUpload/> CHỌN ẢNH MÓN ĂN
                </button>
                <p className="upload-hint">hoặc thả ảnh vào đây</p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="error-msg anim-fade-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="action-row">
            <button id="analyze-button" className="btn-analyze" onClick={analyze} disabled={!file || loading}>
              {loading ? (<><div className="spinner"/><span>Đang phân tích...</span></>) : (<><IcoZap/><span>Phân tích món ăn</span></>)}
            </button>
            {file && (
              <button id="reset-button" className="btn-reset" onClick={reset}>
                <IcoRefresh/><span>Đặt lại</span>
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="anim-fade-in">
              <div className="progress-bar"><div className="progress-fill" style={{ width: '70%' }}/></div>
              <div className="loading-dots"><div className="loading-dot"/><div className="loading-dot"/><div className="loading-dot"/></div>
            </div>
          )}

          {/* Feature Bullets */}
          <div className="feature-list">
            {[
              'Nhận diện món ăn bằng AI với độ chính xác cao',
              'Phân tích chi tiết: calo, protein, carbs, fat',
              'Xử lý nhanh chóng — kết quả trong vài giây',
            ].map(t => (
              <div key={t} className="feature-item">
                <div className="feature-check"><IcoCheck/></div>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            RESULTS
           ═══════════════════════════════════════ */}
        {result && cls && portion && nutr && (
          <section ref={resRef} className="mt-10 space-y-5">
            {/* Classification Card */}
            <div className="result-card anim-fade-up">
              <div className="result-label"><IcoTarget/> Kết quả nhận diện</div>

              <div className="flex items-center gap-5 sm:gap-6">
                <ConfidenceRing value={cls.confidence}/>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium mb-0.5" style={{ color: '#9CA3AF' }}>Món ăn phát hiện</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold truncate" style={{ color: '#16A34A' }}>
                    {fmtFood(cls.food)}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #DCFCE7' }}>
                      ⚖ {portion.estimated_weight_g}g
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}>
                      🎯 Portion conf: {pct(portion.confidence)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top 3 */}
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Top 3 dự đoán</p>
                <div className="space-y-2">
                  {cls.top_3.map((p, i) => (
                    <div key={p.food} className={`top3-row anim-slide-right delay-${i+1}`} style={{ opacity: 0, animationFillMode: 'forwards' }}>
                      <div className={`top3-badge b${i+1}`}>#{i+1}</div>
                      <span className="flex-1 text-sm font-semibold truncate" style={{ color: '#1F2937' }}>{fmtFood(p.food)}</span>
                      <span className="text-xs font-mono" style={{ color: '#6B7280' }}>{pct(p.confidence)}</span>
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                        <div className="h-full rounded-full" style={{
                          width: `${p.confidence*100}%`,
                          background: i === 0 ? '#22C55E' : i === 1 ? '#8B5CF6' : '#F59E0B',
                        }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stat Mini Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 anim-fade-up delay-2" style={{ opacity: 0, animationFillMode: 'forwards' }}>
              {[
                { label: 'Calo', value: nutr.estimated_calories.toFixed(0), unit: 'kcal', cls: 'calories', color: '#F59E0B',
                  ico: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1012 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z"/></svg> },
                { label: 'Protein', value: nutr.protein_g.toFixed(1), unit: 'g', cls: 'protein', color: '#8B5CF6',
                  ico: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/></svg> },
                { label: 'Carbs', value: nutr.carbs_g.toFixed(1), unit: 'g', cls: 'carbs', color: '#22C55E',
                  ico: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
                { label: 'Fat', value: nutr.fat_g.toFixed(1), unit: 'g', cls: 'fat', color: '#F97316',
                  ico: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 018 0"/></svg> },
              ].map(s => (
                <div key={s.label} className={`stat-mini ${s.cls}`}>
                  <div className="mb-2">{s.ico}</div>
                  <p className="text-xl sm:text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider mt-0.5" style={{ color: '#9CA3AF' }}>{s.label} ({s.unit})</p>
                </div>
              ))}
            </div>

            {/* Nutrition Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Macro Bars */}
              <div className="result-card anim-fade-up delay-3" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                <div className="result-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
                  Chi tiết Macro
                </div>
                <div className="space-y-4">
                  <NutrientBar label="Protein" value={nutr.protein_g} max={150} unit="g" type="protein"/>
                  <NutrientBar label="Carbohydrates" value={nutr.carbs_g} max={300} unit="g" type="carbs"/>
                  <NutrientBar label="Fat" value={nutr.fat_g} max={100} unit="g" type="fat"/>
                </div>
              </div>

              {/* Donut + Legend */}
              <div className="result-card anim-fade-up delay-4" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                <div className="result-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0110 10"/></svg>
                  Phân bổ Calo
                </div>
                <div className="flex items-center gap-5">
                  {/* Donut */}
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <defs>
                        <linearGradient id="pG"><stop offset="0%" stopColor="#8B5CF6"/><stop offset="100%" stopColor="#A78BFA"/></linearGradient>
                        <linearGradient id="cG"><stop offset="0%" stopColor="#22C55E"/><stop offset="100%" stopColor="#4ADE80"/></linearGradient>
                        <linearGradient id="fG"><stop offset="0%" stopColor="#F97316"/><stop offset="100%" stopColor="#FB923C"/></linearGradient>
                      </defs>
                      {(() => {
                        const pC=nutr.protein_g*4, cC=nutr.carbs_g*4, fC=nutr.fat_g*9;
                        const tot=pC+cC+fC||1, r=38, circ=2*Math.PI*r, gap=2.5;
                        const segs=[{p:pC/tot,g:'url(#pG)'},{p:cC/tot,g:'url(#cG)'},{p:fC/tot,g:'url(#fG)'}];
                        let off=0;
                        return segs.map((s,i)=>{const l=s.p*circ-gap;const el=<circle key={i} cx="50" cy="50" r={r} fill="none" stroke={s.g} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${l} ${circ-l}`} strokeDashoffset={-off}/>;off+=s.p*circ;return el;});
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-extrabold" style={{ color: '#16A34A' }}>{nutr.estimated_calories.toFixed(0)}</span>
                      <span className="text-[9px]" style={{ color: '#9CA3AF' }}>kcal</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex-1 space-y-2.5">
                    {[
                      { l: 'Protein', cal: nutr.protein_g*4, g: nutr.protein_g, c: '#8B5CF6', bg: '#F5F3FF' },
                      { l: 'Carbs', cal: nutr.carbs_g*4, g: nutr.carbs_g, c: '#22C55E', bg: '#F0FDF4' },
                      { l: 'Fat', cal: nutr.fat_g*9, g: nutr.fat_g, c: '#F97316', bg: '#FFF7ED' },
                    ].map(m => {
                      const tot = nutr.protein_g*4+nutr.carbs_g*4+nutr.fat_g*9||1;
                      return (
                        <div key={m.l} className="comp-legend" style={{ background: m.bg }}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: m.c }}/>
                            <span className="text-xs font-semibold" style={{ color: m.c }}>{m.l}</span>
                          </div>
                          <p className="text-[11px]" style={{ color: '#6B7280' }}>
                            {m.g.toFixed(1)}g · {m.cal.toFixed(0)} kcal · {((m.cal/tot)*100).toFixed(0)}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Reset */}
            <div className="flex justify-center pt-3 pb-6 anim-fade-up delay-4" style={{ opacity: 0, animationFillMode: 'forwards' }}>
              <button className="btn-reset" onClick={reset}>
                <IcoRefresh/><span>Phân tích món ăn khác</span>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="site-footer">
        © 2026 AI ScanFood · Powered by Deep Learning
      </footer>
    </>
  );
}