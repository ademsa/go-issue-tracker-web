import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'
import { GetClientMutationID } from './../../utils'

const mutation = graphql`
mutation RemoveLabelMutation ($input: RemoveLabelInput!){
    removeLabel(input: $input){
        labelId
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
            const result = store.getRootField('removeLabel');
            const status = result.getValue('status');
            if (status !== true && status !== 'true' && status !== 1) {
                onError('Label cannot be removed.');
                return;
            }
            const currentLabels = store.getRoot().getLinkedRecords('labels') || [];
            const labels = currentLabels.filter(l => l.getDataID() !== id)
            store.delete(id);
            store.getRoot().setLinkedRecords(labels, 'labels')
        }
    })
}

export default { commit }