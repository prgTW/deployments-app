import gql from 'graphql-tag'

export const QUERY_COMMITS_HISTORY = gql`
    fragment commitHistory on Ref {
        target {
            ... on Commit {
                history(first: $count) {
                    edges {
                        node {
#                            oid
                            abbreviatedOid
                            url
                            authoredByCommitter
                            author {
                                avatarUrl
                                user {
                                    login
                                    url
                                }
                            }
                            committer {
                                avatarUrl
                                user {
                                    login
                                    url
                                }
                            }
                            committedDate
#                            message
#                            messageHeadline
                            messageHeadlineHTML
#                            messageBody
#                            messageBodyHTML
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
