import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'
import { GetClientMutationID } from './../../utils'

const mutation = graphql`
mutation UpdateProjectMutation ($input: UpdateProjectInput!){
    updateProject(input: $input){
        project{
            id
            name
            description
        }
    }
}
`

function commit(environment, id, name, description, onError, onCompleted) {
    const input = {
        id: id,
        name: name,
        description: description,
        clientMutationId: GetClientMutationID()
    }

    return commitMutation(environment, {
        mutation,
        variables: {
            input,
        },
        onError: (error) => {
            onError(error);
        },
        onCompleted: (result) => {
            onCompleted(result.updateProject.project.id)
        },
    })
}

export default { commit }