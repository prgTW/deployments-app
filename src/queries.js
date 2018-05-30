import gql from 'graphql-tag'
import _ from 'lodash'

export function buildQuery(config) {
	const reposCompiled = _.template(`
        fragment currentOid on Ref {
            target {
                ... on Commit {
                    oid
                }
            }
        }
        
        query {
         <% _.forEach (cfg, ({owner, repo, baseRef, refs}, idx) => { %>
            q<%- idx %>: repository(owner: "<%- owner %>", name: "<%- repo %>") {
                history: ref(qualifiedName: "refs/heads/<%- baseRef %>") {
                    target {
                        ... on Commit {
                            history(first: 100) {
                                edges {
                                    node {
                                        oid
                                    }
                                }
                            }
                        }
                    }
                }
            <% _.forEach(refs, (ref, idx2) => { %>
                q<%- idx2 %>: ref(qualifiedName: "refs/heads/<%- ref %>") {
                  ...currentOid
                }
            <% }); %>
            }
         <% }); %>
        }
`);

	const cfg = _.map(config, (cfg, key) => {
		const [owner, repo] = _.split(key, '/', 2)
		let refs = [cfg.baseRef]

		_.forEach(cfg.pipelines, (pipeline) => {
			_.forEach(pipeline.stages, (stage) => {
				refs.push(stage.ref);
			})
		})

		return {
			owner: owner,
			repo: repo,
            baseRef: cfg.baseRef,
			refs: _.chain(refs).uniq().value(),
		}
	});

	return gql(reposCompiled({cfg: cfg}))
}

export const QUERY_COMMITS_HISTORY = gql`
    fragment commitHistory on Ref {
        target {
            ... on Commit {
                history(first: $count) {
                    pageInfo {
                        hasNextPage
                    }
                    edges {
                        cursor
                        node {
                            abbreviatedOid
                            url
                            authoredByCommitter
                            author {
                                name
                                avatarUrl
                                user {
                                    login
                                    url
                                }
                            }
                            committer {
                                name
                                avatarUrl
                                user {
                                    login
                                    url
                                }
                            }
                            signature {
                                isValid
                            }
                            committedDate
                            messageHeadlineHTML
                            status {
                                contexts {
                                    context
                                    state
                                    targetUrl
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    query ($owner: String!, $name: String!, $qualifiedName: String!, $count: Int!) {
        repository(owner: $owner, name: $name) {
            ref(qualifiedName: $qualifiedName) {
                ...commitHistory
            }
        }
    }
`;

export const QUERY_VIEWER = gql`
    query {
        viewer {
            avatarUrl
        }
    }
`;

export const QUERY_ORGANISATION_REPOSITORIES = gql`
    query ($owner: String!) {
        organization(login: $owner) {
            login
            avatarUrl
            repositories(first: 100, affiliations: [COLLABORATOR, ORGANIZATION_MEMBER], orderBy: {field: NAME, direction: ASC}) {
                edges {
                    node {
                        owner {
                            login
                        }
                        name
                        defaultBranchRef {
                            prefix
                            name
                        }
                    }
                }
            }
        }
    }
`;
