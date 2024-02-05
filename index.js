// imports
const core = require("@actions/core");
const github = require("@actions/github");
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Generate proper prompt for llm
 * @param {string} title
 * @param {string} description
 * @param {boolean} include_emoji
 * @returns
 */
const prompt = (title, description, include_emoji = false) => {
  return `
    # Give me conventional commit message following www.conventionalcommits.org for pull request with title and description mentioned above${include_emoji ? ", also include emoji in starting" : ""}. Only in single Line.
    
    # Documentation for conventionalcommits.org:
    The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of. This convention dovetails with SemVer, by describing the features, fixes, and breaking changes made in commit messages.
    
    ### The commit message should be structured as follows:
    
    <type>[optional scope]: <description>
    
    [optional body]
    
    [optional footer(s)]

    ### The commit contains the following structural elements, to communicate intent to the consumers of your library:
    
    fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
    feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
    BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
    types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the Angular convention) recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.
    footers other than BREAKING CHANGE: <description> may be provided and follow a convention similar to git trailer format.
    Additional types are not mandated by the Conventional Commits specification, and have no implicit effect in Semantic Versioning (unless they include a BREAKING CHANGE). A scope may be provided to a commit's type, to provide additional contextual information and is contained within parenthesis, e.g., feat(parser): add ability to parse arrays.
    
    # Pull request data:
    Pull Request Title: ${title}
    Pull Request Description: ${description}
    `;
};

/**
 * Logic For Workflow
 */
const initAction = async () => {
  try {
    /**
     * Fetching inputs for actions
     **/
    const GEMINI_API_KEY = core.getInput("gemini_api_key", { required: true });
    const token = core.getInput("token", { required: true });
    const owner = github.context.repository.split("/")[0];
    const repo = github.context.repository.split("/")[1];
    const pull_number = github.context.payload.pull_request.number;
    const includeEmoji = core.getBooleanInput("include_emoji", {
      required: false,
    });

    /**
     * Logging details
     */
    core.debug(`Github Payload: ${github.context.payload}`);
    core.notice(
      `Repo Owner: ${owner}\nRepo Name: ${repo}\nPull Request Number: ${pull_number}\nEmojis Included: ${includeEmoji}`,
    );

    /**
     * Inform user about emoji
     */
    if (!includeEmoji) {
      core.notice("Emoji shouldn't be included");
    }

    /**
     * Now we need to create an instance of Octokit which will use to call
     * GitHub's REST API endpoints.
     * We will pass the token as an argument to the constructor. This token will be used to authenticate our requests.
     **/
    const octokit = new github.getOctokit(token);
    core.debug("Created github client");

    /**
     * Fetching data of pull request
     */
    const { data: pullReq } = await octokit.request(
      `GET /repos/${owner}/${repo}/pulls/${pull_number}`,
      {
        owner,
        repo,
        pull_number,
      },
    );

    /**
     * Creating vars
     */
    const prTitle = pullReq.title ?? "No Title";
    const prDescription = pullReq.description ?? "No Description";
    core.debug("Fetched Pull request information");

    /**
     * Creating new Gemini API Client Instance
     * Also, new gemini-pro model
     */
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const gemini = genAI.getGenerativeModel({ model: "gemini-pro" });

    /**
     * Generating title with gemini
     */
    const result = await gemini.generateContent(
      prompt(prTitle, prDescription, includeEmoji),
    );

    /**
     * Manipulating response into string
     */
    const response = await result.response;
    core.debug("Fetched Gemini Response");
    const gemini_response = response.text();

    /**
     * Patching pull request with new title
     */
    await octokit.request(
      `PATCH /repos/${owner}/${repo}/pulls/${pull_number}`,
      {
        owner,
        repo,
        pull_number,
        title: gemini_response,
      },
    );
    core.debug("Patched pull request with new title");
  } catch (error) {
    /**
     * If any error, inform workflow
     */
    core.setFailed(error);
  }
};

// Call the action
initAction();
