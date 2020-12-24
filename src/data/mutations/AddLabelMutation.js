import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'
import { GetClientMutationID } from './../../utils'

const mutation = graphql`
mutation AddLabelMutation ($input: AddLabelInput!){
    addLabel(input: $input){
        label{
            id
            name
            colorHexCode
        }
    }
}
`

function commit(environment, name, colorHexCode, onError, onCompleted, onUpdated) {
    return commitMutation(environment, {
        mutation,
        variables: {
            input: {
                name: name,
                colorHexCode: colorHexCode,
                clientMutationId: GetClientMutationID()
            }
        },
        onError: (error) => {
            onError(error);
        },
        onCompleted: (result) => {
            onCompleted(result.addLabel.label.id)
        },
        updater: (store) => {
            const result = store.getRootField('addLabel');
            const label = result.getLinkedRecord('label');
            const id = label.getValue('id');
            if (result === undefined || label === undefined || id === undefined) {
                onError('error from updater');
                return;
            }

            const labels = store.getRoot().getLinkedRecords('labels') || [];
            store.getRoot().setLinkedRecords([...labels, store.get(id)], 'labels')
            if (onUpdated !== undefined) {
                onUpdated();
            }
        }
    })
}

const exports = { commit }

export default exports