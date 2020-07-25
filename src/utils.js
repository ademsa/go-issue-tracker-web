export function GetClientMutationID() {
    return Math.random().toString(36).substring(2, 20)
}

export function GetObjIDsAsStringArray(items) {
    let values = [];
    items.map(item => (
        values.push(item.id)
    ))
    return values.join(',')
}