# 4u/jira-webhook-action@v1

Small action to call jira webhook by github trigger.

## How to use

1. Issue Jira Permanent Token and set it to `JIRA_TOKEN` secret.
2. Set `JIRA_WEBHOOK` secret, e.g. `https://automation.atlassian.com/pro/hooks/abcde`
3. Create your workflow and use `4u/jira-webhook-action@v1` action, e.g. `.github/workflows/review-requested.yml`:

```
name: Review Requested

on:
  pull_request:
    types: [review_requested]
jobs:
  review-requested:
    runs-on: ubuntu-latest

    steps:
      - name: 'set code review state'
        uses: 4u/jira-webhook-action@v1
        with:
          github_token: ${{ github.token }}
          data: '{"action": "review_requested"}'
          webhooks: |
            ${{ secrets.JIRA_WEBHOOK_1 }}
            ${{ secrets.JIRA_WEBHOOK_2 }}
            ${{ secrets.JIRA_WEBHOOK_3 }}
```
