import gql from 'graphql-tag'

export const QUERY_COMMITS_HISTORY = gql`
    fragment commitHistory on Ref {
        target {
            ... on Commit {
                history(first: $count) {
                    edges {
                        node {
                            oid
                            abbreviatedOid
                            url
                            authoredByCommitter
                            author {
                                name
                                avatarUrl
                                user {
                                    url
                                }
                            }
                            committer {
                                name
                                avatarUrl
                                user {
                                    url
                                }
                            }
                            authoredDate
                            committedDate
                            additions
                            deletions
                            message
                            messageHeadline
                            messageHeadlineHTML
                            messageBody
                            messageBodyHTML
                            status {
                                contexts {
                                    context
                                    state
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
