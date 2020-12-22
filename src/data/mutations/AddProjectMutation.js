import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'
import { GetClientMutationID } from './../../utils'

const mutation = graphql`
mutation AddProjectMutation ($input: AddProjectInput!){
    addProject(input: $input){
        project{
            id
            name
            description
        }
    }
}
`

function commit(environment, name, description, onError, onCompleted, onUpdated) {
    return commitMutation(environment, {
        mutation,
        variables: {
            input: {
                name: name,
                description: description,
                clientMutationId: GetClientMutationID()
            }
        },
        onError: (error) => {
            onError(error);
        },
        onCompleted: (result) => {
            onCompleted(result.addProject.project.id)
        },
        updater: (store) => {
            const result = store.getRootField('addProject');
            const project = result.getLinkedRecord('project');
            const id = project.getValue('id');
            if (result === undefined || project === undefined || id === undefined) {
                onError('error from updater');
                return;
            }

            const projects = store.getRoot().getLinkedRecords('projects') || [];
            store.getRoot().setLinkedRecords([...projects, store.get(id)], 'projects')
            if (onUpdated !== undefined) {
                onUpdated();
            }
        }
    })
}

const exports = { commit }

export default exports