# Juyoung Seo · Homepage

## 배포
1. GitHub에서 `아이디.github.io` 이름으로 Public 저장소를 만듭니다.
2. 이 폴더 안의 파일과 폴더(index.html, assets, images, LICENSE, README.md)를 저장소에 끌어다 놓고 Commit changes.
3. Settings → Pages → Source: Deploy from a branch, Branch: main / (root) → Save.
4. 1~3분 뒤 https://아이디.github.io 에서 확인합니다.

## 수정
- 내용은 전부 `index.html` 하나에 있습니다. GitHub에서 연필 아이콘으로 고치고 Commit 하면 반영됩니다.
- 색과 배치는 `assets/style.css` 맨 위 `:root` 줄(라이트)과 `html[data-theme=dark]` 줄(다크)에서 바꿉니다.
- 논문 그림은 `images/`에 올리고, 해당 논문의 `paper-visual paper-visual--text` 블록을
  `<div class="paper-visual"><img src="images/파일명.png" alt="설명"></div>` 로 바꿉니다.

## 출처
Design adapted from Hyunjae Ra's homepage (rahyunjae.github.io), based on AcadHomepage (MIT License).
