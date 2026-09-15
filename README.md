# Git Worktree：一個 Repo，同時開好幾個工作現場

[![GitHub Pages](https://img.shields.io/badge/Live%20demo-GitHub%20Pages-181717?logo=github)](https://satanbaby.github.io/GitWorkTreeDemo/)

一份以繁體中文製作的互動式團隊分享，說明 Git Worktree 如何讓同一個 repository 同時保留多個可工作的 checkout，降低分支切換、stash 與重複 clone 的成本。

**[開啟線上簡報 →](https://satanbaby.github.io/GitWorkTreeDemo/)**

![Git Worktree 分享封面](presentation/public/illustrations/cover/bears-discussing-v2.png)

## 內容

- 為什麼 feature、hotfix、code review 與版本維護會造成上下文切換成本
- Worktree 的心智模型，以及它和重複 `git clone` 的差異
- 建立、查看、移除與維護 worktree 的常用 Git 指令
- 使用 VS Code Git Worktree Manager 擴充套件的流程
- Coding Agent 共用工作目錄的風險，以及「一個 task 一棵 worktree」的隔離做法
- Worktree 的限制、注意事項與適用時機

## 操作簡報

線上簡報採逐步敘事設計：點擊畫面或使用方向鍵前進；將游標移到畫面底部可顯示章節導覽。導覽列也提供章節跳轉、全螢幕與 PDF 匯出功能。

## 快速體驗 Git Worktree

```bash
# 查看目前的工作目錄
git worktree list

# 從 main 建立新的 hotfix 分支與工作目錄
git worktree add -b hotfix/payment-timeout ../project-hotfix main

# 在另一個資料夾同時處理 hotfix
cd ../project-hotfix

# 完成並確認變更已保存後，移除工作目錄
git worktree remove ../project-hotfix
```

移除 worktree 不會刪除 branch；確認分支已合併後，才另行執行 `git branch -d <branch>`。

## 在本機執行

需求：Node.js 24 與 [pnpm](https://pnpm.io/)。

```bash
cd presentation
pnpm install --frozen-lockfile
pnpm dev
```

開啟終端機顯示的本機網址（預設為 `http://localhost:5174`）。

常用指令：

```bash
# 建置正式版
pnpm build

# 預覽正式版
pnpm preview

# 從章節旁白產生音檔清單
pnpm extract-narrations
```

## 專案結構

```text
.
├─ article.md       # 分享內容與技術說明
├─ outline.md       # 簡報大綱與製作規劃
├─ script.md        # 分享講稿
├─ 素材/             # 原始截圖與素材
├─ presentation/    # React + Vite 互動式簡報
│  ├─ src/chapters/ # 各章節畫面與旁白
│  ├─ public/       # 圖片、截圖與主題資源
│  └─ scripts/      # 旁白擷取與 TTS 輔助工具
└─ .github/workflows/deploy-pages.yml
```

## 部署

推送至 `main` 後，GitHub Actions 會在 `presentation/` 安裝依賴、執行 `pnpm build`，並將 `presentation/dist` 部署至 GitHub Pages：

<https://satanbaby.github.io/GitWorkTreeDemo/>

## 參考資料

- [Git 官方文件：git worktree](https://git-scm.com/docs/git-worktree)
- [VS Code Git Worktree Manager](https://marketplace.visualstudio.com/items?itemName=jackiotyu.git-worktree-manager)
