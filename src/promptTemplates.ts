export type TemplateFieldKey = "purpose" | "body" | "context" | "notes" | "outputFormat";

export type UsageTemplate = {
  id: string;
  name: string;
  fields: Record<TemplateFieldKey, string>;
};

export type ItemTemplate = {
  id: string;
  name: string;
  field: TemplateFieldKey;
  text: string;
};

export type ItemTemplateCategory = {
  id: string;
  name: string;
  templates: ItemTemplate[];
};

export const TEMPLATE_FIELD_LABELS: Record<TemplateFieldKey, string> = {
  purpose: "目的",
  body: "依頼",
  context: "前提情報",
  notes: "注意点",
  outputFormat: "出力形式",
};

export const USAGE_TEMPLATES: UsageTemplate[] = [
  {
    id: "web-app-improvement",
    name: "Webアプリ改善相談",
    fields: {
      purpose:
        "現在使っているWebアプリの改善案を整理したい。\nすぐに実装内容を決めるのではなく、使い方・困っていること・改善したいことを壁打ちしながら整理したい。",
      body:
        "以下の改善案・気になっていることをもとに、実装内容を決めつけず、まずは目的・使い方・画面・入力項目・保存方式・実装範囲を整理してください。\n\n【ここに改善案・気になっていることを記入】",
      context:
        "個人用Webアプリとして、自分が実際に使いながら少しずつ改善していく前提です。\n最初から完璧を目指すより、壊れにくく、使いやすく、あとから育てやすい形を重視しています。",
      notes:
        "いきなり実装案を決めつけないでください\nまずは壁打ちしながら整理してください\n小さく安全に進める方針は大事にしてください\nただし、何度も細かいやり取りするのは面倒なので、安全で無理のない範囲で関連改善はできるだけまとめて進めたいです\n既存データを壊さない前提で考えてください",
      outputFormat:
        "現状の理解\n改善したいことの整理\n実装候補\n今回まとめてよい範囲\n分けた方がよい範囲\n既存機能を壊さないための注意点\n確認したいこと",
    },
  },
  {
    id: "codex-implementation-request",
    name: "Codex実装依頼",
    fields: {
      purpose: "整理済みの改善案をもとに、Codexへ渡す実装依頼文を作成する。",
      body:
        "以下の改善内容をもとに、対象アプリのコード修正、動作確認、必要に応じた改善履歴ファイルへの追記まで行ってください。\n\n【ここに改善内容を記入】",
      context:
        "対象アプリは React / TypeScript / Vite で作成しています。\nPowerShellでは npm ではなく npm.cmd を使います。\n\n対象アプリ本体：\n\n【ここに対象アプリ本体フォルダパスを記入】\n\n資料フォルダ：\n\n【ここに資料フォルダパスを記入】\n\nよく使う確認コマンド：\n\nnpm.cmd install\nnpm.cmd run dev\nnpm.cmd run build",
      notes:
        "作業前に対象フォルダを確認してください\n既存機能を壊さないようにしてください\n既存データ形式をむやみに変更しないでください\nJSONバックアップや個人データをGitHubに入れないでください\n必要がない限り、大規模なリファクタリングはしないでください\n実装後、必要に応じて改善履歴ファイルへ追記してください\n変更したファイルと確認結果を最後に報告してください",
      outputFormat:
        "実施内容\n変更したファイル\n変更しなかった重要ファイル\n動作確認結果\n改善履歴への追記有無\n注意点\n次に確認してほしいこと",
    },
  },
  {
    id: "document-update-request",
    name: "資料追記依頼",
    fields: {
      purpose: "アプリ本体のコードは触らず、資料フォルダ内のMarkdownに相談内容や決定事項を追記する。",
      body:
        "以下の内容を、対象資料フォルダ内の適切なMarkdownファイルへ追記してください。\n新規ファイルを増やしすぎず、既存ファイルに追記できる場合は既存ファイルを優先してください。\n\n【ここに追記したい内容を記入】",
      context:
        "対象資料フォルダ：\n\n【ここに対象資料フォルダパスを記入】\n\n関連アプリ：\n\n【ここに関連アプリ名を記入】\n\n追記対象ファイル候補：\n\n【ここに追記対象ファイル名を記入】",
      notes:
        "アプリ本体のコードは触らないでください\n既存ファイルは勝手に削除しないでください\n既存ファイルは勝手に移動しないでください\n同名ファイルを上書きしないでください\n判断に迷う場合は、作業せず確認事項として報告してください\n追記したファイルと追記内容の概要を報告してください",
      outputFormat: "追記したファイル\n追記した内容の概要\n新規作成の有無\n触っていないファイル\n判断に迷った点",
    },
  },
  {
    id: "error-consultation",
    name: "エラー相談",
    fields: {
      purpose: "Webアプリ開発中に出たエラーの原因と直し方を整理したい。",
      body:
        "以下のエラーについて、何が起きているのか、原因候補、確認手順、試すコマンドを初心者向けに整理してください。\n\n【ここにエラー内容・スクショ内容・状況を記入】",
      context:
        "対象アプリ：\n\n【ここにアプリ名を記入】\n\n対象フォルダ：\n\n【ここに対象フォルダパスを記入】\n\n実行した操作：\n\n【ここに実行した操作を記入】\n\n実行したコマンド：\n\n【ここに実行したコマンドを記入】",
      notes:
        "いきなり大きく修正しないでください\nまず何が起きているかを説明してください\n原因候補を複数出してください\n初心者でも確認できる順番で説明してください\n必要な場合だけコード修正案を出してください\n既存データを消す操作は避けてください",
      outputFormat: "何が起きているか\n原因候補\nまず確認すること\n試すコマンド\n直らない場合に見せる情報\n必要な修正案",
    },
  },
  {
    id: "github-pages-check",
    name: "GitHub Pages公開確認",
    fields: {
      purpose: "GitHub Pagesで公開したWebアプリが正しく見られるか、公開前後の確認ポイントを整理したい。",
      body:
        "以下のWebアプリについて、GitHub Pages公開状態の確認ポイントと、問題があった場合の対応案を整理してください。\n\n【ここに確認したい内容を記入】",
      context:
        "アプリ名：\n\n【ここにアプリ名を記入】\n\nGitHubリポジトリURL：\n\n【ここにGitHubリポジトリURLを記入】\n\nGitHub Pages公開URL：\n\n【ここに公開URLを記入】\n\n対象フォルダ：\n\n【ここに対象フォルダパスを記入】",
      notes:
        "公開URLで画面が開けるか確認してください\nPCで確認することとスマホで確認することを分けてください\n個人情報や不要データがGitHubに入っていないか確認してください\nJSONバックアップや実データをGitHubに入れない前提で確認してください\nGitHub Actionsの失敗がある場合は、原因候補を整理してください",
      outputFormat:
        "公開URLで確認すること\nPCで確認すること\nスマホで確認すること\nGitHub側で確認すること\n個人情報・不要データの確認ポイント\n問題があった場合の対応案\n次にやること",
    },
  },
  {
    id: "sns-account-design",
    name: "SNSアカウント設計相談",
    fields: {
      purpose: "SNSアカウントの方向性、発信テーマ、投稿内容、プロフィール、運用方針を整理する。",
      body:
        "以下の内容をもとに、SNSアカウントの方向性、ターゲットペルソナ、発信者本人のキャラ、投稿カテゴリ、プロフィール文案を整理してください。\n\n【ここにSNSアカウントの目的・現状・迷っていることを記入】",
      context:
        "対象SNS：\n\n【ここにSNS名を記入】\n\n現在のアカウント状況：\n\n【ここに現在の状況を記入】\n\n発信したいテーマ：\n\n【ここに発信したいテーマを記入】\n\n悩んでいること：\n\n【ここに悩んでいることを記入】",
      notes:
        "いきなり正解を決めつけないでください\n続けやすさを重視してください\n自分のキャラと見る人の期待の両方を整理してください\nバズだけを狙いすぎないでください\n無理に尖らせすぎないでください",
      outputFormat:
        "現状の理解\nアカウントの方向性案\nターゲットペルソナ\n発信者本人のキャラ案\n発信テーマ\n投稿カテゴリ\nプロフィール文案\n投稿例\n続けやすくする工夫\n確認したいこと",
    },
  },
  {
    id: "roadmap-consultation",
    name: "やりたいことの行動整理・ロードマップ相談",
    fields: {
      purpose: "やりたいことや気になっていることを、具体的な行動や進め方に整理する。",
      body:
        "以下のやりたいこと・気になっていること・迷っていることを、具体的な行動とロードマップに整理してください。\n\n【ここにやりたいこと・気になっていること・迷っていることを記入】",
      context:
        "現在の状況：\n\n【ここに現在の状況を記入】\n\n使える時間・環境：\n\n【ここに使える時間や環境を記入】\n\n気になっている制約：\n\n【ここに制約や不安を記入】",
      notes:
        "いきなり完璧な計画にしないでください\n最初の一歩を小さくしてください\n優先度を整理してください\n後で考えればよいことは後回しにしてください\n行動しやすい形にしてください",
      outputFormat:
        "現状の理解\nやりたいことの整理\n目的\n課題・引っかかっていること\n優先度\n最初の一歩\n1週間以内にできること\n1か月以内にできること\n後で考えること\n確認したいこと",
    },
  },
  {
    id: "note-article-request",
    name: "note記事作成依頼",
    fields: {
      purpose:
        "自分の出来事、感じたこと、考えたことをもとに、note記事として読める形に整理する。\n読者に役立つノウハウ記事に寄せすぎるより、出来事や感情の流れを残しながら、読者にも共感や余韻が届く文章にする。",
      body:
        "以下の出来事・感じたこと・考えたこと・入れたい要素をもとに、note記事の構成案と本文案を作ってください。\n\n【ここに出来事・感じたこと・考えたこと・入れたい要素を記入】",
      context:
        "この記事で残したいこと：\n\n【ここに残したいことを記入】\n\n読者に伝わるとよい感情：\n\n【ここに読者に伝えたい感情を記入】\n\n記事の雰囲気：\n\n【ここに記事の雰囲気を記入】",
      notes:
        "重視すること：\n\n出来事と感情を自然に残すこと\n読者の感情が動くこと\n共感されること\n読後に余韻が残ること\n自分の記録でありつつ、読者にも届くこと\n広く読まれる可能性のあるタイトル・導入に整えること\n\n今は重視しないこと：\n\n収益化\nセールス\n課題解決型の記事\n読者に特定の行動を強く促す文章\nSEO対策\nバズだけを狙う構成",
      outputFormat: "タイトル案\n記事の構成案\n本文案\nもっと自分らしくするための確認質問",
    },
  },
];

export const ITEM_TEMPLATE_CATEGORIES: ItemTemplateCategory[] = [
  {
    id: "purpose",
    name: "目的テンプレ",
    templates: [
      {
        id: "purpose-web-app-improvement",
        name: "Webアプリの改善案を整理したい",
        field: "purpose",
        text: "Webアプリの改善案を整理したい。",
      },
      {
        id: "purpose-codex-request",
        name: "Codexに渡す実装依頼文を作りたい",
        field: "purpose",
        text: "Codexに渡す実装依頼文を作りたい。",
      },
      {
        id: "purpose-document-record",
        name: "資料フォルダに決定事項を残したい",
        field: "purpose",
        text: "資料フォルダに相談内容や決定事項を残したい。",
      },
      {
        id: "purpose-error",
        name: "エラーの原因と対応を整理したい",
        field: "purpose",
        text: "エラーの原因と対応を整理したい。",
      },
      {
        id: "purpose-sns",
        name: "SNSアカウントの方向性を整理したい",
        field: "purpose",
        text: "SNSアカウントの方向性を整理したい。",
      },
      {
        id: "purpose-roadmap",
        name: "やりたいことを具体的な行動に落とし込みたい",
        field: "purpose",
        text: "やりたいことを具体的な行動に落とし込みたい。",
      },
      {
        id: "purpose-note",
        name: "note記事として読める形に整理したい",
        field: "purpose",
        text: "出来事や感じたことを、note記事として読める形に整理したい。",
      },
    ],
  },
  {
    id: "request",
    name: "依頼文テンプレ",
    templates: [
      {
        id: "request-wall",
        name: "壁打ち・整理してほしい",
        field: "body",
        text: "以下の内容について、いきなり結論を決めず、まずは目的・背景・使い方・選択肢を壁打ちしながら整理してください。\n\n【ここに相談したい内容を記入】",
      },
      {
        id: "request-improvement",
        name: "改善案を整理してほしい",
        field: "body",
        text: "以下の改善案について、今回実装する範囲、後回しにする範囲、既存機能を壊さないための注意点を整理してください。\n\n【ここに改善案を記入】",
      },
      {
        id: "request-codex",
        name: "実装依頼文を作ってほしい",
        field: "body",
        text: "以下の改善内容をもとに、Codexへ渡す実装依頼文を作成してください。\n\n【ここに改善内容を記入】",
      },
      {
        id: "request-document",
        name: "資料に追記してほしい",
        field: "body",
        text: "以下の内容を、対象資料フォルダ内の適切なMarkdownファイルへ追記してください。\n\n【ここに追記したい内容を記入】",
      },
      {
        id: "request-error",
        name: "エラー原因を整理してほしい",
        field: "body",
        text: "以下のエラーについて、何が起きているか、原因候補、確認手順、試すコマンドを整理してください。\n\n【ここにエラー内容を記入】",
      },
      {
        id: "request-pages",
        name: "公開状態を確認してほしい",
        field: "body",
        text: "以下のWebアプリについて、GitHub Pages公開状態、PC確認、スマホ確認、個人情報や不要データの確認ポイントを整理してください。\n\n【ここに確認したい内容を記入】",
      },
      {
        id: "request-sns",
        name: "SNSアカウント設計を整理してほしい",
        field: "body",
        text: "以下の内容をもとに、SNSアカウントの方向性、ターゲットペルソナ、発信者本人のキャラ、投稿カテゴリ、プロフィール文案を整理してください。\n\n【ここにSNSアカウントの相談内容を記入】",
      },
      {
        id: "request-roadmap",
        name: "行動とロードマップに整理してほしい",
        field: "body",
        text: "以下のやりたいことを、最初の一歩、1週間以内にできること、1か月以内にできること、後で考えることに分けて整理してください。\n\n【ここにやりたいことを記入】",
      },
      {
        id: "request-note",
        name: "note記事を作ってほしい",
        field: "body",
        text: "以下の出来事・感じたこと・考えたことをもとに、note記事のタイトル案、構成案、本文案を作ってください。\n\n【ここに出来事・感情・入れたい要素を記入】",
      },
    ],
  },
  {
    id: "context",
    name: "前提情報テンプレ",
    templates: [
      {
        id: "context-react-vite",
        name: "React / TypeScript / Vite",
        field: "context",
        text: "React / TypeScript / Vite で作成しています。",
      },
      {
        id: "context-powershell-npm-cmd",
        name: "PowerShellでは npm.cmd",
        field: "context",
        text: "PowerShellでは npm ではなく npm.cmd を使います。",
      },
      {
        id: "context-personal-app",
        name: "個人用Webアプリ",
        field: "context",
        text: "個人用Webアプリとして、自分が実際に使いながら少しずつ改善していく前提です。",
      },
      {
        id: "context-github-pages",
        name: "GitHub Pages公開",
        field: "context",
        text: "GitHub Pagesで公開しています。",
      },
      {
        id: "context-local-storage",
        name: "localStorage保存",
        field: "context",
        text: "データはlocalStorageに保存しています。",
      },
      {
        id: "context-json-backup",
        name: "JSONバックアップ",
        field: "context",
        text: "JSONエクスポート / JSONインポートでバックアップできる前提です。",
      },
      {
        id: "context-folder-placeholder",
        name: "対象フォルダ記入欄",
        field: "context",
        text: "対象フォルダ：\n\n【ここに対象フォルダパスを記入】",
      },
    ],
  },
  {
    id: "notes",
    name: "注意点テンプレ",
    templates: [
      {
        id: "notes-no-break",
        name: "既存機能を壊さない",
        field: "notes",
        text: "既存機能を壊さないでください。",
      },
      {
        id: "notes-data-format",
        name: "既存データ形式を変更しない",
        field: "notes",
        text: "既存データ形式を変更しないでください。",
      },
      {
        id: "notes-no-secrets",
        name: "個人情報やAPIキーを含めない",
        field: "notes",
        text: "個人情報やAPIキーを含めないでください。",
      },
      {
        id: "notes-json-github",
        name: "JSONバックアップをGitHubに入れない",
        field: "notes",
        text: "JSONバックアップをGitHubに入れないでください。",
      },
      {
        id: "notes-small-safe",
        name: "小さく安全に進める",
        field: "notes",
        text: "まずは小さく安全に進めてください。",
      },
      {
        id: "notes-no-large-refactor",
        name: "大規模リファクタリングを避ける",
        field: "notes",
        text: "必要がない限り、大規模なリファクタリングは避けてください。",
      },
      {
        id: "notes-report-if-unsure",
        name: "判断に迷う場合は報告",
        field: "notes",
        text: "判断に迷う場合は作業せず報告してください。",
      },
    ],
  },
  {
    id: "output-format",
    name: "出力形式テンプレ",
    templates: [
      {
        id: "output-basic-work",
        name: "実施内容と確認結果",
        field: "outputFormat",
        text: "実施内容\n変更したファイル\n動作確認結果\n注意点\n次にやること",
      },
      {
        id: "output-consultation",
        name: "整理相談",
        field: "outputFormat",
        text: "現状の理解\n整理した内容\n選択肢\nおすすめの進め方\n確認したいこと",
      },
      {
        id: "output-review",
        name: "確認・レビュー",
        field: "outputFormat",
        text: "確認したこと\n問題なかったこと\n気になったこと\n対応案\n次に確認すること",
      },
      {
        id: "output-error",
        name: "エラー整理",
        field: "outputFormat",
        text: "何が起きているか\n原因候補\nまず確認すること\n試すコマンド\n直らない場合に見せる情報\n必要な修正案",
      },
    ],
  },
  {
    id: "hearing",
    name: "ヒアリング依頼テンプレ",
    templates: [
      {
        id: "hearing-before-implementation",
        name: "実装前に確認",
        field: "notes",
        text: "不明点があれば、実装前に確認してください。",
      },
      {
        id: "hearing-multiple-options",
        name: "複数案を出して確認",
        field: "notes",
        text: "仕様が曖昧な部分は、複数案を出してから確認してください。",
      },
      {
        id: "hearing-dont-decide",
        name: "勝手に決めず確認",
        field: "notes",
        text: "判断に迷う場合は、勝手に決めず確認してください。",
      },
      {
        id: "hearing-with-reason",
        name: "質問理由も添える",
        field: "notes",
        text: "質問するときは、その質問をする理由も添えてください。",
      },
    ],
  },
  {
    id: "data-protection",
    name: "データ保護・公開注意テンプレ",
    templates: [
      {
        id: "data-json-private",
        name: "JSONバックアップは個人データ",
        field: "notes",
        text: "JSONバックアップや実データは個人データとして扱ってください。",
      },
      {
        id: "data-no-public-folder",
        name: "公開場所に個人データを置かない",
        field: "notes",
        text: "GitHub、publicフォルダ、SNS、共有Driveに個人データを置かないでください。",
      },
      {
        id: "data-no-secrets",
        name: "機密情報を含めない",
        field: "notes",
        text: "APIキー、パスワード、個人情報、会社の機密情報を含めないでください。",
      },
      {
        id: "data-pages-safe-template",
        name: "公開前提の固定テンプレ",
        field: "notes",
        text: "GitHub Pagesで公開される可能性があるため、テンプレ内に具体的すぎる個人情報やローカルパスを固定しないでください。",
      },
      {
        id: "data-folder-placeholder",
        name: "フォルダは記入欄方式",
        field: "context",
        text: "対象フォルダや資料フォルダは【ここに対象フォルダパスを記入】のような記入欄方式にしてください。",
      },
    ],
  },
];

export const ITEM_TEMPLATES = ITEM_TEMPLATE_CATEGORIES.flatMap((category) =>
  category.templates.map((template) => ({ ...template, categoryName: category.name })),
);
