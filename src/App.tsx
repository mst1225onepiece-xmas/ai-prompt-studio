import {
  Copy,
  Download,
  Edit3,
  FileText,
  List,
  Plus,
  Search,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "yuki-ai-prompt-studio-data";
const TARGET_AIS = ["ChatGPT", "Codex", "その他"] as const;
const CATEGORIES = ["アプリ開発", "資料整理", "エラー調査", "文章作成", "生活", "その他"] as const;
const RATINGS = [
  { label: "未評価", value: "" },
  { label: "★1", value: "1" },
  { label: "★2", value: "2" },
  { label: "★3", value: "3" },
  { label: "★4", value: "4" },
  { label: "★5", value: "5" },
] as const;

type TargetAi = (typeof TARGET_AIS)[number];
type Category = (typeof CATEGORIES)[number];
type Rating = null | 1 | 2 | 3 | 4 | 5;
type View = "create" | "list" | "settings";
type SortKey = "updatedAt" | "createdAt" | "rating";

type PromptItem = {
  id: string;
  title: string;
  targetAi: TargetAi;
  category: Category;
  purpose: string;
  context: string;
  body: string;
  outputFormat: string;
  notes: string;
  resultMemo: string;
  rating: Rating;
  nextImproveMemo: string;
  createdAt: string;
  updatedAt: string;
};

type AppData = {
  prompts: PromptItem[];
  settings: {
    version: 1;
  };
};

type PromptDraft = Omit<PromptItem, "id" | "createdAt" | "updatedAt">;

const emptyDraft: PromptDraft = {
  title: "",
  targetAi: "ChatGPT",
  category: "アプリ開発",
  purpose: "",
  context: "",
  body: "",
  outputFormat: "",
  notes: "",
  resultMemo: "",
  rating: null,
  nextImproveMemo: "",
};

const initialData: AppData = {
  prompts: [],
  settings: {
    version: 1,
  },
};

function isTargetAi(value: unknown): value is TargetAi {
  return typeof value === "string" && TARGET_AIS.includes(value as TargetAi);
}

function isCategory(value: unknown): value is Category {
  return typeof value === "string" && CATEGORIES.includes(value as Category);
}

function isRating(value: unknown): value is Rating {
  return value === null || value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

function normalizeImportedPrompt(value: unknown): PromptItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (
    typeof item.id !== "string" ||
    typeof item.title !== "string" ||
    !isTargetAi(item.targetAi) ||
    !isCategory(item.category) ||
    typeof item.body !== "string"
  ) {
    return null;
  }

  return {
    id: item.id,
    title: item.title,
    targetAi: item.targetAi,
    category: item.category,
    purpose: typeof item.purpose === "string" ? item.purpose : "",
    context: typeof item.context === "string" ? item.context : "",
    body: item.body,
    outputFormat: typeof item.outputFormat === "string" ? item.outputFormat : "",
    notes: typeof item.notes === "string" ? item.notes : "",
    resultMemo: typeof item.resultMemo === "string" ? item.resultMemo : "",
    rating: isRating(item.rating) ? item.rating : null,
    nextImproveMemo: typeof item.nextImproveMemo === "string" ? item.nextImproveMemo : "",
    createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : new Date().toISOString(),
  };
}

function loadData(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialData;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return initialData;
    const data = parsed as Record<string, unknown>;
    if (!Array.isArray(data.prompts)) return initialData;

    return {
      prompts: data.prompts.map(normalizeImportedPrompt).filter((item): item is PromptItem => Boolean(item)),
      settings: { version: 1 },
    };
  } catch {
    return initialData;
  }
}

function ratingLabel(rating: Rating) {
  return rating === null ? "未評価" : `★${rating}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function makeWholePromptText(prompt: PromptDraft | PromptItem) {
  const sections = [
    ["# ", prompt.title],
    ["## 対象AI\n\n", prompt.targetAi],
    ["## カテゴリ\n\n", prompt.category],
    ["## 目的\n\n", prompt.purpose],
    ["## 前提情報\n\n", prompt.context],
    ["## 依頼本文\n\n", prompt.body],
    ["## 出力形式\n\n", prompt.outputFormat],
    ["## 注意点\n\n", prompt.notes],
  ];

  return sections
    .filter(([, value]) => String(value).trim().length > 0)
    .map(([heading, value], index) => (index === 0 ? `${heading}${value}` : `${heading}${value}`))
    .join("\n\n");
}

function App() {
  const [activeView, setActiveView] = useState<View>("create");
  const [data, setData] = useState<AppData>(() => loadData());
  const [draft, setDraft] = useState<PromptDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [query, setQuery] = useState("");
  const [aiFilter, setAiFilter] = useState("すべて");
  const [categoryFilter, setCategoryFilter] = useState("すべて");
  const [ratingFilter, setRatingFilter] = useState("すべて");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selectedPrompt = useMemo(
    () => data.prompts.find((prompt) => prompt.id === selectedId) ?? null,
    [data.prompts, selectedId],
  );

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const searchFields: (keyof PromptItem)[] = [
      "title",
      "purpose",
      "context",
      "body",
      "outputFormat",
      "notes",
      "resultMemo",
      "nextImproveMemo",
    ];

    return [...data.prompts]
      .filter((prompt) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          searchFields.some((field) => String(prompt[field]).toLowerCase().includes(normalizedQuery));
        const matchesAi = aiFilter === "すべて" || prompt.targetAi === aiFilter;
        const matchesCategory = categoryFilter === "すべて" || prompt.category === categoryFilter;
        const matchesRating =
          ratingFilter === "すべて" ||
          (ratingFilter === "未評価" ? prompt.rating === null : prompt.rating === Number(ratingFilter.replace("★", "")));

        return matchesQuery && matchesAi && matchesCategory && matchesRating;
      })
      .sort((a, b) => {
        if (sortKey === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
        return new Date(b[sortKey]).getTime() - new Date(a[sortKey]).getTime();
      });
  }, [aiFilter, categoryFilter, data.prompts, query, ratingFilter, sortKey]);

  function updateDraft<K extends keyof PromptDraft>(key: K, value: PromptDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function copyText(text: string, label: string) {
    if (!text.trim()) {
      setToast("コピーする内容がありません");
      return;
    }
    await navigator.clipboard.writeText(text);
    setToast(`${label}をコピーしました`);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.targetAi || !draft.category || !draft.body.trim()) {
      setToast("必須項目を入力してください");
      return;
    }

    const now = new Date().toISOString();
    if (editingId) {
      setData((current) => ({
        ...current,
        prompts: current.prompts.map((prompt) =>
          prompt.id === editingId
            ? {
                ...prompt,
                ...draft,
                title: draft.title.trim(),
                body: draft.body.trim(),
                updatedAt: now,
              }
            : prompt,
        ),
      }));
      setToast("プロンプトを更新しました");
      setEditingId(null);
      setActiveView("list");
    } else {
      const prompt: PromptItem = {
        ...draft,
        id: crypto.randomUUID(),
        title: draft.title.trim(),
        body: draft.body.trim(),
        createdAt: now,
        updatedAt: now,
      };
      setData((current) => ({ ...current, prompts: [prompt, ...current.prompts] }));
      setToast("プロンプトを保存しました");
    }

    setDraft(emptyDraft);
  }

  function startEdit(prompt: PromptItem) {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...nextDraft } = prompt;
    setDraft(nextDraft);
    setEditingId(prompt.id);
    setSelectedId(null);
    setActiveView("create");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyDraft);
    setToast("編集をキャンセルしました");
  }

  function deletePrompt(prompt: PromptItem) {
    const confirmed = window.confirm("このプロンプトを削除しますか？\nこの操作は元に戻せません。");
    if (!confirmed) return;
    setData((current) => ({
      ...current,
      prompts: current.prompts.filter((item) => item.id !== prompt.id),
    }));
    if (selectedId === prompt.id) setSelectedId(null);
    if (editingId === prompt.id) cancelEdit();
    setToast("プロンプトを削除しました");
  }

  function exportJson() {
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-prompt-studio-backup-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setToast("JSONをエクスポートしました");
  }

  function importJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const confirmed = window.confirm(
      "現在のデータをインポートしたJSONで置き換えます。\n事前にJSONエクスポートでバックアップすることをおすすめします。\n続行しますか？",
    );
    if (!confirmed) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as unknown;
        if (!parsed || typeof parsed !== "object") throw new Error("JSONの形式が正しくありません");
        const imported = parsed as Record<string, unknown>;
        if (!Array.isArray(imported.prompts)) throw new Error("prompts が配列ではありません");
        const prompts = imported.prompts.map(normalizeImportedPrompt);
        if (prompts.some((prompt) => prompt === null)) {
          throw new Error("必須項目 id, title, targetAi, category, body が不足しているデータがあります");
        }
        setData({ prompts: prompts as PromptItem[], settings: { version: 1 } });
        setSelectedId(null);
        setEditingId(null);
        setDraft(emptyDraft);
        setToast("JSONをインポートしました");
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "JSONを読み込めませんでした");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Personal Prompt Library</p>
          <h1>AIプロンプト工房</h1>
        </div>
        <div className="stat-pill">
          <FileText size={18} />
          {data.prompts.length}件
        </div>
      </header>

      <main className="main-panel">
        {activeView === "create" && (
          <section className="screen">
            <div className="section-title">
              <div>
                <h2>{editingId ? "プロンプトを編集" : "プロンプトを作成"}</h2>
                <p>ChatGPTやCodexに渡す依頼文を、あとで探しやすい形で保存します。</p>
              </div>
              {editingId && (
                <button className="ghost-button" type="button" onClick={cancelEdit}>
                  <X size={18} />
                  編集をやめる
                </button>
              )}
            </div>

            <form className="prompt-form" onSubmit={handleSave}>
              <div className="grid two">
                <Field label="プロンプト名" required>
                  <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} />
                </Field>
                <Field label="対象AI" required>
                  <select value={draft.targetAi} onChange={(event) => updateDraft("targetAi", event.target.value as TargetAi)}>
                    {TARGET_AIS.map((ai) => (
                      <option key={ai}>{ai}</option>
                    ))}
                  </select>
                </Field>
                <Field label="カテゴリ" required>
                  <select value={draft.category} onChange={(event) => updateDraft("category", event.target.value as Category)}>
                    {CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </Field>
                <Field label="うまくいった度">
                  <select
                    value={draft.rating ?? ""}
                    onChange={(event) =>
                      updateDraft("rating", event.target.value === "" ? null : (Number(event.target.value) as Rating))
                    }
                  >
                    {RATINGS.map((rating) => (
                      <option key={rating.label} value={rating.value}>
                        {rating.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="目的">
                <textarea rows={3} value={draft.purpose} onChange={(event) => updateDraft("purpose", event.target.value)} />
              </Field>
              <Field label="前提情報">
                <textarea rows={5} value={draft.context} onChange={(event) => updateDraft("context", event.target.value)} />
              </Field>
              <Field label="依頼本文" required>
                <textarea rows={9} value={draft.body} onChange={(event) => updateDraft("body", event.target.value)} />
              </Field>
              <div className="grid two">
                <Field label="出力形式">
                  <textarea
                    rows={4}
                    value={draft.outputFormat}
                    onChange={(event) => updateDraft("outputFormat", event.target.value)}
                  />
                </Field>
                <Field label="注意点">
                  <textarea rows={4} value={draft.notes} onChange={(event) => updateDraft("notes", event.target.value)} />
                </Field>
              </div>
              <div className="grid two">
                <Field label="実行結果メモ">
                  <textarea
                    rows={4}
                    value={draft.resultMemo}
                    onChange={(event) => updateDraft("resultMemo", event.target.value)}
                  />
                </Field>
                <Field label="次回改善メモ">
                  <textarea
                    rows={4}
                    value={draft.nextImproveMemo}
                    onChange={(event) => updateDraft("nextImproveMemo", event.target.value)}
                  />
                </Field>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => copyText(draft.body, "依頼本文")}>
                  <Copy size={18} />
                  依頼本文をコピー
                </button>
                <button type="button" className="secondary-button" onClick={() => copyText(makeWholePromptText(draft), "全体")}>
                  <Copy size={18} />
                  全体コピー
                </button>
                <button type="submit" className="primary-button">
                  <Plus size={18} />
                  {editingId ? "編集内容を保存" : "入力内容を保存"}
                </button>
              </div>
            </form>
          </section>
        )}

        {activeView === "list" && (
          <section className="screen">
            <div className="section-title">
              <div>
                <h2>一覧</h2>
                <p>保存済みプロンプトを検索して、必要な依頼文をすぐ再利用できます。</p>
              </div>
            </div>

            <div className="filters">
              <label className="search-box">
                <Search size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="プロンプト名、目的、依頼本文などで検索"
                />
              </label>
              <select value={aiFilter} onChange={(event) => setAiFilter(event.target.value)}>
                <option>すべて</option>
                {TARGET_AIS.map((ai) => (
                  <option key={ai}>{ai}</option>
                ))}
              </select>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                <option>すべて</option>
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <select value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}>
                <option>すべて</option>
                {RATINGS.map((rating) => (
                  <option key={rating.label}>{rating.label}</option>
                ))}
              </select>
              <select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
                <option value="updatedAt">更新日が新しい順</option>
                <option value="createdAt">作成日が新しい順</option>
                <option value="rating">うまくいった度が高い順</option>
              </select>
            </div>

            {filteredPrompts.length === 0 ? (
              <div className="empty-state">条件に合うプロンプトはまだありません。</div>
            ) : (
              <div className="card-grid">
                {filteredPrompts.map((prompt) => (
                  <article className="prompt-card" key={prompt.id}>
                    <div className="card-head">
                      <h3>{prompt.title}</h3>
                      <span>{ratingLabel(prompt.rating)}</span>
                    </div>
                    <div className="meta-row">
                      <span>{prompt.targetAi}</span>
                      <span>{prompt.category}</span>
                    </div>
                    <p className="purpose">{prompt.purpose || "目的は未入力です。"}</p>
                    <p className="date-text">更新日: {formatDate(prompt.updatedAt)}</p>
                    <div className="card-actions">
                      <button type="button" onClick={() => setSelectedId(prompt.id)}>
                        詳細
                      </button>
                      <button type="button" onClick={() => copyText(prompt.body, "依頼本文")}>
                        <Copy size={16} />
                        依頼本文
                      </button>
                      <button type="button" onClick={() => startEdit(prompt)}>
                        <Edit3 size={16} />
                        編集
                      </button>
                      <button type="button" className="danger" onClick={() => deletePrompt(prompt)}>
                        <Trash2 size={16} />
                        削除
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeView === "settings" && (
          <section className="screen settings-screen">
            <div className="section-title">
              <div>
                <h2>設定</h2>
                <p>ブラウザ内に保存したデータを、JSONでバックアップ・移行できます。</p>
              </div>
            </div>

            <div className="settings-layout">
              <div className="info-panel">
                <h3>データ管理</h3>
                <dl>
                  <div>
                    <dt>保存済みプロンプト件数</dt>
                    <dd>{data.prompts.length}件</dd>
                  </div>
                  <div>
                    <dt>localStorageキー</dt>
                    <dd>{STORAGE_KEY}</dd>
                  </div>
                </dl>
                <div className="settings-actions">
                  <button type="button" className="primary-button" onClick={exportJson}>
                    <Download size={18} />
                    JSONエクスポート
                  </button>
                  <button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={18} />
                    JSONインポート
                  </button>
                  <input ref={fileInputRef} className="hidden-input" type="file" accept="application/json" onChange={importJson} />
                </div>
              </div>

              <div className="info-panel warning-panel">
                <h3>公開時の注意</h3>
                <p>このアプリはGitHub Pagesで公開できます。ただし、保存したプロンプトデータは各ブラウザ内に保存されます。</p>
                <p>
                  JSONエクスポートしたファイルには、依頼文や個人メモが含まれる可能性があります。GitHubリポジトリ、publicフォルダ、SNS、共有フォルダには置かないでください。
                </p>
                <h4>GitHubに入れないもの</h4>
                <ul>
                  <li>JSONバックアップ</li>
                  <li>実際のプロンプトデータ</li>
                  <li>個人情報</li>
                  <li>APIキー</li>
                  <li>パスワード</li>
                  <li>.envファイル</li>
                  <li>会社の機密情報</li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>

      {selectedPrompt && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedId(null)}>
          <section className="detail-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="modal-title">
              <div>
                <p className="eyebrow">Prompt Detail</p>
                <h2>{selectedPrompt.title}</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setSelectedId(null)} aria-label="閉じる">
                <X size={20} />
              </button>
            </div>
            <div className="detail-grid">
              <Detail label="対象AI" value={selectedPrompt.targetAi} />
              <Detail label="カテゴリ" value={selectedPrompt.category} />
              <Detail label="うまくいった度" value={ratingLabel(selectedPrompt.rating)} />
              <Detail label="目的" value={selectedPrompt.purpose} wide />
              <Detail label="前提情報" value={selectedPrompt.context} wide />
              <Detail label="依頼本文" value={selectedPrompt.body} wide />
              <Detail label="出力形式" value={selectedPrompt.outputFormat} wide />
              <Detail label="注意点" value={selectedPrompt.notes} wide />
              <Detail label="実行結果メモ" value={selectedPrompt.resultMemo} wide />
              <Detail label="次回改善メモ" value={selectedPrompt.nextImproveMemo} wide />
              <Detail label="作成日" value={formatDate(selectedPrompt.createdAt)} />
              <Detail label="更新日" value={formatDate(selectedPrompt.updatedAt)} />
            </div>
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => copyText(selectedPrompt.body, "依頼本文")}>
                <Copy size={18} />
                依頼本文をコピー
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => copyText(makeWholePromptText(selectedPrompt), "全体")}
              >
                <Copy size={18} />
                全体コピー
              </button>
              <button type="button" className="secondary-button" onClick={() => startEdit(selectedPrompt)}>
                <Edit3 size={18} />
                編集
              </button>
              <button type="button" className="danger-button" onClick={() => deletePrompt(selectedPrompt)}>
                <Trash2 size={18} />
                削除
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}

      <nav className="bottom-nav" aria-label="画面切り替え">
        <button className={activeView === "create" ? "active" : ""} type="button" onClick={() => setActiveView("create")}>
          <Plus size={20} />
          作成
        </button>
        <button className={activeView === "list" ? "active" : ""} type="button" onClick={() => setActiveView("list")}>
          <List size={20} />
          一覧
        </button>
        <button className={activeView === "settings" ? "active" : ""} type="button" onClick={() => setActiveView("settings")}>
          <Settings size={20} />
          設定
        </button>
      </nav>
    </div>
  );
}

function Field({ children, label, required = false }: { children: React.ReactNode; label: string; required?: boolean }) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <em>必須</em>}
      </span>
      {children}
    </label>
  );
}

function Detail({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "detail-item wide" : "detail-item"}>
      <dt>{label}</dt>
      <dd>{value || "未入力"}</dd>
    </div>
  );
}

export default App;
