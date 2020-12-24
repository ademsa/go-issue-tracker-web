import graphql from 'babel-plugin-relay/macro'
import { commitMutation } from 'react-relay'
import { GetClientMutationID } from './../../utils'

const mutation = graphql`
mutation UpdateIssueMutation ($input: UpdateIssueInput!){
    updateIssue(input: $input){
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

function commit(environment, id, title, description, status, labels, onError, onCompleted) {
    const input = {
        id: id,
        title: title,
        description: description,
        status: status,
        labels: labels,
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
            onCompleted(result.updateIssue.issue.id)
        },
    })
}

const exports = { commit }

export default exports