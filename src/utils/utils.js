export function getSortedEntities(entities) {
    entities = entities.filter(obj => obj.value.value !== "http://www.w3.org/2002/07/owl#NamedIndividual")

    const combinedArr = [];

    entities.forEach(obj => {
        const index = combinedArr.findIndex(x => x.subject === obj.subject.value);
        if (index === -1) {
            combinedArr.push({
                subject: obj.subject.value,
                properties: [{property: obj.property.value, value: obj.value.value}],
            });
        } else {
            combinedArr[index].properties.push({
                property: obj.property.value,
                value: obj.value.value,
            });
        }
    });

    let result = {};

    combinedArr.forEach(obj => {
        const result_names = Object.getOwnPropertyNames(result);
        const index = obj.properties.findIndex(x => x.property === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
        const type_name = obj.properties[index].value;
        if (result_names.includes(type_name)) {
            result[type_name].push(obj);
        } else {
            result[type_name] = [obj];
        }
    });
    var a = [], i;
    for (i in result) {
        if (result.hasOwnProperty(i)) {
            a.push([i, result[i]]);
        }
    }
    a.sort(function (a, b) {
        return a[0] > b[0] ? 1 : -1;
    })


    return a.map(innerArr => innerArr[1]);
}

export function getStrAfterHashtag(str) {
    let index = str.indexOf("#");
    return  str.substring(index + 1);
}