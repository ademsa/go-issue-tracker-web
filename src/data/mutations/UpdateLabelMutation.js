import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'
import { GetClientMutationID } from './../../utils'

const mutation = graphql`
mutation UpdateLabelMutation ($input: UpdateLabelInput!){
    updateLabel(input: $input){
        label{
            id
            name
            colorHexCode
        }
    }
}
`

function commit(environment, id, name, colorHexCode, onError, onCompleted) {
    const input = {
        id: id,
        name: name,
        colorHexCode: colorHexCode,
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
            onCompleted(result.updateLabel.label.id)
        },
    })
}

export default { commit }