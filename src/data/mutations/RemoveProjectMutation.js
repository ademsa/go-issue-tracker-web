import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'
import { GetClientMutationID } from './../../utils'

const mutation = graphql`
mutation RemoveProjectMutation ($input: RemoveProjectInput!){
    removeProject(input: $input){
        projectId
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
            const result = store.getRootField('removeProject');
            const status = result.getValue('status');
            if (status !== true && status !== 'true' && status !== 1) {
                onError('Project cannot be removed.');
                return;
            }
            const currentProjects = store.getRoot().getLinkedRecords('projects') || [];
            const projects = currentProjects.filter(l => l.getDataID() !== id)
            store.delete(id);
            store.getRoot().setLinkedRecords(projects, 'projects')
        }
    })
}

const exports = { commit }

export default exports