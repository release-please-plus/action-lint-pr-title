/* eslint-disable prettier/prettier */
import * as core from '@actions/core'
import * as github from '@actions/github'

import { validatePrTitle } from './validatePrTitle'

export async function main() {
  try {
    const client = github.getOctokit(process.env.GITHUB_TOKEN as string)

    const contextPullRequest = github.context.payload.pull_request
    if (!contextPullRequest) {
      throw new Error(
        "This action can only be invoked in `pull_request_target` or `pull_request` events. Otherwise the pull request can't be inferred."
      )
    }
    const owner = contextPullRequest.base.user.login
    const repo = contextPullRequest.base.repo.name
    // The pull request info on the context isn't up to date. When
    // the user updates the title and re-runs the workflow, it would
    // be outdated. Therefore fetch the pull request via the REST API
    // to ensure we use the current title.
    const { data: pullRequest } = await client.rest.pulls.get({
      owner,
      repo,
      pull_number: contextPullRequest.number
    })

    await validatePrTitle(pullRequest.title)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error.message as string)
  }
}

/* c8 ignore next 4 */
if (require.main === module) {
  main().catch(err => {
    core.setFailed(`release-please failed: ${err.message}`)
  })
} else {
  module.exports = {
    main
  }
}
