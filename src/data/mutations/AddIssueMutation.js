import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'
import { GetClientMutationID } from './../../utils'

const mutation = graphql`
mutation AddIssueMutation ($input: AddIssueInput!){
    addIssue(input: $input){
        issue{
            id
            title
            description
            status
            projectId
            project{
                id
                name
                description
            }
            labels(first:1000) @connection(key:"AddIssueMutation_labels"){
                edges{
                    node{
                        id
                        name
                        colorHexCode
                    }
                }
            }
        }
    }
}
`

function commit(environment, title, description, status, projectId, labels, onError, onCompleted, onUpdated) {
    return commitMutation(environment, {
        mutation,
        variables: {
            input: {
                title: title,
                description: description,
                status: status,
                projectId: projectId,
                labels: labels,
                clientMutationId: GetClientMutationID()
            }
        },
        onError: (error) => {
            onError(error);
        },
        onCompleted: (result) => {
            onCompleted(result.addIssue.issue.id)
        },
        updater: (store) => {
            const result = store.getRootField('addIssue');
            const issue = result.getLinkedRecord('issue');
            const id = issue.getValue('id');
            if (result === undefined || issue === undefined || id === undefined) {
                onError('error from updater');
                return;
            }

            const issues = store.getRoot().getLinkedRecords('issues') || [];
            store.getRoot().setLinkedRecords([...issues, store.get(id)], 'issues')
            if (onUpdated !== undefined) {
                onUpdated();
            }
        }
    })
}

const exports = { commit }

export default exports