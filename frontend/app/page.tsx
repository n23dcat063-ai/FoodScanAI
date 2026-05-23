'use client';

import { useState, useRef, useCallback } from 'react';

/* ──────────────────────────────────────────
   Types
────────────────────────────────────────── */
interface FoodPrediction {
  food: string;
  confidence: number;
}

interface ClassifierResult {
  food: string;
  confidence: number;
  top_3: FoodPrediction[];
}

interface NutritionResult {
  food: string;
  estimated_weight_g: number;
  estimated_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface ApiResponse {
  classifier_result: ClassifierResult;
  nutrition_result: NutritionResult;
}


/* ──────────────────────────────────────────
   Helpers
────────────────────────────────────────── */
function formatFoodName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/* ──────────────────────────────────────────
   Sub-components
────────────────────────────────────────── */

/** Confidence bar row */
function ConfidenceBar({
  label,
  value,
  color = 'primary',
}: {
  label: string;
  value: number;
  color?: 'primary' | 'purple' | 'warm';
}) {
  const fillClass =
    color === 'purple' ? 'fill-carbs' : color === 'warm' ? 'fill-fat' : 'fill-protein';

  return (
    <div className="confidence-section">
      <div className="confidence-label">
        <span>{label}</span>
        <span className="confidence-value">{pct(value)}</span>
      </div>
      <div className="confidence-bar-track" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`${label}: ${pct(value)}`}>
        <div
          className={`confidence-bar-fill ${fillClass}`}
          style={{ width: pct(value) }}
        />
      </div>
    </div>
  );
}

/** Individual macro card */
function MacroCard({
  icon,
  value,
  label,
  type,
}: {
  icon: string;
  value: number;
  label: string;
  type: 'protein' | 'carbs' | 'fat';
}) {
  return (
    <div className={`macro-card macro-card-${type}`} role="region" aria-label={`${label}: ${value}g`}>
      <span className="macro-icon" aria-hidden="true">{icon}</span>
      <div className="macro-value">
        {value}
        <span className="macro-gram">g</span>
      </div>
      <div className="macro-label">{label}</div>
    </div>
  );
}

/** Top-3 prediction list */
function PredictionList({ predictions }: { predictions: FoodPrediction[] }) {
  const rankClass = (i: number) =>
    i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : 'rank-3';
  const rankLabel = (i: number) =>
    i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';

  return (
    <ol className="prediction-list" aria-label="Top 3 food predictions">
      {predictions.map((p, i) => (
        <li
          key={p.food}
          className={`prediction-item ${i === 0 ? 'prediction-top' : ''}`}
        >
          <div className={`prediction-rank ${rankClass(i)}`} aria-hidden="true">
            {rankLabel(i)}
          </div>
          <span className="prediction-name">{formatFoodName(p.food)}</span>
          <div className="prediction-bar" role="progressbar" aria-valuenow={Math.round(p.confidence * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`${formatFoodName(p.food)}: ${pct(p.confidence)}`}>
            <div
              className="prediction-bar-fill"
              style={{ width: pct(p.confidence) }}
            />
          </div>
          <span className="prediction-pct">{pct(p.confidence)}</span>
        </li>
      ))}
    </ol>
  );
}

/** Calorie + weight summary */
function CalorieDisplay({ nutrition }: { nutrition: NutritionResult }) {
  const totalMacros =
    nutrition.protein_g + nutrition.carbs_g + nutrition.fat_g;

  return (
    <>
      {/* Weight badge */}
      <div className="weight-badge" role="status">
        <span aria-hidden="true">⚖️</span>
        Khẩu phần ước tính: {nutrition.estimated_weight_g}g
      </div>

      {/* Calorie row */}
      <div className="calorie-display" role="region" aria-label={`Tổng calo: ${nutrition.estimated_calories} kcal`}>
        <div>
          <div className="calorie-number">{nutrition.estimated_calories}</div>
          <div className="calorie-unit">kcal / khẩu phần</div>
        </div>
        <div className="calorie-meta">
          <div className="calorie-meta-item">
            <span className="dot" style={{ background: '#4ade80' }} aria-hidden="true" />
            Protein: {nutrition.protein_g}g
          </div>
          <div className="calorie-meta-item">
            <span className="dot" style={{ background: '#a78bfa' }} aria-hidden="true" />
            Carbs: {nutrition.carbs_g}g
          </div>
          <div className="calorie-meta-item">
            <span className="dot" style={{ background: '#fb923c' }} aria-hidden="true" />
            Fat: {nutrition.fat_g}g
          </div>
        </div>
      </div>

      {/* Macro cards */}
      <div className="macro-grid" role="region" aria-label="Macronutrient breakdown">
        <MacroCard icon="🥩" value={nutrition.protein_g} label="Protein" type="protein" />
        <MacroCard icon="🌾" value={nutrition.carbs_g} label="Carbs" type="carbs" />
        <MacroCard icon="🥑" value={nutrition.fat_g} label="Fat" type="fat" />
      </div>

      {/* Macro bars */}
      <div className="macro-bars" role="region" aria-label="Macro percentage bars">
        <div className="macro-bar-item">
          <span className="macro-bar-label" style={{ color: '#4ade80' }}>Protein</span>
          <div className="macro-bar-track">
            <div
              className="macro-bar-fill fill-protein"
              style={{ width: `${(nutrition.protein_g / totalMacros) * 100}%` }}
            />
          </div>
          <span className="macro-bar-val">{Math.round((nutrition.protein_g / totalMacros) * 100)}%</span>
        </div>
        <div className="macro-bar-item">
          <span className="macro-bar-label" style={{ color: '#a78bfa' }}>Carbs</span>
          <div className="macro-bar-track">
            <div
              className="macro-bar-fill fill-carbs"
              style={{ width: `${(nutrition.carbs_g / totalMacros) * 100}%` }}
            />
          </div>
          <span className="macro-bar-val">{Math.round((nutrition.carbs_g / totalMacros) * 100)}%</span>
        </div>
        <div className="macro-bar-item">
          <span className="macro-bar-label" style={{ color: '#fb923c' }}>Fat</span>
          <div className="macro-bar-track">
            <div
              className="macro-bar-fill fill-fat"
              style={{ width: `${(nutrition.fat_g / totalMacros) * 100}%` }}
            />
          </div>
          <span className="macro-bar-val">{Math.round((nutrition.fat_g / totalMacros) * 100)}%</span>
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────
   Main Page Component
────────────────────────────────────────── */
export default function HomePage() {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Real API call ── */
  const analyzeImage = useCallback(async (file: File) => {
    setLoading(true);
    setResult(null);

    // Hiển thị preview ảnh ngay lập tức
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://127.0.0.1:8000/analyze-food', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Lỗi từ server (${res.status}): ${errText}`);
      }

      const data: ApiResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định';
      alert(`❌ Không thể phân tích ảnh.\n\n${message}\n\nHãy chắc chắn backend đang chạy tại http://127.0.0.1:8000`);
      setPreviewUrl(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── File handlers ── */
  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh (JPG, PNG, WEBP)');
        return;
      }
      analyzeImage(file);
    },
    [analyzeImage],
  );

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
  };

  /* ── Render ── */
  return (
    <div className="page-container">
      {/* ── Hero ── */}
      <section className="hero-section" aria-labelledby="hero-title">
        <h1 className="hero-title" id="hero-title">
          Nhận Diện Món Ăn &amp;{' '}
          <span className="gradient-text">Phân Tích Dinh Dưỡng</span>
        </h1>
        <p className="hero-description">
          Tải lên ảnh bất kỳ món ăn nào — AI sẽ tự động nhận diện và cung cấp
          thông tin calo, protein, carbs &amp; chất béo chi tiết trong vài giây.
        </p>
      </section>

      {/* ── Upload Zone ── */}
      <section className="upload-section" aria-label="Upload food image">
        <div
          id="upload-zone"
          className={`upload-zone${dragging ? ' dragging' : ''}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={onKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Click or drag and drop a food image here to analyze"
        >
          <input
            ref={fileInputRef}
            id="file-upload-input"
            className="upload-input"
            type="file"
            accept="image/*"
            onChange={onFileInputChange}
            aria-label="Upload food image file"
          />
          <div className="upload-icon-wrap" aria-hidden="true">📸</div>
          <h2 className="upload-title">Tải ảnh món ăn lên</h2>
          <p className="upload-subtitle">Kéo thả hoặc nhấp để chọn ảnh</p>
          <button
            className="upload-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            aria-label="Browse files to upload"
          >
            <span aria-hidden="true">📂</span> Chọn File
          </button>
          <p className="upload-formats">Hỗ trợ: JPG, PNG, WEBP, GIF • Tối đa 20MB</p>
        </div>
      </section>

      {/* ── Loading Overlay ── */}
      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite" aria-label="Analyzing food image">
          <div className="loading-content">
            <div className="loading-spinner" aria-hidden="true" />
            <p className="loading-text">Đang phân tích ảnh...</p>
            <p className="loading-sub">AI đang nhận diện món ăn và tính dinh dưỡng</p>
          </div>
        </div>
      )}

      {/* ── Empty State: How it works + Features ── */}
      {!result && !loading && (
        <>
          {/* How it works */}
          <section className="how-it-works" aria-label="Cách sử dụng">
            <h2 className="section-label">🌿 Cách Hoạt Động</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-icon">📸</div>
                <h3 className="step-title">Chụp ảnh món ăn</h3>
                <p className="step-desc">Tải ảnh hoặc kéo thả vào ô phía trên. Hỗ trợ JPG, PNG, WEBP.</p>
              </div>
              <div className="step-arrow" aria-hidden="true">→</div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-icon">🧠</div>
                <h3 className="step-title">AI phân tích</h3>
                <p className="step-desc">Mô hình AI nhận diện món ăn và ước lượng khẩu phần chỉ trong vài giây.</p>
              </div>
              <div className="step-arrow" aria-hidden="true">→</div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-icon">📊</div>
                <h3 className="step-title">Xem dinh dưỡng</h3>
                <p className="step-desc">Nhận ngay thông tin calo, protein, carbs và chất béo chi tiết.</p>
              </div>
            </div>
          </section>

          {/* Feature cards */}
          <section className="features-row" aria-label="Tính năng">
            <h2 className="section-label">🌱 Tính Năng Nổi Bật</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon feature-icon-green">🔍</div>
                <h3 className="feature-title">Nhận diện chính xác</h3>
                <p className="feature-desc">Nhận biết hàng trăm loại món ăn Việt Nam và quốc tế với độ chính xác cao.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon feature-icon-orange">🔥</div>
                <h3 className="feature-title">Tính calo tức thì</h3>
                <p className="feature-desc">Ước lượng lượng calo của món ăn dựa trên khẩu phần được ước tính tự động.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon feature-icon-blue">💪</div>
                <h3 className="feature-title">Phân tích Macro</h3>
                <p className="feature-desc">Phân rõ protein, carbohydrate và chất béo giúp bạn cân bằng chế độ ăn.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon feature-icon-purple">⚖️</div>
                <h3 className="feature-title">Ưc lượng khẩu phần</h3>
                <p className="feature-desc">AI tự động ước tính trọng lượng (gram) của món ăn từ ảnh.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Results ── */}
      {result && (
        <section className="results-section" aria-label="Analysis results" aria-live="polite">

          {/* Card 1: Food image + label */}
          <article className="card" aria-labelledby="food-name-label">
            <div className="card-header">
              <div className="card-icon card-icon-green" aria-hidden="true">🍜</div>
              <div>
                <h2 className="card-title" id="food-name-label">Kết Quả Nhận Diện</h2>
                <p className="card-subtitle">Món ăn được phát hiện bởi AI</p>
              </div>
            </div>

            {previewUrl && (
              <div className="food-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={`Ảnh món ${formatFoodName(result.classifier_result.food)} đã tải lên`}
                  className="food-image"
                />
                <div className="food-image-overlay">
                  <div className="food-label">
                    {formatFoodName(result.classifier_result.food)}
                  </div>
                  <div className="food-label-sub">
                    Độ tự tin: {pct(result.classifier_result.confidence)}
                  </div>
                </div>
              </div>
            )}

            <ConfidenceBar
              label="Độ tự tin nhận diện"
              value={result.classifier_result.confidence}
            />
          </article>

          {/* Card 2: Top-3 predictions */}
          <article className="card" aria-labelledby="predictions-label">
            <div className="card-header">
              <div className="card-icon card-icon-cyan" aria-hidden="true">🔍</div>
              <div>
                <h2 className="card-title" id="predictions-label">Top 3 Dự Đoán</h2>
                <p className="card-subtitle">Các khả năng được xem xét bởi model</p>
              </div>
            </div>
            <PredictionList predictions={result.classifier_result.top_3} />

            <div style={{ marginTop: '1.5rem' }}>
              <ConfidenceBar
                label={formatFoodName(result.classifier_result.top_3[0]?.food ?? '')}
                value={result.classifier_result.top_3[0]?.confidence ?? 0}
                color="primary"
              />
              <ConfidenceBar
                label={formatFoodName(result.classifier_result.top_3[1]?.food ?? '')}
                value={result.classifier_result.top_3[1]?.confidence ?? 0}
                color="purple"
              />
              <ConfidenceBar
                label={formatFoodName(result.classifier_result.top_3[2]?.food ?? '')}
                value={result.classifier_result.top_3[2]?.confidence ?? 0}
                color="warm"
              />
            </div>
          </article>

          {/* Card 3: Nutrition (full width) */}
          <article className="card card-full" aria-labelledby="nutrition-label">
            <div className="card-header">
              <div className="card-icon card-icon-warm" aria-hidden="true">🔥</div>
              <div>
                <h2 className="card-title" id="nutrition-label">Thông Tin Dinh Dưỡng</h2>
                <p className="card-subtitle">
                  Phân tích chi tiết cho món{' '}
                  <strong className="text-gradient">
                    {formatFoodName(result.nutrition_result.food)}
                  </strong>
                </p>
              </div>
            </div>

            <CalorieDisplay nutrition={result.nutrition_result} />
          </article>
        </section>
      )}
    </div>
  );
}