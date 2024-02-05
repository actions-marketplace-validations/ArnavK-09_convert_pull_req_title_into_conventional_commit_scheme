# ✨ Convert Pull Req Title Into Conventional Commit Scheme!

> [!NOTE]  
> The [**`convert_pull_req_title_into_conventional_commit_scheme`**](https://github.com/ArnavK-09/convert_pull_req_title_into_conventional_commit_scheme) project is a public **GitHub Action** available in the GitHub Marketplace. By utilizing this action, users can automatically **convert new pull request titles into the conventional commits format** as defined by [conventionalcommits.org](https://www.conventionalcommits.org/).
>
> This project is powered by the **Google Gemini Pro API**, which enables seamless integration and efficient conversion of pull request titles into conventional format messages.

---

## 📐 Setup Guide

> **To set up the `convert_pull_req_title_into_conventional_commit_scheme` action, follow these steps:**

### 1. 🔆**Action Setup**

- Visit the [GitHub Marketplace page](https://github.com/marketplace/actions/convert-pull-req-title-into-conventional-commit-scheme) for the action.
- Click on the "Set up a workflow" button.
- Choose the repository where you want to use the action.
- Create a new workflow file (e.g., `.github/workflows/convert-pull-request-title.yml`).
- **Add the following code to the workflow file:**

```yaml
name: Convert Pull Req Title Into Conventional Commit Scheme!

on:
  pull_request:
    types: ['opened']

jobs:
  convert:
    runs-on: ubuntu-latest
    permissions: 
      pull-requests: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Convert Pull Request Title into Conventional Commit Scheme
        uses: ArnavK-09/convert_pull_req_title_into_conventional_commit_scheme@main
        with:
          gemini_api_key: ${{ secrets.GEMINI_API_KEY }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

### 2. 🔅 **Action Inputs**

| Input Name       | Description                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `gemini_api_key` | The API key for accessing the Google Gemini LLM API.                                                            |
| `token`          | The GitHub token for authentication and authorization. Use `${{ secrets.GITHUB_TOKEN }}` to access it securely. |
| `include_emoji`  | Set this to `true` if you want to include emojis in starting of converted commit prTitle title.                 |

> [!TIP]
>
> ##### 🥓 Example Usage
> To use this action, create a new pull request with a fuzzy title and good description.
> The action will automatically convert the pull request title into a conventional commit message and patch it to the pull request.

---

## 🎋 Links

- [GitHub Action: convert_pull_req_title_into_conventional_commit_scheme](https://github.com/marketplace/actions/convert-pull-req-title-into-conventional-commit-scheme)
- [Repository: ArnavK-09/convert_pull_req_title_into_conventional_commit_scheme](https://github.com/ArnavK-09/convert_pull_req_title_into_conventional_commit_scheme)
- [Title Format: Conventional Commit Rules](https://www.conventionalcommits.org/)

<p align="center"><strong>🌟 Star this repo :) </strong></p>
