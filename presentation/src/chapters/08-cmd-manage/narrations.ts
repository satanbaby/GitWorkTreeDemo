export const narrations = [
  "用完要收。這幾個指令一樣一個一個看。",
  "git worktree remove。移除之前先確認變更都提交或妥善保存了。有沒提交或沒追蹤的檔案，它會直接拒絕。",
  "注意，移除 worktree 不等於刪掉 branch。branch 要另外確認合併過，才用 git branch -d。",
  "git worktree move。要搬位置就用它，不要直接拖資料夾。",
  "git worktree repair。已經手動搬過的，用它修復關聯。",
  "git worktree prune。已經手動把資料夾刪掉的，用它清掉過期的管理資訊。",
  "git worktree lock，加上 reason。放在隨身碟或會離線的網路磁碟時，防止管理資訊被 prune 掉。",
];
