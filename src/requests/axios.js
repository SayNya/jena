import axios from "axios";

export const JENA_URL = 'http://localhost:3030/ontology';

export function getClasses() {
    return new Promise((resolve, reject) => {
        axios.post(
            JENA_URL + "/query",
            null,
            {
                params: {
                    query: "prefix owl: <http://www.w3.org/2002/07/owl#>\n" +
                        "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                        "\n" +
                        "SELECT DISTINCT ?class ?label ?subClassOf\n" +
                        "WHERE {\n" +
                        "  ?class a owl:Class.\n" +
                        "  OPTIONAL { ?class rdfs:label ?label}\n" +
                        "  OPTIONAL { ?class rdfs:subClassOf ?subClassOf}\n" +
                        "}"
                }
            })
            .then(res => {
                resolve(res.data.results.bindings)
            })
            .catch(err => reject(err))
    })
}

export function getProperties() {
    return new Promise((resolve, reject) => {
        axios.post(
            JENA_URL + "/query",
            null,
            {
                params: {
                    query: "prefix owl: <http://www.w3.org/2002/07/owl#>\n" +
                        "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                        "\n" +
                        "SELECT DISTINCT ?property ?label ?inverseOf\n" +
                        "WHERE {\n" +
                        "\t?property a owl:ObjectProperty.\n" +
                        "\tOPTIONAL { ?property rdfs:label ?label}\n" +
                        "\tOPTIONAL { ?property owl:inverseOf ?inverseOf}\n" +
                        "}\n"
                }
            })
            .then(res => {
                resolve(res.data.results.bindings)
            })
            .catch(err => reject(err))
    })
}

export function getEntities() {
    return new Promise((resolve, reject) => {
        axios.post(
            JENA_URL + "/query",
            null,
            {
                params: {
                    query: "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
                        "SELECT ?subject ?property ?value\n" +
                        "WHERE {\n" +
                        "  ?subject ?property ?value .\n" +
                        "  ?subject a owl:NamedIndividual .\n" +
                        "}\n"
                }
            })
            .then(res => {
                resolve(res.data.results.bindings)
            })
            .catch(err => reject(err))
    })
}

export async function createEntity(entityname, classname) {
    await axios.post(
        JENA_URL + "/update",
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "INSERT DATA\n" +
        "{\n" +
        `  <http://www.semanticweb.org/ontologies#${entityname}> rdf:type <${classname}> .\n` +
        `  <http://www.semanticweb.org/ontologies#${entityname}> rdf:type <http://www.w3.org/2002/07/owl#NamedIndividual> .\n` +
        `  <http://www.semanticweb.org/ontologies#${entityname}> rdfs:label \"${entityname}\" .\n` +
        "}",
        {
            headers: {
                'Authorization': `Basic YWRtaW46YWRtaW4=`,
                'Content-Type': 'application/sparql-update',
            }
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => console.log(err))

}

export async function updateLabel(entityName, prevLabel, newLabel) {
    await axios.post(
        JENA_URL + "/update",
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "\n" +
        "DELETE {\n" +
        `  <${entityName}> rdfs:label \"${prevLabel}\" .\n` +
        "}\n" +
        "INSERT {\n" +
        `  <${entityName}> rdfs:label \"${newLabel}\" .\n` +
        "}\n" +
        "WHERE {\n" +
        `  <${entityName}> rdfs:label \"${prevLabel}\" .\n` +
        "}",
        {
            headers: {
                'Authorization': `Basic YWRtaW46YWRtaW4=`,
                'Content-Type': 'application/sparql-update',
                'Origin': 'http://localhost:3000/',
            }
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => console.log(err))

}

export function search1(classname1, classname2) {
    classname1 = classname1.replaceAll(" ", "_")
    classname2 = classname2.replaceAll(" ", "_")
    return new Promise((resolve, reject) => {
        axios.post(
            JENA_URL + "/query",
            null,
            {
                params: {
                    query: "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                        "\n" +
                        "SELECT ?s ?label\n" +
                        "WHERE {\n" +
                        "  {\n" +
                        `  ?s rdf:type <http://www.semanticweb.org/ontologies#${classname1}> .\n` +
                        "  ?s rdfs:label ?label .\n" +
                        "  }\n" +
                        "  UNION\n" +
                        "  {\n" +
                        `  ?s rdf:type <http://www.semanticweb.org/ontologies#${classname2}> .\n` +
                        "  ?s rdfs:label ?label .\n" +
                        "  }\n" +
                        "}"
                }
            })
            .then(res => {
                resolve(res.data.results.bindings)
            })
            .catch(err => reject(err))
    })
}

export function search2(classname, author) {
    classname = classname.replaceAll(" ", "_")
    author = author.replaceAll(" ", "_")
    return new Promise((resolve, reject) => {
        axios.post(
            JENA_URL + "/query",
            null,
            {
                params: {
                    query: "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                        "PREFIX ontologies: <http://www.semanticweb.org/ontologies#>\n" +
                        "\n" +
                        "SELECT ?s ?label\n" +
                        "WHERE {\n" +
                        "  {\n" +
                        `  ?s rdf:type <http://www.semanticweb.org/ontologies#${classname}> .\n` +
                        "  ?s rdfs:label ?label .\n" +
                        "  }\n" +
                        "  UNION\n" +
                        "  {\n" +
                        `  ?s ontologies:hasAuthor <http://www.semanticweb.org/ontologies#${author}> .\n` +
                        "  ?s rdfs:label ?label .\n" +
                        "}\n" +
                        "}"
                }
            })
            .then(res => {
                resolve(res.data.results.bindings)
            })
            .catch(err => reject(err))
    })
}

export function search3(classname, author) {
    classname = classname.replaceAll(" ", "_")
    author = author.replaceAll(" ", "_")
    return new Promise((resolve, reject) => {
        axios.post(
            JENA_URL + "/query",
            null,
            {
                params: {
                    query: "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                        "PREFIX ontologies: <http://www.semanticweb.org/ontologies#>\n" +
                        "\n" +
                        "SELECT ?s ?label\n" +
                        "WHERE {\n" +
                        `  ?s rdf:type <http://www.semanticweb.org/ontologies#${classname}> .\n` +
                        `  ?s ontologies:hasAuthor <http://www.semanticweb.org/ontologies#${author}> .\n` +
                        "  ?s rdfs:label ?label .\n" +
                        "}"
                }
            })
            .then(res => {
                resolve(res.data.results.bindings)
            })
            .catch(err => reject(err))
    })
}
