import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'
import { GetClientMutationID } from './../../utils'

const mutation = graphql`
mutation RemoveIssueMutation ($input: RemoveIssueInput!){
    removeIssue(input: $input){
        issueId
        status
    }
}
`

function commit(environment, id, onError, onCompleted) {
    return commitMutation(environment, {
        mutation,
        variables: {
            input: {
                id: id,
                clientMutationId: GetClientMutationID()
            }
        },
        onError: (error) => {
            onError(error);
        },
        onCompleted: (response) => {
            onCompleted(response)
        },
        updater: (store) => {
            const result = store.getRootField('removeIssue');
            const status = result.getValue('status');
            if (status !== true && status !== 'true' && status !== 1) {
                onError('Issue cannot be removed.');
                return;
            }
            const currentIssues = store.getRoot().getLinkedRecords('issues') || [];
            const issues = currentIssues.filter(l => l.getDataID() !== id)
            store.delete(id);
            store.getRoot().setLinkedRecords(issues, 'issues')
        }
    })
}

export default { commit }